class BaseError extends Error {
  constructor(message, status, ...args) {
    if (typeof message !== "string") {
      throw new Error(
        `First argument 'message' must be a string in BaseError constructor. Got: ${typeof message}`
      );
    }
    if (typeof status !== "number") {
      throw new Error(
        `Second argument 'status' must be a number in BaseError constructor. Got: ${typeof status}`
      );
    }
    super(message, ...args);
    this.name = this.type = "BaseError";
    this.message = message;
    this.status = status;
    this.loggable = false;
  }

  toJSON() {
    return { message: this.message };
  }

  toResponse(res) {
    if (this.loggable && this.stack) {
      console.error(this.stack);
    } else if (this.loggable) {
      console.error(this.toString());
    }
    res.status(this.status).json({ error: this.toJSON() });
  }
}

module.exports = BaseError;
