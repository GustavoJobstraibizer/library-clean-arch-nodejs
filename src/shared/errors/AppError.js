module.exports = class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }

  static dependencyError = 'Dependency must be provided';
};
