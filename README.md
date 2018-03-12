# movehub async

[![npm version](https://badge.fury.io/js/movehub-async.svg)](https://badge.fury.io/js/movehub-async)

Simple to use asynchronous functions for the [Lego Boost Move Hub](https://github.com/hobbyquaker/node-movehub)

## Install

```sh
$ npm install movehub-async
```

## Usage

```js
const boost = require('movehub-async');

const hub = await boost.getHubAsync();

await hub.ledAsync('red');
await hub.ledAsync('yellow');
await hub.ledAsync('green');

hub.motorTimeMulti(10, 20, 20);
```

## API

Check non-async API definition from [Lego Boost Move Hub](https://github.com/hobbyquaker/node-movehub)

### - boost.getHubAsync()

Create a connection to the Hub. Internally calls `bleReadyAsync`, `hubFoundAsync` and `connectAsync`.

### - boost.bleReadyAsync()

Wait for BLE device to be ready.

### - boost.hubFoundAsync()

Wait for MoveHub found event.

### - boost.connectAsync(connectDetails)

Initialize and wait for the connection to the Hub.

### - hub.ledAsync(color)

Control the LED on the Move Hub.

## Tester

[tester.js](https://github.com/ttu/node-movehub-async/blob/master/tester.js)

## Example project

[lego-boost-ai](https://github.com/ttu/lego-boost-ai)

## Changelog

[Changelog](https://github.com/ttu/node-movehub-async/blob/master/CHANGELOG.md)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

Licensed under the [MIT](https://github.com/ttu/node-movehub-async/blob/master/LICENSE) License.