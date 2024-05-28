import { ValidationError } from 'express-validator';

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
    message: string,
    errors: Error[] | ValidationError[] | [] = [],
  ): ApiError {
    return new ApiError(400, message, errors);
  }
  public static NotAuthorized(): ApiError {
    return new ApiError(401, 'Not athorized');
  }
  public static Forbidden(): ApiError {
    return new ApiError(403, 'Access forbidden');
  }
  public static NotFound(message: string = 'Not Found'): ApiError {
    return new ApiError(404, message);
  }
  public static InternalServerError(): ApiError {
    return new ApiError(500, 'Internal Server Error');
  }
}
