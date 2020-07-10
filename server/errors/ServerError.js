const BaseError = require("./BaseError");

class ServerError extends BaseError {
  static defaultStatus = 503;
  static name = "ServerError";
  constructor(message, status = ServerError.defaultStatus) {
    super(message, status);
    this.name = this.type = ServerError.name;
    this.loggable = true;
  }
}

module.exports = ServerError;
