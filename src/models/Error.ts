export class CustomError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ProtocolError extends CustomError {
  public code?: number
  public originalMessage = ''
}
