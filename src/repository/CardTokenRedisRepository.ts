import { env } from "../env";
import type { CardTokenRepository, CreditCard } from "../domain/CreditCard";
import type { createClient } from "redis";

export class CardTokenRedisRepository implements CardTokenRepository {
    constructor(
        readonly redis: ReturnType<typeof createClient>
    ) {
        redis.on('error', err => console.error('Redis Client Error', err));
    }

    async save(key: string, creditCard: CreditCard) {
        await this.redis.connect();
        await this.redis.set(key, JSON.stringify(creditCard), { EX: env.CARD_TOKEN_EXPIRES });
        await this.redis.disconnect();
    }

    async find(key: string) {
        await this.redis.connect();
        const creditCard = await this.redis.get(key);
        await this.redis.disconnect();

        if (! creditCard) {
          return null;
        }

        return JSON.parse(creditCard) as CreditCard;
    }
}