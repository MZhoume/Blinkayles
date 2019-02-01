import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/http.exception';
import { GameException } from '../exceptions/abstractions/game.exception';

export function globalErrorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof GameException) {
    res.status(400).send(error);
  } else if (error instanceof HttpException) {
    res.status(error.statusCode).send(error);
  } else {
    console.error(error.stack);
    res.status(500).send({
      error,
      message: 'An error occurred, please try again later.'
    });
  }
}
