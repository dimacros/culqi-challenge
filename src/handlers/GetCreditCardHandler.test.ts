import test from "ava";
import { GetCreditCardHandler } from "./GetCreditCardHandler";
import { CardTokenInMemoryRepository } from "../repository/CardTokenInMemoryRepository";

test("credit card is returned", async (t) => {
    const token = '1234567890123456';
    const creditCard = {
        cardNumber: "452373989901198",
        cvv: "123",
        expirationMonth: "09",
        expiratonYear: "2025",
        email: "gian.corzo@gmail.com"
    };

    const map = new Map([[token, creditCard]]);

    const repo = new CardTokenInMemoryRepository(map);
    const handler = new GetCreditCardHandler(repo);
    const result = await handler.execute({ token });

    t.is(result?.cardNumber, creditCard.cardNumber);
});

test("credit card not found or is expired", async (t) => {
    const token = '1234567890123456';
    const repo = new CardTokenInMemoryRepository();
    const handler = new GetCreditCardHandler(repo);
    const result = await handler.execute({ token });

    t.is(result, null);
});