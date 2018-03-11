# movehub async

[![npm version](https://badge.fury.io/js/movehub-async.svg)](https://badge.fury.io/js/movehub-async)

Asynchronous functions for the [Lego Boost Move Hub](https://github.com/hobbyquaker/node-movehub)

## Install

```sh
$ npm install movehub-async
```

## Usage

```js
const boost = require('movehub-async');

await boost.bleReadyAsync();
const connectDetails = await boost.hubFoundAsync();

const hub = await boost.connectAsync(connectDetails);
await hub.connectAsync();

await hub.ledAsync('red');
await hub.ledAsync('yellow');
await hub.ledAsync('green');
```

### Tester

[tester.js](https://github.com/ttu/node-movehub-async/blob/master/tester.js)

### Example project

[lego-boost-ai](https://github.com/ttu/lego-boost-ai)

## Changelog

[Changelog](https://github.com/ttu/node-movehub-async/blob/master/CHANGELOG.md)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

Licensed under the [MIT](https://github.com/ttu/node-movehub-async/blob/master/LICENSE) License.