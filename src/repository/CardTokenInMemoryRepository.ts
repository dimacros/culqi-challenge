import type { CardTokenRepository, CreditCard } from "../domain/CreditCard";

export class CardTokenInMemoryRepository implements CardTokenRepository {
    readonly data: Map<string, CreditCard>;

    constructor(map?: Map<string, CreditCard>) {
        this.data = map ?? new Map();
    }

    save(key: string, creditCard: CreditCard) {
        this.data.set(key, creditCard);

        return Promise.resolve();
    }

    find(key: string) {
        return Promise.resolve(this.data.get(key) ?? null);
    }
}