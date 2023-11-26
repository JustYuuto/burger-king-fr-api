module.exports = class RequestError extends Error {

  constructor(message, details) {
    super(`${message}`);

    this.status = details.status;
    this.msg = details.message;
  }


};