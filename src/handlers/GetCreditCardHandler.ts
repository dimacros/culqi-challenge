import type { CardTokenRepository } from "../domain/CreditCard";

export class GetCreditCardQuery {
    readonly token: string;

    constructor(params: {
        readonly token: string
    }) {
        this.token = params.token;
    }
}

export class GetCreditCardHandler {
    constructor(
        readonly repo: CardTokenRepository
    ) {}

    execute(query: GetCreditCardQuery) {
        return this.repo.find(query.token)
    }
}