# movehub async

[![npm version](https://badge.fury.io/js/movehub-async.svg)](https://badge.fury.io/js/movehub-async)

Simple to use asynchronous methods for the [Move Hub](https://github.com/hobbyquaker/node-movehub)

_Move Hub is central controller block of [LEGO® Boost Robotics Set](https://www.lego.com/en-us/boost)._

## Setup

* Install [Noble prerequisites](https://github.com/noble/noble#prerequisites)

* Install movehub-async

```sh
$ npm install movehub-async
```

## Usage

```js
const boost = require('movehub-async');

const hub = await boost.getHubAsync();

// Turn light from red to green
await hub.ledAsync('red');
await hub.ledAsync('yellow');
await hub.ledAsync('green');

// Turn A & B motors for 10 seconds with power 20
await hub.motorTimeMultiAsync(10, 20, 20);
// Turn motor C 600 degrees with power 5
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

Package contains also simple methods to drive for a specified distance and turn a specified angle. By default drive and turn methods will wait the execution has stopped.

```js
// Drive 2 meters forward
await hub.drive(200);
// After 2 meter drive, turn 90 degrees to the right
await hub.turn(90);
// Drive 1 meter backwards
await hub.drive(-100);
// Turn 180 degrees to the left
await hub.turn(-180); 
```

## API

Check complete non-async API definition from [Lego Boost Move Hub](https://github.com/hobbyquaker/node-movehub). Asynchronous version of the method has an _Async_-suffix in the name, e.g. `motorTimeMulti` -> `motorTimeMultiAsync`.

## Boost

### boost.getHubAsync()

Create a connection to the Hub. Internally calls `bleReadyAsync`, `hubFoundAsync` and `connectAsync`.

```js
const hub = await boost.getHubAsync();
```

### boost.bleReadyAsync()

Wait for BLE device to be ready.

```js
await boost.bleReadyAsync();
```

### boost.hubFoundAsync()

Wait for MoveHub found event.

```js
const connectDetails = await boost.hubFoundAsync();
```

### boost.connectAsync(connectDetails)

Initialize and wait for the connection to the Hub.

```js
const hub = await boost.connectAsync(connectDetails);
```

## Hub

### hub.ledAsync(color)

Control the LED on the Move Hub.

```js
await hub.ledAsync('red');
```

### hub.motorTimeAsync(port, seconds, dutyCycle = 100, wait = false)

Run a motor for specific time. Await returns when command is sent to Hub.

```js
await hub.motorTimeAsync('C', 5, 50);
// Continue almost immediately when command is sent to Hub

await hub.motorTimeAsync('C', 5, 50, true);
// Continue 5 seconds later
```

### hub.motorTimeMultiAsync(seconds, dutyCycleA = 100, dutyCycleB = 100, wait = false)

Run both motors (A and B) for specific time. Await returns when command is sent to Hub.

```js
// Drive forward for 10 seconds
await hub.motorTimeMultiAsync(10, 20, 20, true);
// Continue 10 seconds later
```

### hub.motorAngleAsync(port, angle, dutyCycle = 100, wait = false)

Turn a motor by specific angle. Await returns when command is sent to Hub.

```js
// Turn ~180 degrees  
await hub.motorAngleAsync('B', 980, 100, true);
// Continue after the turn
```

### hub.motorAngleMultiAsync(angle, dutyCycleA = 100, dutyCycleB = 100, wait = false)

Turn both motors (A and B) by specific angle. Await returns when command is sent to Hub.

```js
// Drive forward
await hub.motorAngleMultiAsync(500, 100, 100);
// Continue immediately after command is sent to Hub
```

### hub.drive(centimeters, wait = true)

Drive specified distance. By default drive-method's return promise will resolve when the distance has been driven.

__Note:__ Drive method is implemented with Lego Boost Vernie

```js
// Drive forward 2 meters
await hub.drive(200);
// Continue after drive is finished
```

### hub.useMetricUnits()

Use metric untis in drive-method. Metric is default.

```js
// Drive forward 200 cm
await hub.drive(200);

hub.useImperialUnits();

// Drive forward 200 inches
await hub.drive(200);
```

### hub.useImperialUnits()

Use imperial units with drive-method.

### hub.setFrictionModifier(modifier)

If drive method's distance is not correct, friction modifier can be changed.

```js
// Drive forward 100cm
await hub.drive(100);

// Distance was only 90cm, update modifier
hub.setFrictionModifier(1.1);

// Drive 100cm
await hub.drive(100);
```

### hub.turn(degrees, wait = true)

Turn specified angle to either right (positive number) or left (negative number). By default turn-method's promise will resolve when the angle has been turned.

__Note:__ Turn method is implemented with Lego Boost Vernie

```js
const hub = await boost.getHubAsync();
// Drive 1 meter square
await hub.drive(100);
await hub.turn(90);
await hub.drive(100);
await hub.turn(90);
await hub.drive(100);
await hub.turn(90);
await hub.drive(100);
await hub.turn(90);
```

### hub.driveUntil(distance = 0, wait = true)

Drive until the sensor shows an object in defined distance. The distance sensor is not very sensitive or accurate. By default the bot will stop when the sensor notices a wall for the first time. Sensor distance values are usualy between 110-50.

```js
await hub.driveUntil();
```

### hub.turnUntil(direction = 1, wait = true)

Turn until sensor doesn't detect any blocking object. 1 or any positive number turns to the right (default) and 0 or any negative number turns to the left.

```js
// Turn to the right
await hub.turnUntil();
// Turn to the right
await hub.turnUntil(1);
// Turn to the left
await hub.turnUntil(0);
```

## Example project

[lego-boost-ai](https://github.com/ttu/lego-boost-ai) has a simple AI and manual controls for Lego Boost.

## Unit tests

Run ESLint and Mocha tests.

```sh
$ npm run test
```

Run only Mocha tests.

```sh
$ npm run mocha
```

## Tester

[tester.js](https://github.com/ttu/node-movehub-async/blob/master/tester.js)

## Use development version

It is possible to use development version from GitHub, which may contain unreleased features.

```sh
$ npm install git+https://git@github.com/ttu/node-movehub-async.git
```

## Changelog

[Changelog](https://github.com/ttu/node-movehub-async/blob/master/CHANGELOG.md)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Disclaimer

LEGO and BOOST are Trademarks from The LEGO Company, which do not support this project. 

I'm not responsible for any damage on your LEGO BOOST devices - use it at your own risk.

## License

Licensed under the [MIT](https://github.com/ttu/node-movehub-async/blob/master/LICENSE) License.