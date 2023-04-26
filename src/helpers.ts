import Validator, { ValidationError, ValidationSchema } from 'fastest-validator';
import { env } from './env';
import { HttpError } from './shared/HttpError';

export function checkAuthorization(authorization?: string) {
    if (! authorization) {
        throw new HttpError(401, 'Authorization header not found.');
    }

    if (authorization.substring(0, 10) !== 'Bearer pk_') {
        throw new HttpError(401, 'Authorization header is invalid.');
    }

    if (env.isDev && authorization.substring(0, 15) !== 'Bearer pk_test_') {
        throw new HttpError(401, 'Authorization header is invalid.');
    }
}

export function response<T>(json: T, status?: number) {
    return {
        statusCode: status ?? 200,
        body: JSON.stringify(json)
    }
}

export function validateRequest<T>(body: T, schema: ValidationSchema<T>) {
    const v = new Validator();
    const validate = v.compile(schema);

    const result = validate(body);

    if (result !== true) {
        throw new HttpError(422, 'Unprocessable entity.', result as ValidationError[]);
    }
}
