type Status = 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500 | 503;

export class HttpExceptionError extends Error {
  public status: Status;

  constructor(status: Status, public readonly message: string | any) {
    super();
    this.status = status;
    this.message = message;
    this.name = "HttpExceptionError";
  }
}
