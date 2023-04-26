import luhn from 'fast-luhn';
import type { CreditCard } from '../domain/CreditCard';

export class CreateCreditCardCommand {
    readonly cardNumber: string;
    readonly cvv: string;
    readonly expirationMonth: string;
    readonly expiratonYear: string;
    readonly email: string;

    constructor(params: CreditCard) {
        this.cardNumber = params.cardNumber;
        this.cvv = params.cvv;
        this.expirationMonth = params.expirationMonth;
        this.expiratonYear = params.expiratonYear;
        this.email = params.email;
    }

    validate() {
        const result: { ok: boolean, err?: Error } = { ok: true };
        
        const cvv = parseInt(this.cvv);
        const expirationMonth = parseInt(this.expirationMonth);
        const expirationYear = parseInt(this.expiratonYear);
        const emailDomain = this.email.split("@")[1];

        if (! luhn(this.cardNumber)) {
           return { ok: false, err: new TypeError("Invalid card number.") };
        }

        if (isNaN(cvv) || cvv < 0) {
           return { ok: false, err: new TypeError("Invalid cvv.") };
        }

        if (isNaN(expirationMonth) || expirationMonth < 1 || expirationMonth > 12) {
           return { ok: false, err: new TypeError("Invalid expiration month.") };
        }

        if (isNaN(expirationYear) || this.isInvalidExpirationYear(expirationYear)) {
           return { ok: false, err: new TypeError("Invalid expiration year.") };
        }

        if (! ['gmail.com', 'hotmail.com', 'yahoo.es'].includes(emailDomain)) {
           return { ok: false, err: new TypeError("Invalid email.") };
        }

        return result;
    }

    private isInvalidExpirationYear(expirationYear: number) {
        return expirationYear < new Date().getFullYear() || expirationYear > new Date().getFullYear() + 5
    }
}