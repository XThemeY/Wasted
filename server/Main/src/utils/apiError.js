export default class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
  static UnathorizedError() {
    return new ApiError(401, 'Пользователь не авторизован');
  }
  static Forbidden() {
    return new ApiError(403, 'Доступ запрещен');
  }
  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
  static InternalServerError() {
    return new ApiError(500, 'Internal Server Error');
  }
}
