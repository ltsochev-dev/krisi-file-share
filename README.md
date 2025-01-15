# Krisi File Sharing Service

## Tech stack

@todo

## Generate AES private and public key pair

```bash
openssl genpkey -algorithm RSA -out private_key.pem -aes256
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

## Running the application in dev mode

```bash
cp .env.dist .env

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
