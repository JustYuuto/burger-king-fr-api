# Burger King French API wrapper

[![](https://img.shields.io/npm/dm/burger-king-fr-api)](https://www.npmjs.com/package/burger-king-fr-api)
[![](https://img.shields.io/npm/l/burger-king-fr-api)](LICENSE.txt)

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

Then log into your account. You can either log in with an email and a password, or a bearer token (recommended).

```js
await client.login('hello@world.fr', 'mySecureP@ssword123');
// or
await client.login('eyJhb.............. a bearer token');
```

## License

This package is license under the MIT License. You can view it [here](LICENSE.txt).