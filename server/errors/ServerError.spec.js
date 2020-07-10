const ServerError = require("./ServerError");

const chai = require("chai");

const serverErrorMessage = "Server error test";

describe("Testing ServerError", () => {
  it("creates the server error with default status code", () => {
    const serverError = new ServerError(serverErrorMessage);
    chai.expect(serverError.name).to.equal(ServerError.name);
    chai.expect(serverError.type).to.equal(ServerError.name);
    chai.expect(serverError.status).to.equal(ServerError.defaultStatus);
    chai.expect(serverError.loggable).to.equal(true);
  });

  it("creates the server error with a custom status code", () => {
    const serverErrorStatus = 500;
    const serverError = new ServerError(serverErrorMessage, serverErrorStatus);
    chai.expect(serverError.status).to.equal(serverErrorStatus);
  });
});
