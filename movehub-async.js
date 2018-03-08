const { Boost, Hub } = require('movehub/movehub');

const waitAsync = function(valueName, compareFunc = (valueName) => this[valueName], timeoutMs = 0) {
  if (compareFunc.bind(this)(valueName)) return Promise.resolve(this[valueName]);

  return new Promise((resolve, reject) => {
    setTimeout(async () => resolve(await waitAsync.bind(this)(valueName, compareFunc, timeoutMs)), timeoutMs + 100);
  });
};

Hub.prototype.connectAsync = function() {
  return waitAsync.bind(this)('connected');
};

Hub.prototype.disconnectAsync = function() {
  this.disconnect();
  return waitAsync.bind(this)('hubDisconnected');
};

Hub.prototype.afterInitialization = function() {
  this.hubDisconnected = null;
  this.on('disconnect', () => (this.hubDisconnected = true));  
};

Hub.prototype.ledAsync = function(color) {
  return new Promise((resolve, reject) => {
    this.led(color, () => {
      // Callback is executed faster than Boost has time to change the color
      setTimeout(resolve, 250);
    });
  });
}

Boost.prototype.bleReadyAsync = function() {
  return new Promise(async (resolve, reject) => {
    var ready = await waitAsync.bind(this)('bleReadyStatus');
    if (ready) 
      resolve(ready);
    else 
      reject(ready);
  });
};

Boost.prototype.hubFoundAsync = function() {
  return waitAsync.bind(this)('hubDetails');
};

Boost.prototype.connectAsync = function(hubDetails) {
  return new Promise((resolve, reject) => {
    this.connect(hubDetails.address, (err, hub) => {
      if (err) {
        reject(err);
      } else {
        hub.afterInitialization();
        resolve(hub);
      }
    });
  });
};

Boost.prototype.afterInitialization = function() {
  this.bleReadyStatus = null;
  this.hubDetails = null;

  this.on('ble-ready', status => (this.bleReadyStatus = status));
  this.on('hub-found', hubDetails => (this.hubDetails = hubDetails));
};

module.exports.Boost = Boost;
module.exports.Hub = Hub;