const boost = require('./index');

(async () => {
    const bleRady = await boost.bleReadyAsync();
    const connectDetails = await boost.hubFoundAsync();
    const hub = await boost.connectAsync(connectDetails);

    hub.on('error', err => {
        console.log('error', error);
    });

    hub.on('disconnect', () => {
        console.log('disconnect');
    });

    hub.on('distance', distance => {
        console.log('distance', distance);
    });

    hub.on('rssi', rssi => {
        console.log('rssi', rssi);
    });

    hub.on('port', portObject => {
        console.log('port', JSON.stringify(portObject, null, 1));
    });

    hub.on('color', color => {
        console.log('color', color);
    });

    hub.on('tilt', tilt => {
        console.log('tilt', JSON.stringify(tilt, null, 1));
    });

    hub.on('rotation', rotation => {
        console.log('rotation', JSON.stringify(rotation, null, 1));
    });

    await hub.connectAsync();

    // Insert commands here
    await hub.ledAsync('red');
    await hub.ledAsync('yellow');
    await hub.ledAsync('green');
})();