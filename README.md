# movehub async

Asynchronous wrapper for [Lego Boost Move Hub](https://github.com/hobbyquaker/node-movehub)

## Usage

```js
const boost = require('./index');

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