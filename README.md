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
await hub.motorAngleAsync('C', 600, 5);
```

It is also possible to wait that motor execution has stopped

```js
await hub.ledAsync('red');
// Continue when led is red
await hub.motorTimeMultiAsync(10, 20, 20, true);
// Continue 10 sec later
await hub.motorTimeMultiAsync(5, 20, 20, true);
// Continue 5 sec later
await hub.motorAngleAsync('C', 800, 50, true);
// Continue some time later
await hub.ledAsync('green');
// Continue when led is green
```

## API

Check complete non-async API definition from [Lego Boost Move Hub](https://github.com/hobbyquaker/node-movehub). Asynchronous version of the method has an _Async_-suffix in the name, e.g. `motorTimeMulti` -> `motorTimeMultiAsync`.

### - boost.getHubAsync()

Create a connection to the Hub. Internally calls `bleReadyAsync`, `hubFoundAsync` and `connectAsync`.

```js
const hub = await boost.getHubAsync();
```

### - boost.bleReadyAsync()

Wait for BLE device to be ready.

```js
await boost.bleReadyAsync();
```

### - boost.hubFoundAsync()

Wait for MoveHub found event.

```js
const connectDetails = await boost.hubFoundAsync();
```

### - boost.connectAsync(connectDetails)

Initialize and wait for the connection to the Hub.

```js
const hub = await boost.connectAsync(connectDetails);
```

### - hub.ledAsync(color)

Control the LED on the Move Hub.

```js
await hub.ledAsync('red');
```

### - hub.motorTimeAsync(port, seconds, dutyCycle = 100, wait = false)

Run a motor for specific time. Await returns when command is sent to Hub.

```js
await hub.motorTimeAsync('C', 5, 50);
// Continue almost immediately when command is sent to Hub

await hub.motorTimeAsync('C', 5, 50, true);
// Continue 5 seconds later
```

### - hub.motorTimeMultiAsync(seconds, dutyCycleA = 100, dutyCycleB = 100, wait = false)

Run both motors (A and B) for specific time. Await returns when command is sent to Hub.

```js
// Drive forward for 10 seconds
await hub.motorTimeMultiAsync(10, 20, 20, true);
// Continue 10 seconds later
```

### - hub.motorAngleAsync(port, angle, dutyCycle = 100, wait = false)

Turn a motor by specific angle. Await returns when command is sent to Hub.

```js
// Turn ~180 degrees  
await hub.motorAngleAsync('B', 980, 100, true);
// Continue after the turn
```

### - hub.motorAngleMultiAsync(angle, dutyCycleA = 100, dutyCycleB = 100, wait = false)

Turn both motors (A and B) by specific angle. Await returns when command is sent to Hub.

```js
// Drive forward
await hub.motorAngleMultiAsync(500, 100, 100);
// Continue immediately after command is sent to Hub
```

## Example project

[lego-boost-ai](https://github.com/ttu/lego-boost-ai) has a simple AI and manual controls for Lego Boost.

## Tester

[tester.js](https://github.com/ttu/node-movehub-async/blob/master/tester.js)

## Changelog

[Changelog](https://github.com/ttu/node-movehub-async/blob/master/CHANGELOG.md)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

Licensed under the [MIT](https://github.com/ttu/node-movehub-async/blob/master/LICENSE) License.