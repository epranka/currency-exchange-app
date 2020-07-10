const BaseError = require("./BaseError");

const sinon = require("sinon");
const chai = require("chai");

const baseErrorMessage = "Base error test";
const baseErrorStatus = 500;

const mockResponse = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

const createValidError = () => {
  return new BaseError(baseErrorMessage, baseErrorStatus);
};

const createInvalidMessageError = () => {
  return new BaseError();
};

const createInvalidStatusError = () => {
  return new BaseError("Base errro test");
};

describe("Testing BaseError", () => {
  it("creates the base error", () => {
    const baseError = createValidError();
    chai.expect(baseError.name).to.equal("BaseError");
    chai.expect(baseError.type).to.equal("BaseError");
    chai.expect(baseError.status).to.equal(baseErrorStatus);
    chai.expect(baseError.loggable).to.equal(false);
  });

  it("fails to create the base error because of invalid message", () => {
    chai.expect(createInvalidMessageError).to.throw(Error, /message/);
  });

  it("fails to create the base error because of invalid status", () => {
    chai.expect(createInvalidStatusError).to.throw(Error, /status/);
  });

  it("creates the json", () => {
    const baseError = createValidError();
    const json = baseError.toJSON();
    chai.expect(Object.keys(json)).to.be.length(1);
    chai.expect(json).to.have.property("message");
    chai.expect(json.message).to.equal(baseErrorMessage);
  });

  it("sends error to response", () => {
    const baseError = createValidError();
    const res = mockResponse();
    baseError.toResponse(res);
    chai.expect(res.status.calledWith(baseErrorStatus)).to.be.ok;
  });

  it("sends loggable error with stack to response", () => {
    const baseError = createValidError();
    baseError.loggable = true;
    const res = mockResponse();
    sinon.stub(console, "error");
    baseError.toResponse(res);
    chai.expect(console.error.called).to.be.ok;
    chai.expect(res.status.calledWith(baseErrorStatus)).to.be.ok;
    console.error.restore();
  });

  it("sends loggable error without stack to response", () => {
    const baseError = createValidError();
    baseError.loggable = true;
    baseError.stack = undefined;
    const res = mockResponse();
    sinon.stub(console, "error");
    baseError.toResponse(res);
    chai.expect(console.error.called).to.be.ok;
    chai.expect(res.status.calledWith(baseErrorStatus)).to.be.ok;
    console.error.restore();
  });
});
