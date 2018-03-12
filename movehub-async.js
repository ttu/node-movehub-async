const { Boost, Hub } = require('movehub/movehub');

const waitForValueToSet = function(valueName, compareFunc = (valueName) => this[valueName], timeoutMs = 0) {
  if (compareFunc.bind(this)(valueName)) return Promise.resolve(this[valueName]);

  return new Promise((resolve, reject) => {
    setTimeout(async () => resolve(await waitForValueToSet.bind(this)(valueName, compareFunc, timeoutMs)), timeoutMs + 100);
  });
};

/**
 * Disconnect Hub
 * @method Hub#disconnectAsync
 * @returns {Promise<boolean>} disconnection successful
 */
Hub.prototype.disconnectAsync = function() {
  this.disconnect();
  return waitForValueToSet.bind(this)('hubDisconnected');
};

/**
 * Execute this method after new instance of Hub is created
 * @method Hub#afterInitialization
 */
Hub.prototype.afterInitialization = function() {
  this.hubDisconnected = null;
  this.on('disconnect', () => (this.hubDisconnected = true));  
};

/**
 * Control the LED on the Move Hub
 * @method Hub#ledAsync
 * @param {boolean|number|string} color
 * If set to boolean `false` the LED is switched off, if set to `true` the LED will be white.
 * Possible string values: `off`, `pink`, `purple`, `blue`, `lightblue`, `cyan`, `green`, `yellow`, `orange`, `red`,
 * `white`
 * @returns {Promise}
 */
Hub.prototype.ledAsync = function(color) {
  return new Promise((resolve, reject) => {
    this.led(color, () => {
      // Callback is executed when command is sent and it will
      // take some time before MoveHub executes the command
      setTimeout(resolve, 250);
    });
  });
}

/**
 * Get BLE status when BLE is ready to be used
 * @method Boost#ble-ready
 * @returns {Promise<boolean>} ble status `true`/`false` when ble is ready 
 */
Boost.prototype.bleReadyAsync = function() {
  return new Promise(async (resolve, reject) => {
    var ready = await waitForValueToSet.bind(this)('bleReadyStatus');
    if (ready) 
      resolve(ready);
    else 
      reject(ready);
  });
};

/**
 * Get Hub details when hub is found
 * @method Boost#hubFoundAsync
 * @returns {Promise<{uudi: string, address:string, localName: string}>} Hub details
 */
Boost.prototype.hubFoundAsync = function() {
  return waitForValueToSet.bind(this)('hubDetails');
};

/**
 * @method Boost#connectAsync
 * @param hubDetails {object} MAC Address of the Hub
 * @param hubDetails.uuid {string}
 * @param hubDetails.address{string}
 * @param hubDetails.localName {string}
 * @returns {Promise<Hub>} Hub object 
 */
Boost.prototype.connectAsync = function(hubDetails) {
  return new Promise((resolve, reject) => {
    this.connect(hubDetails.address, async (err, hub) => {
      if (err) {
        reject(err);
      } else {
        hub.afterInitialization();
        await waitForValueToSet.bind(hub)('connected');
        resolve(hub);
      }
    });
  });
};

/**
 * @method Boost#getHubAsync
 * @returns {Promise<Hub>} Hub object 
 */
Boost.prototype.getHubAsync = async function() {
    const bleRady = await this.bleReadyAsync();
    const connectDetails = await this.hubFoundAsync();
    return await this.connectAsync(connectDetails);
};

/**
 * Execute this method after new instance is created
 * @method Boost#afterInitialization
 */
Boost.prototype.afterInitialization = function() {
  this.bleReadyStatus = null;
  this.hubDetails = null;

  this.on('ble-ready', status => (this.bleReadyStatus = status));
  this.on('hub-found', hubDetails => (this.hubDetails = hubDetails));
};

module.exports.Boost = Boost;
module.exports.Hub = Hub;