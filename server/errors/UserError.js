const BaseError = require("./BaseError");

class UserError extends BaseError {
  static name = "UserError";
  static defaultStatus = 400;
  constructor(message, status = UserError.defaultStatus, payload) {
    super(message, status);
    if (payload && typeof payload !== "object") {
      throw new Error(
        `Third parameter 'payload' must be an undefined or an object in UserError constructor. Got: ${typeof payload}`
      );
    }
    this.name = this.type = UserError.name;
    this.payload = payload;
  }

  toJSON() {
    return { ...this.payload, message: this.message };
  }
}

module.exports = UserError;
