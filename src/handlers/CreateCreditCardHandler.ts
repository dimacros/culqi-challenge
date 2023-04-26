import { customAlphabet } from "nanoid/async";
import { CreateCreditCardCommand } from "./CreateCreditCardCommand";
import type { CardTokenRepository, CreditCardToken } from "../domain/CreditCard";

export class CreateCreditCardHandler {
    constructor(
        readonly repo: CardTokenRepository
    ) {}

    async execute(cmd: CreateCreditCardCommand) {
        const { ok, err } = cmd.validate();

        if (! ok) {
            throw err;
        }

        const key = await this.generateUniqueToken();

        await this.repo.save(key, cmd);

        return { token: key } as CreditCardToken;
    }

    private generateUniqueToken() {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
    
        const alphabet = lowercase + uppercase + numbers;
    
        const nanoid = customAlphabet(alphabet, 16);
    
        return nanoid();
    }
}