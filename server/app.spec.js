const app = require("./app");
const chai = require("chai");
const request = require("supertest");
const sinon = require("sinon");

describe("Testing app", () => {
  it("starts the application server", async () => {
    sinon.stub(console, "log");
    const sharedApp = app();
    sharedApp.create();
    await sharedApp.start();
    after(() => sharedApp.close());
    // add fake handler
    sharedApp.app.get("/test", (_req, res) => {
      res.end();
    });
    await request(sharedApp.app).get("/test").expect(200);
    console.log.restore();
  });

  it("fails because trying to start the server before creating it", async () => {
    const appInstance = app();
    chai.expect(appInstance.start).to.throw();
  });

  it("fails because trying to close the server before starting it", async () => {
    const appInstance = app();
    chai.expect(appInstance.close).to.throw();
  });
});
