export class BaseError {
  toString() {
    return `${this.code} ${this.message}`;
  }
}

export class NoAccessError extends BaseError {
  code = 1;
  message = 'access denied';
}
