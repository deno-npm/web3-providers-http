# web3-providers-http

[![NPM Package][npm-image]][npm-url] [![Dependency Status][deps-image]][deps-url] [![Dev Dependency Status][deps-dev-image]][deps-dev-url]

This is a HTTP provider sub-package for [web3.js][repo].

Please read the [documentation][docs] for more.

## Usage

```js
import http from 'https://deno.land/std/node/http.ts';
import Web3HttpProvider from 'https://deno.land/x/npm_web3_providers_http@0.0.1/mod.js';

const options = {
    keepAlive: true,
    timeout: 20000,
    headers: [
      {name: 'Access-Control-Allow-Origin', value: '*'}
      ,{...}
    ],
    withCredentials: false,
    agent: {http: http.Agent(...), baseUrl: ''}
};

const provider = new Web3HttpProvider('http://localhost:8545', options);
```

[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js
[npm-image]: https://img.shields.io/npm/dm/web3-providers-http.svg
[npm-url]: https://npmjs.org/package/web3-providers-http
[deps-image]: https://david-dm.org/ethereum/web3.js/1.x/status.svg?path=packages/web3-providers-http
[deps-url]: https://david-dm.org/ethereum/web3.js/1.x?path=packages/web3-providers-http
[deps-dev-image]: https://david-dm.org/ethereum/web3.js/1.x/dev-status.svg?path=packages/web3-providers-http
[deps-dev-url]: https://david-dm.org/ethereum/web3.js/1.x?type=dev&path=packages/web3-providers-http
