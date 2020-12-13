class NotFoundError extends Error {
  constructor(message, errData) {
    super();
    this.status_code = 404;
    this.message = message || "Not Found";
    this.data = errData || {};
  }
}

class BadRequestError extends Error {
  constructor(message, errData) {
    super();
    this.status_code = 400;
    this.message = message || "Bad Request";
    this.data = errData || {};
  }
}

class UnauthorizedError extends Error {
  constructor(message, errData) {
    super();
    this.status_code = 401;
    this.message = message || "Unauthorized";
    this.data = errData || {};
  }
}

class ForbiddenError extends Error {
  constructor(message, errData) {
    super();
    this.status_code = 401;
    this.message = message || "Forbidden";
    this.data = errData || {};
  }
}

class ValidationError extends Error {
  constructor(message, errData) {
    super();
    this.status_code = 422;
    this.message = message || "Validation Error";
    this.data = errData || {};
  }
}

module.exports = {
  NotFoundError,
  ValidationError,
  ForbiddenError,
  UnauthorizedError,
  BadRequestError,
};
