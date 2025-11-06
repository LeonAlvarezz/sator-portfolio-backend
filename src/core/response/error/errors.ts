import createHttpError from "http-errors";

export const ThrowInternalServerError = (message?: string) => {
  throw createHttpError(500, {
    message: message ? message : "Something Went Wrong!",
  });
};

export const ThrowUnauthorizedError = (message?: string) => {
  throw createHttpError(401, {
    message: message ? message : "Unauthorized",
  });
};

export const ThrowForbiddenError = (message?: string) => {
  throw createHttpError(403, {
    message: message ? message : "Forbidden",
  });
};

export const ThrowNotFoundError = (message?: string) => {
  throw createHttpError(404, {
    message: message ? message : "Not Found",
  });
};

export const ThrowConflictError = (message?: string) => {
  throw createHttpError(409, {
    message: message ? message : "Conflict Record",
  });
};
