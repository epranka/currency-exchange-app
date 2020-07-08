const BaseError = require("./BaseError");

class ServerError extends BaseError {
  constructor(message, status = 503) {
    super(message, status);
    this.name = this.type = "ServerError";
    this.loggable = true;
  }
}

module.exports = ServerError;
