/* eslint-disable @typescript-eslint/no-explicit-any */

export enum ErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER = 500,
}

export enum DefaultErrorMessage {
  BAD_REQUEST = "Bad Request",
  UNAUTHORIZED = "Unauthorized",
  FORBIDDEN = "Forbidden",
  NOT_FOUND = "Not Found",
  INTERNAL_SERVER = "Internal Server",
  NETWORK_ERROR = "Network Error",
  CONFLICT = "Conflict",
  REQUEST_TIMEOUT = "Request timeout",
}

export type CustomError = {
  status: number;
  message: string;
  metadata?: Record<string, string>;
};

export type ErrorParams = {
  error?: unknown;
  message?: string;
  options?: Record<string, any>;
};
export class CriticalError extends Error {
  constructor(
    public status: number,
    message: string,
    public metadata?: Record<string, string>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class BadRequestException extends CriticalError {
  constructor(params?: ErrorParams) {
    super(
      ErrorCode.BAD_REQUEST,
      params?.message || DefaultErrorMessage.BAD_REQUEST,
      params?.options
    );
  }
}

export class NotFoundException extends CriticalError {
  constructor(params?: ErrorParams) {
    super(
      ErrorCode.NOT_FOUND,
      params?.message || DefaultErrorMessage.NOT_FOUND,
      params?.options
    );
  }
}

export class UnauthorizedException extends CriticalError {
  constructor(params?: ErrorParams) {
    super(
      ErrorCode.UNAUTHORIZED,
      params?.message || DefaultErrorMessage.UNAUTHORIZED,
      params?.options
    );
  }
}

export class ForbiddenException extends CriticalError {
  constructor(params?: ErrorParams) {
    super(
      ErrorCode.FORBIDDEN,
      params?.message || DefaultErrorMessage.FORBIDDEN,
      params?.options
    );
  }
}

export class InternalServerException extends CriticalError {
  constructor(params?: ErrorParams) {
    super(
      ErrorCode.INTERNAL_SERVER,
      params?.message || DefaultErrorMessage.INTERNAL_SERVER,
      params?.options
    );
  }
}

export class ConflictException extends CriticalError {
  constructor(params?: ErrorParams) {
    super(
      ErrorCode.CONFLICT,
      params?.message || DefaultErrorMessage.CONFLICT,
      params?.options
    );
  }
}
