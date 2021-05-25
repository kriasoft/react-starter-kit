/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

export class NotFoundError extends Error {
  status = 404;

  constructor(message = "Page not found") {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
