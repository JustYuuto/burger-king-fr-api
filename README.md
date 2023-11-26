# Burger King French API wrapper

A Node wrapper for the French Burger King API (webapi.burgerking.fr).

## Why this project?

I don't even know myself. It's just funny to order Burger King with a node program 💀

## Installation

```bash
npm install burger-king-fr-api
# or with yarn
yarn add burger-king-fr-api
```

## Usage

Ok so first import the library and init the client:

```js
const BKClient = require('burger-king-fr-api');

const client = new BKClient();
```

Then log into your account. You can either login with an email and a password, or a bearer token (recommended).

```js
await client.login('hello@world.fr', 'mySecureP@ssword123');
// or
await client.login('eyJhb.............. a bearer token');
```