import { cleanEnv, str, num, url } from 'envalid';

export const env = cleanEnv(process.env, {
    CARD_TOKEN_EXPIRES: num({ default: 60 * 15 }),
    REDIS_URL: url({ default: 'redis://:redis-stack@localhost:6379/0' }),
    NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'], default: 'development' }),
});
