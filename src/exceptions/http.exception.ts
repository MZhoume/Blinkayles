import { SerializableException } from './abstractions/serializable.exception';

export class HttpException extends SerializableException {
  public statusCode: number;

  constructor(statusCode: number, message?: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
