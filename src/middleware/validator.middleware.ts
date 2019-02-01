import { RequestHandler } from 'express';
import { validate } from 'class-validator';

/**
 * This middleware function generates a middleware that will handle the validation of input models.
 * Why do we need this:
 *   req.body is only a literal object (instead of an actual object, while it may contain the same
 *   data). However the validator will only apply to actual objects since they will have the decorator
 *   information so the validator will know how to validate them.
 * @param type A newable type parameter that will be used to construct a new instance of the model.
 */
export function validatorFor<T>(type: new () => T): RequestHandler {
  return async (req, res, next) => {
    const body = new type();
    Object.assign(body, req.body);
    const error = await validate(body);

    if (error.length > 0) {
      res.status(400).send(
        error.map(e => ({
          name: e.property,
          message: Object.keys(e.constraints).map(k => e.constraints[k])
        }))
      );
    } else {
      next();
    }
  };
}
