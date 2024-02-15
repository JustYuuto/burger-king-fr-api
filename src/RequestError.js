module.exports = class RequestError extends Error {

  constructor(message, details) {
    super(`${message}`);

    this.status = details.status ? `${details.status} ${details.error}` : details.code;
    this.msg = details.message;
  }

};
