import { createClient } from 'redis';
import { CardTokenRedisRepository } from "./repository/CardTokenRedisRepository";
import { CreateCreditCardHandler } from "./handlers/CreateCreditCardHandler";
import { CreateCreditCardCommand } from "./handlers/CreateCreditCardCommand";
import { GetCreditCardHandler, GetCreditCardQuery } from "./handlers/GetCreditCardHandler";
import { HttpError } from "./shared/HttpError";
import { env } from './env';
import { checkAuthorization, validateRequest, response } from "./helpers";
import type { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import type { CreditCardRequest, CreditCardToken } from "./domain/CreditCard";

export function handler(event: APIGatewayEvent) {
    switch (event.requestContext.routeKey) {
        case 'POST /tokens':
            return createCreditCardToken(event);
        case 'GET /tokens/{token}':
            return getCreditCard(event);
        default:
            return response({ message: 'Not found.' }, 404);
    }
}

export async function createCreditCardToken(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    try {
        checkAuthorization(event.headers.authorization);

        const request = JSON.parse(event.body ?? "{}") as CreditCardRequest;
        
        validateRequest(request, {
            card_number: { type: "string", min: 13, max: 16 },
            cvv: { type: "string", min: 3, max: 4 },
            expiration_month: { type: "string", min: 1, max: 2 },
            expiration_year: { type: "string", length: 4 },
            email: { type: "email", min: 5, max: 100 },
        });

        const redis = createClient({ url: env.REDIS_URL });
        const repo = new CardTokenRedisRepository(redis);
        const handler = new CreateCreditCardHandler(repo);
        const cmd = new CreateCreditCardCommand({
            cardNumber: request.card_number,
            cvv: request.cvv,
            expirationMonth: request.expiration_month,
            expiratonYear: request.expiration_year,
            email: request.email,
        });

        const result = await handler.execute(cmd);

        return response(result);
    } catch (e) {
        if (e instanceof HttpError) {
            const { message, details } = e;

            return response(details ? { message, details } : { message }, e.status);
        }

        console.error(e);
        return response({ message: 'Internal server error.' }, 500);
    }
}

export async function getCreditCard(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    try {
        checkAuthorization(event.headers.authorization);

        const token = event.pathParameters?.token ?? '';

        validateRequest<CreditCardToken>({ token }, {
            token: { type: "string", alphanum: true, length: 16 },
        });

        const redis = createClient({ url: env.REDIS_URL });
        const repo = new CardTokenRedisRepository(redis);
        const handler = new GetCreditCardHandler(repo);
        const query = new GetCreditCardQuery({ token });

        const creditCard = await handler.execute(query);

        if (! creditCard) {
            return response({ message: 'Credit card not found or token expired.' }, 404);
        }

        return response({
            card_number: creditCard.cardNumber,
            expiration_month: creditCard.expirationMonth,
            expiration_year: creditCard.expiratonYear,
            email: creditCard.email,            
        });
    } catch (e) {
        if (e instanceof HttpError) {
            const { message, details } = e;

            return response({ message, details }, e.status);
        }

        console.error(e);
        return response({ message: 'Internal server error.' }, 500);
    }
}