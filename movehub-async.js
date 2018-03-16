const { Boost, Hub } = require('movehub/movehub');

const CALLBACK_TIMEOUT_MS = 250;

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
  this.ports = {
    A: { action: '', angle: 0 },
    B: { action: '', angle: 0 },
    AB: { action: '', angle: 0 },
    C: { action: '', angle: 0 },
    D: { action: '', angle: 0 },
    LED: { action: '', angle: 0 },
  };

  this.on('rotation', rotation => this.ports[rotation.port].angle = rotation.angle);
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
      // Callback is executed when command is sent and it will take some time before MoveHub executes the command
      setTimeout(resolve, CALLBACK_TIMEOUT_MS);
    });
  });
}

/**
 * Run a motor for specific time
 * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
 * @param {number} seconds
 * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given rotation
 * is counterclockwise.
 * @param {boolean} [wait=false] will promise wait unitll motorTime run time has elapsed
 * @returns {Promise}
 */
Hub.prototype.motorTimeAsync = function(port, seconds, dutyCycle = 100, wait = false) {
  return new Promise((resolve, reject) => {
    this.motorTime(port, seconds, dutyCycle, () => {
      setTimeout(resolve, wait ? CALLBACK_TIMEOUT_MS + seconds * 1000 : CALLBACK_TIMEOUT_MS);
    });
  });
}

/**
 * Run both motors (A and B) for specific time
 * @param {number} seconds
 * @param {number} dutyCycleA motor power percentage from `-100` to `100`. If a negative value is given rotation
 * is counterclockwise.
 * @param {number} dutyCycleB motor power percentage from `-100` to `100`. If a negative value is given rotation
 * is counterclockwise.
 * @param {boolean} [wait=false] will promise wait unitll motorTime run time has elapsed
 * @returns {Promise}
 */
Hub.prototype.motorTimeMultiAsync = function(seconds, dutyCycleA = 100, dutyCycleB = 100, wait = false) {
  return new Promise((resolve, reject) => {
    this.motorTimeMulti(seconds, dutyCycleA, dutyCycleB, () => {
      setTimeout(resolve, wait ? CALLBACK_TIMEOUT_MS + seconds * 1000 : CALLBACK_TIMEOUT_MS);
    });
  });
}

/**
 * Turn a motor by specific angle
 * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
 * @param {number} angle - degrees to turn from `0` to `2147483647`
 * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given
 * rotation is counterclockwise.
 * @param {boolean} [wait=false] will promise wait unitll motorAngle has turned
 * @returns {Promise}
 */
Hub.prototype.motorAngleAsync = function(port, angle, dutyCycle = 100, wait = false) {
  return new Promise((resolve, reject) => {
    let beforeTurn = this.ports[port].angle;
    this.motorAngle(port, angle, dutyCycle, async () => {
      if (wait) {
        do {
          beforeTurn = this.ports[port].angle;                    
          await new Promise(res => setTimeout(res, CALLBACK_TIMEOUT_MS))
        } while(this.ports[port].angle != beforeTurn)
        resolve();
      } else {
        setTimeout(resolve, CALLBACK_TIMEOUT_MS);
      }
    });
  });
}

/**
 * Turn both motors (A and B) by specific angle
 * @param {number} angle degrees to turn from `0` to `2147483647`
 * @param {number} dutyCycleA motor power percentage from `-100` to `100`. If a negative value is given
 * rotation is counterclockwise.
 * @param {number} dutyCycleB motor power percentage from `-100` to `100`. If a negative value is given
 * rotation is counterclockwise.
 * @param {boolean} [wait=false] will promise wait unitll motorAngle has turned
 * @returns {Promise}
 */
Hub.prototype.motorAngleMultiAsync = function(angle, dutyCycleA, dutyCycleB, wait = false) {
  return new Promise((resolve, reject) => {
    let beforeTurn = this.ports['AB'].angle;
    this.motorAngleMulti(angle, dutyCycleA, dutyCycleB, async () => {
      if (wait) { 
        do {
          beforeTurn = this.ports['AB'].angle;                    
          await new Promise(res => setTimeout(res, CALLBACK_TIMEOUT_MS))
        } while(this.ports['AB'].angle != beforeTurn)
        resolve();
      } else {
        setTimeout(resolve, CALLBACK_TIMEOUT_MS);
      }
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
  await this.bleReadyAsync();
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