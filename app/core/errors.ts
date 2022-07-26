/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

class NotFoundError extends Error {
  status = 404;

  constructor(message = "Page not found") {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

class ForbiddenError extends Error {
  status = 403;

  constructor(message = "Access denied") {
    super(message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export { NotFoundError, ForbiddenError };
