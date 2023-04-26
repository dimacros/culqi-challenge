export type CreditCardToken = {
    token: string;
}

export interface CardTokenRepository {
    save(key: string, creditCard: CreditCard): Promise<void>;
    find(key: string): Promise<CreditCard|null>;
}

export type CreditCard = {
    readonly cardNumber: string;
    readonly cvv: string;
    readonly expirationMonth: string;
    readonly expiratonYear: string;
    readonly email: string;
}

export type CreditCardRequest = {
    card_number: string;
    cvv: string;
    expiration_month: string;
    expiration_year: string;
    email: string;
}

export type CreditCardResponse = Omit<CreditCardRequest, 'cvv'>;