# Krisi File Sharing Service

The project is used to allow for secure file transfers between [Kristina Kostova](https://kristinakostova.com) and her clients.
The goal of the project is full encryption even before user begins upload using AES-256 and WebCrypto.Subtle API. The files will be encrypted once again on the AWS S3 bucket so they'll be virtually inaccessible by 3rd parties. Everything is hosted on SSL enabled servers so even MITM attacks should be blocked off. Also, using cronjobs the files will be automatically deleted per client's request

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
