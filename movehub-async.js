const { Boost, Hub } = require('movehub/movehub');

const CALLBACK_TIMEOUT_MS = 1000 / 3;
const METRIC_MODIFIER = 28.5;
const IMPERIAL_MODIFIER = METRIC_MODIFIER / 4;
const TURN_MODIFIER = 2.56;
const DRIVE_SPEED = 25;
const TURN_SPEED = 20;
const DEFAULT_STOP_DISTANCE = 105;
const DEFAULT_CLEAR_DISTANCE = 120;

const waitForValueToSet = function(valueName, compareFunc = (valueName) => this[valueName], timeoutMs = 0) {
  if (compareFunc.bind(this)(valueName)) return Promise.resolve(this[valueName]);

  return new Promise((resolve, reject) => {
    setTimeout(async () => resolve(await waitForValueToSet.bind(this)(valueName, compareFunc, timeoutMs)), timeoutMs + 100);
  });
};

const defaultConfiguration = { left: 'B', right: 'A' };

const validateConfiguration = function(motorConfiguration){
  const validMotors = ['A', 'B'];

  if (!validMotors.includes(motorConfiguration.left))
    throw Error('Define left port port correctly');

  if (!validMotors.includes(motorConfiguration.right))
    throw Error('Define right port port correctly');

  if (motorConfiguration.left === motorConfiguration.right)
    throw Error('Left and right motor can not be same');
}

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
 * @param {object} [configuration = defaultConfiguration] Boost device's engine configuration
 */
Hub.prototype.afterInitialization = function(configuration = defaultConfiguration) {
  validateConfiguration(configuration);
  this.configuration = configuration;
  
  this.hubDisconnected = null;
  this.portData = {
    A: { angle: 0 },
    B: { angle: 0 },
    AB: { angle: 0 },
    C: { angle: 0 },
    D: { angle: 0 },
    LED: { angle: 0 }
  };
  this.useMetric = true;
  this.modifier = 1;

  this.on('rotation', rotation => this.portData[rotation.port].angle = rotation.angle);
  this.on('disconnect', () => this.hubDisconnected = true);
  this.on('distance', distance => this.distance = distance);
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
 * @method Hub#motorTimeAsync
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
 * @method Hub#motorTimeMultiAsync
 * @param {number} seconds
 * @param {number} [dutyCycleA=100] motor power percentage from `-100` to `100`. If a negative value is given rotation
 * is counterclockwise.
 * @param {number} [dutyCycleB=100] motor power percentage from `-100` to `100`. If a negative value is given rotation
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
 * @method Hub#motorAngleAsync
 * @param {string|number} port possible string values: `A`, `B`, `AB`, `C`, `D`.
 * @param {number} angle - degrees to turn from `0` to `2147483647`
 * @param {number} [dutyCycle=100] motor power percentage from `-100` to `100`. If a negative value is given
 * rotation is counterclockwise.
 * @param {boolean} [wait=false] will promise wait unitll motorAngle has turned
 * @returns {Promise}
 */
Hub.prototype.motorAngleAsync = function(port, angle, dutyCycle = 100, wait = false) {
  return new Promise((resolve, reject) => {
    this.motorAngle(port, angle, dutyCycle, async () => {
      if (wait) {
        let beforeTurn;
        do {
          beforeTurn = this.portData[port].angle;
          await new Promise(res => setTimeout(res, CALLBACK_TIMEOUT_MS))
        } while(this.portData[port].angle !== beforeTurn)
        resolve();
      } else {
        setTimeout(resolve, CALLBACK_TIMEOUT_MS);
      }
    });
  });
}

/**
 * Turn both motors (A and B) by specific angle
 * @method Hub#motorAngleMultiAsync
 * @param {number} angle degrees to turn from `0` to `2147483647`
 * @param {number} [dutyCycleA=100] motor power percentage from `-100` to `100`. If a negative value is given
 * rotation is counterclockwise.
 * @param {number} [dutyCycleB=100] motor power percentage from `-100` to `100`. If a negative value is given
 * rotation is counterclockwise.
 * @param {boolean} [wait=false] will promise wait unitll motorAngle has turned
 * @returns {Promise}
 */
Hub.prototype.motorAngleMultiAsync = function(angle, dutyCycleA = 100, dutyCycleB = 100, wait = false) {
  return new Promise((resolve, reject) => {
    this.motorAngleMulti(angle, dutyCycleA, dutyCycleB, async () => {
      if (wait) {
        let beforeTurn;
        do {
          beforeTurn = this.portData['AB'].angle;
          await new Promise(res => setTimeout(res, CALLBACK_TIMEOUT_MS))
        } while(this.portData['AB'].angle !== beforeTurn)
        resolve();
      } else {
        setTimeout(resolve, CALLBACK_TIMEOUT_MS);
      }
    });
  });
}

/**
 * Use metric units (default)
 * @method Hub#useMetricUnits
 */
Hub.prototype.useMetricUnits = function() {
  this.useMetric = true;
}

/**
 * Use imperial units
 * @method Hub#useImperialUnits
 */
Hub.prototype.useImperialUnits = function() {
  this.useMetric = false;
}

/**
 * Set friction modifier
 * @method Hub#setFrictionModifier
 * @param {number} modifier friction modifier
 */
Hub.prototype.setFrictionModifier = function(modifier) {
  this.modifier = modifier;
}

/**
 * Drive specified distance
 * @method Hub#drive 
 * @param {number} distance distance in centimeters (default) or inches. Positive is forward and negative is backward.
 * @param {boolean} [wait=true] will promise wait untill the drive has completed.
 * @returns {Promise}
 */
Hub.prototype.drive = function(distance, wait = true) {
  const angle = Math.abs(distance) * ((this.useMetric ? METRIC_MODIFIER : IMPERIAL_MODIFIER) * this.modifier);
  const dutyCycleA = DRIVE_SPEED * (distance > 0 ? 1 : -1) * (this.configuration.left === 'A' ? 1 : -1);
  const dutyCycleB = DRIVE_SPEED * (distance > 0 ? 1 : -1) * (this.configuration.left === 'A' ? 1 : -1);
  return this.motorAngleMultiAsync(angle, dutyCycleA, dutyCycleB, wait);
}

/**
 * Turn robot specified degrees
 * @method Hub#turn 
 * @param {number} degrees degrees to turn. Negative is to the left and positive to the right.
 * @param {boolean} [wait=true] will promise wait untill the turn has completed.
 * @returns {Promise}
 */
Hub.prototype.turn = function(degrees, wait = true) {
  const angle = Math.abs(degrees) * TURN_MODIFIER;
  const leftTurn = TURN_SPEED * (degrees > 0 ? 1 : -1);
  const rightTurn = TURN_SPEED * (degrees > 0 ? -1 : 1);
  const dutyCycleA = this.configuration.left === 'A' ? leftTurn : rightTurn;
  const dutyCycleB = this.configuration.left === 'A' ? rightTurn : leftTurn;
  return this.motorAngleMultiAsync(angle, dutyCycleA, dutyCycleB, wait);
}

/**
 * Drive untill sensor shows object in defined distance
 * @method Hub#driveUntil 
 * @param {number} [distance=0] distance in centimeters (default) or inches when to stop. Distance sensor is not very sensitive or accurate.
 * By default will stop when sensor notices wall for the first time. Sensor distance values are usualy between 110-50.
 * @param {boolean} [wait=true] will promise wait untill the bot will stop.
 * @returns {Promise}
 */
Hub.prototype.driveUntil = async function(distance = 0, wait = true) {
  const distanceCheck = distance !== 0 ? (this.useMetric ? distance : distance * 2.54) : DEFAULT_STOP_DISTANCE;
  this.motorTimeMulti(60, DRIVE_SPEED, DRIVE_SPEED);
  if (wait) {
    await waitForValueToSet.bind(this)('distance', () => distanceCheck >= this.distance);
    await this.motorAngleMultiAsync(0);
  }
  else {
    return waitForValueToSet.bind(this)('distance', () => distanceCheck >= this.distance).then(_ => this.motorAngleMulti(0, 0, 0));
  }
}

/**
 * Turn until there is no object in sensors sight
 * @method Hub#turnUntil 
 * @param {number} [direction=1] direction to turn to. 1 (or any positive) is to the right and 0 (or any negative) is to the left.
 * @param {boolean} [wait=true] will promise wait untill the bot will stop.
 * @returns {Promise}
 */
Hub.prototype.turnUntil = async function(direction = 1, wait = true) {
  const directionModifier = direction > 0 ? 1 : -1;
  this.turn(360 * directionModifier, false);
  if (wait) {
    await waitForValueToSet.bind(this)('distance', () => this.distance >= DEFAULT_CLEAR_DISTANCE);
    await this.turn(0, false)  
  }
  else {
    return waitForValueToSet.bind(this)('distance', () => this.distance >= DEFAULT_CLEAR_DISTANCE).then(_ => this.turn(0, false));
  }
}

/**
 * Get BLE status when BLE is ready to be used
 * @method Boost#bleReadyAsync
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
 * @param {object} hubDetails MAC Address of the Hub
 * @param {string} hubDetails.uuid
 * @param {string} hubDetails.address
 * @param {string} hubDetails.localName
 * @param {object} [configuration = defaultConfiguration] Boost device's engine configuration
 * @returns {Promise<Hub>} Hub object
 */
Boost.prototype.connectAsync = function(hubDetails, configuration) {
  return new Promise((resolve, reject) => {
    this.connect(hubDetails.address, async (err, hub) => {
      if (err) {
        reject(err);
      } else {
        hub.afterInitialization(configuration);
        await waitForValueToSet.bind(hub)('connected');
        resolve(hub);
      }
    });
  });
};

/**
 * Connect to a MoveHub and get Hub instance
 * @method Boost#getHubAsync
 * @param {object} [configuration = defaultConfiguration] Boost device's engine configuration
 * @returns {Promise<Hub>} Hub object 
 */
Boost.prototype.getHubAsync = async function(configuration = defaultConfiguration) {
  validateConfiguration(configuration);
  
  await this.bleReadyAsync();
  const connectDetails = await this.hubFoundAsync();
  return await this.connectAsync(connectDetails, configuration);
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

/**
 * Hub motor configuration for car and Vernie mode
 */
Boost.prototype.motorConfig = {
  car: { left: 'B', right : 'A' },
  vernie : { left: 'A', right : 'B' }
};

module.exports.Boost = Boost;
module.exports.Hub = Hub;