const UserError = require("./UserError");

const chai = require("chai");

const userErrorMessage = "User error test";
const userErrorStatus = 400;
const userErrorPayload = { foo: "bar" };

describe("Testing UserError", () => {
  it("creates the user error with default status code", () => {
    const userError = new UserError(userErrorMessage);
    chai.expect(userError.message).to.equal(userErrorMessage);
    chai.expect(userError.name).to.equal(UserError.name);
    chai.expect(userError.type).to.equal(UserError.name);
    chai.expect(userError.status).to.equal(UserError.defaultStatus);
    chai.expect(userError.loggable).to.equal(false);
  });

  it("creates the user error with a custom status code", () => {
    const userError = new UserError(userErrorMessage, userErrorStatus);
    chai.expect(userError.status).to.equal(userErrorStatus);
  });

  it("creates the json with the payload", () => {
    const userError = new UserError(
      userErrorMessage,
      userErrorStatus,
      userErrorPayload
    );
    const json = userError.toJSON();
    chai.expect(Object.keys(json)).to.be.length(2);
    chai.expect(json).to.have.property("foo");
    chai.expect(json).to.have.property("message");
    chai.expect(json.foo).to.equal("bar");
    chai.expect(json.message).to.equal(userErrorMessage);
  });

  it("fails to create the user error because of invalid payload", () => {
    chai
      .expect(
        () => new UserError(userErrorMessage, userErrorStatus, "bad payload")
      )
      .to.throw(/payload/);
  });
});
