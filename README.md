# Introduction

Requirements:

- Nodejs v.18
- Redis v.6.2
- AWS Credentials

Clone the respository:

`git clone https://github.com/dimacros/culqi-challenge`

## Setup Redis with Docker
Just run the command:

`docker-compose up redis --build`

## Setup Node
- `npm install`
- `npm start`

## For Testing
```node
npm test
```

## For Deploy
Before deploy your function, set your aws credentials in `.aws/credentials`

More details: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html

And now run the command:

```node
npm run deploy
```

# API Usage

### Create Credit Card Token

Example Request:
```bash
curl -X POST http://localhost:3000/tokens -H 'Authorization: Bearer pk_test_AfFnt9A5ZkvSzQYn' --data '{"card_number":"452373989901198","cvv":"123","expiration_month":"09","expiration_year":"2025","email":"gian.corzo@gmail.com"}'
```

Example Response:
```json
{
    "token":"joHYqfGjO3XyaWUa"
}
```

### Get Credit Card
Example Request:
```bash
curl http://localhost:3000/tokens/:token -H 'Authorization: Bearer pk_test_AfFnt9A5ZkvSzQYn'
```

Example Response:
```json
{
	"card_number": "452373989901198",
	"expiration_month": "09",
	"expiration_year": "2025",
	"email": "gian.corzo@gmail.com"
}
```