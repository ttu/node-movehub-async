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

await hub.motorTimeMultiAsync(10, 20, 20);
await hub.motorAngleAsync('C', 45, 5);
```

It is also possible to wait that motor execution has stopped

```js
await hub.ledAsync('red');
// When light is red
await hub.motorTimeMultiAsync(10, 20, 20, true);
// 10 sec later
await hub.motorTimeMultiAsync(5, 20, 20, true);
// 5 sec later
await hub.motorAngleAsync('C', 45, 50, true);
// some time later
await hub.ledAsync('green');
```
## API

Check complete non-async API definition from [Lego Boost Move Hub](https://github.com/hobbyquaker/node-movehub)

Asynchronous version of the methods have _Async_ suffix in the name, e.g. `motorTimeMulti` -> `motorTimeMultiAsync`

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

### - hub.ledAsync(color)

Control the LED on the Move Hub.

### - hub.motorTimeAsync(port, seconds, dutyCycle)

Run a motor for specific time. Await returns when Hub starts to execute the command.

### - hub.motorTimeMultiAsync(seconds, dutyCycleA, dutyCycleB)

Run both motors (A and B) for specific time. Await returns when Hub starts to execute the command.

### - hub.motorAngleAsync(port, angle, dutyCycle)

Turn a motor by specific angle. Await returns when Hub starts to execute the command.

### - hub.motorAngleMultiAsync(angle, dutyCycleA, dutyCycleB)

Turn both motors (A and B) by specific angle. Await returns when Hub starts to execute the command.

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