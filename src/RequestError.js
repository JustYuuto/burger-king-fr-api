module.exports = class RequestError extends Error {

  constructor(message, details) {
    super(`${message}`);

    this.status = `${details.status} ${details.error}`;
    this.msg = details.message;
  }

};