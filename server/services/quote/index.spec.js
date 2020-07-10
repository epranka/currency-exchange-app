const quoteService = require(".");

const sinon = require("sinon");
const fetchMock = require("fetch-mock");
const chai = require("chai");
const UserError = require("../../errors/UserError");
const ServerError = require("../../errors/ServerError");
const { consoleTestResultHandler } = require("tslint/lib/test");
const { default: fetch } = require("node-fetch");
const { camelize } = require("tslint/lib/utils");

const mockRequest = (base_currency, quote_currency, base_amount) => {
  const req = {};
  req.query = { base_currency, quote_currency, base_amount };
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

const mockNext = () => {
  return sinon.stub();
};

const expectUserError = (mockedNext, matchMessage) => {
  chai.expect(mockedNext.called).to.be.ok;
  chai.expect(mockedNext.firstCall.firstArg).to.be.ok;
  chai.expect(mockedNext.firstCall.firstArg.name).to.equal(UserError.name);
  chai.expect(mockedNext.firstCall.firstArg.status).to.equal(422);
  chai.expect(mockedNext.firstCall.firstArg.message).to.match(matchMessage);
};

const expectServerError = (mockedNext, matchMessage) => {
  chai.expect(mockedNext.called).to.be.ok;
  chai.expect(mockedNext.firstCall.firstArg).to.be.ok;
  chai.expect(mockedNext.firstCall.firstArg.name).to.equal(ServerError.name);
  chai
    .expect(mockedNext.firstCall.firstArg.status)
    .to.equal(ServerError.defaultStatus);
  chai.expect(mockedNext.firstCall.firstArg.message).to.match(matchMessage);
};

describe("Testing Quote service", () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it("fails because of invalid base currency", async () => {
    const req = mockRequest("invalid base currency");
    const res = mockResponse();
    const next = mockNext();
    await quoteService(req, res, next);
    expectUserError(next, /base currency/i);
    chai
      .expect(next.firstCall.firstArg.payload.field)
      .to.equal("base_currency");
  });

  it("fails because of invalid quote currency", async () => {
    const req = mockRequest("USD", "invalid quote currency");
    const res = mockResponse();
    const next = mockNext();
    await quoteService(req, res, next);
    expectUserError(next, /quote currency/i);
    chai
      .expect(next.firstCall.firstArg.payload.field)
      .to.equal("quote_currency");
  });

  describe("fail because of invalid base amount", () => {
    it("is not a number", async () => {
      const req = mockRequest("USD", "EUR", "invalid base amount");
      const res = mockResponse();
      const next = mockNext();
      await quoteService(req, res, next);
      expectUserError(next, /base amount/i);

      chai
        .expect(next.firstCall.firstArg.payload.field)
        .to.equal("base_amount");
    });

    it("is a float", async () => {
      const req = mockRequest("USD", "EUR", 1.23);
      const res = mockResponse();
      const next = mockNext();
      await quoteService(req, res, next);
      expectUserError(next, /base amount/i);
      chai
        .expect(next.firstCall.firstArg.payload.field)
        .to.equal("base_amount");
    });

    it("is a negative", async () => {
      const req = mockRequest("USD", "EUR", -1);
      const res = mockResponse();
      const next = mockNext();
      await quoteService(req, res, next);
      expectUserError(next, /base amount/i);
      chai
        .expect(next.firstCall.firstArg.payload.field)
        .to.equal("base_amount");
    });

    it("is not a safe integer", async () => {
      const req = mockRequest("USD", "EUR", Number.MAX_SAFE_INTEGER + 1);
      const res = mockResponse();
      const next = mockNext();
      await quoteService(req, res, next);
      expectUserError(next, /is too big/);
    });
  });

  it("returns exchange rate equal to 1 and same base amount", async () => {
    const base_amount = 100;
    const req = mockRequest("EUR", "EUR", base_amount);
    const res = mockResponse();
    await quoteService(req, res);
    chai.expect(
      res.json.calledWithExactly({
        exchange_rate: 1,
        quote_amount: base_amount,
      })
    ).to.be.ok;
  });

  it("fails because of failed fetch api", async () => {
    sinon.stub(console, "error");
    fetchMock.mock("begin:https://api.exchangeratesapi.io/latest", {
      body: {
        error: "Some error from the api",
      },
      status: 422,
    });
    const req = mockRequest("EUR", "USD", 100);
    const res = mockResponse();
    const next = mockNext();
    await quoteService(req, res, next);
    expectServerError(next, /something wrong/i);
    chai.expect(console.error.calledWithMatch(/code received/)).to.be.ok;
    fetchMock.restore();
    console.error.restore();
  });

  it("fails because of invalid fetch api response", async () => {
    sinon.stub(console, "error");
    fetchMock.mock("begin:https://api.exchangeratesapi.io/latest", {
      body: { bad: "response" },
      status: 200,
    });
    const req = mockRequest("EUR", "USD", 100);
    const res = mockResponse();
    const next = mockNext();
    await quoteService(req, res, next);
    expectServerError(next, /something wrong/i);
    fetchMock.restore();
    console.error.restore();
  });

  it("fails because of result is out of safe computable range", async () => {
    fetchMock.mock("begin:https://api.exchangeratesapi.io/latest", {
      body: {
        rates: {
          ILS: 2,
        },
      },
    });
    const req = mockRequest("EUR", "ILS", Number.MAX_SAFE_INTEGER - 1);
    const res = mockResponse();
    const next = mockNext();
    await quoteService(req, res, next);
    expectUserError(next, /result is out of/);
    fetchMock.restore();
  });

  it("successfully returns calculated result and adds it to the cache", async () => {
    const exchange_rate = 1.569858;
    const base_amount = 100;
    fetchMock.mock("begin:https://api.exchangeratesapi.io/latest", {
      body: {
        rates: {
          USD: exchange_rate,
        },
      },
    });
    const req = mockRequest("EUR", "USD", base_amount);
    const res = mockResponse();
    await quoteService(req, res);
    chai.expect(
      res.json.calledWith({
        exchange_rate: Math.round(exchange_rate * 1000) / 1000,
        quote_amount: Math.round(base_amount * exchange_rate),
      })
    ).to.be.ok;
    await quoteService(req, res);
    chai.expect(fetchMock.calls().length).to.equal(1);
    chai.expect(
      res.json.secondCall.calledWith({
        exchange_rate: Math.round(exchange_rate * 1000) / 1000,
        quote_amount: Math.round(base_amount * exchange_rate),
      })
    ).to.be.ok;
    fetchMock.restore();
  });
});
