export default class ApiError extends Error {
  public message: string;
  public status: number;
  public errors: Error[];

  constructor(status: number, message: string, errors: Error[] | void) {
    super(message);
    this.message = message || 'Unknown error';
    this.status = status;
    this.errors = errors || [];
    Error.captureStackTrace(this, this.constructor);
  }

  public static BadRequest(
    message = 'Bad Request',
    errors: Error[] | [] = [],
  ): ApiError {
    return new ApiError(400, message, errors);
  }
  public static NotAuthorized(message = 'Not athorized'): ApiError {
    return new ApiError(401, message);
  }
  public static Forbidden(message = 'Access forbidden'): ApiError {
    return new ApiError(403, message);
  }
  public static NotFound(message = 'Not Found'): ApiError {
    return new ApiError(404, message);
  }
  public static InternalServerError(
    message = 'Internal Server Error',
  ): ApiError {
    return new ApiError(500, message);
  }
}
