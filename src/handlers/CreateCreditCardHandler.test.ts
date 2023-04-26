import test from "ava";
import { CardTokenInMemoryRepository } from "../repository/CardTokenInMemoryRepository";
import { CreateCreditCardHandler } from "./CreateCreditCardHandler";
import { CreateCreditCardCommand } from "./CreateCreditCardCommand";

const creditCard = {
    cardNumber: "452373989901198",
    cvv: "123",
    expirationMonth: "09",
    expiratonYear: "2025",
    email: "gian.corzo@gmail.com"
};

test("credit card is valid", async (t) => {t.pass();
    const repo = new CardTokenInMemoryRepository();
    const handler = new CreateCreditCardHandler(repo);
    const cmd = new CreateCreditCardCommand(creditCard);
    const result = await handler.execute(cmd);
    
    t.is(result.token.length, 16);
});

test("credit card has invalid card number", async (t) => {
    const repo = new CardTokenInMemoryRepository();
    const handler = new CreateCreditCardHandler(repo);
    const cmd = new CreateCreditCardCommand({...creditCard, cardNumber: "452373989901199"});
    const error = await t.throwsAsync(handler.execute(cmd)) as Error;

    t.is(error.message, "Invalid card number.");
});

test("credit card has invalid cvv", async (t) => {
    const repo = new CardTokenInMemoryRepository();
    const handler = new CreateCreditCardHandler(repo);
    const cmd = new CreateCreditCardCommand({...creditCard, cvv: "abc"});
    const error = await t.throwsAsync(handler.execute(cmd)) as Error;

    t.is(error.message, "Invalid cvv.");
});

test("credit card has invalid expiration month", async (t) => {
    const repo = new CardTokenInMemoryRepository();
    const handler = new CreateCreditCardHandler(repo);
    const cmd = new CreateCreditCardCommand({...creditCard, expirationMonth: "13" });
    const error = await t.throwsAsync(handler.execute(cmd)) as Error;

    t.is(error.message, "Invalid expiration month.");
});

test("credit card has invalid expiration year", async (t) => {
    const repo = new CardTokenInMemoryRepository();
    const handler = new CreateCreditCardHandler(repo);
    const cmd = new CreateCreditCardCommand({...creditCard, expiratonYear: "2020" });
    const error = await t.throwsAsync(handler.execute(cmd)) as Error;

    t.is(error.message, "Invalid expiration year.");
});

test("credit card has invalid email", async (t) => {
    const repo = new CardTokenInMemoryRepository();
    const handler = new CreateCreditCardHandler(repo);
    const cmd = new CreateCreditCardCommand({...creditCard, email: "gian.corzo@culqi.com" });
    const error = await t.throwsAsync(handler.execute(cmd)) as Error;

    t.is(error.message, "Invalid email.");
});
