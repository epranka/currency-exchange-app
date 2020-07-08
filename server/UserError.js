const BaseError = require("./BaseError");

class UserError extends BaseError {
  constructor(message, status = 400, payload) {
    super(message, status);
    if (payload && typeof payload !== "object") {
      throw new Error(
        `Third parameter 'payload' must be an undefined or an object in UserError constructor. Got: ${typeof payload}`
      );
    }
    this.name = this.type = "UserError";
    this.payload = payload;
  }

  toJSON() {
    return { ...this.payload, message: this.message };
  }
}

module.exports = UserError;
