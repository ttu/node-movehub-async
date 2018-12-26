const assert = require('assert');
const mockery = require('mockery');
const sinon = require('sinon');

const boostStub = sinon.stub();
boostStub.prototype.on = () => {};

const hubStub = sinon.stub();
hubStub.prototype.on = () => {};

mockery.enable();
mockery.registerAllowable('../movehub-async');
mockery.registerMock('movehub/movehub', { Boost: boostStub, Hub: hubStub });

const { Boost, Hub } = require('../movehub-async');

describe('Hub', function() {
  describe('#useMetric', function() {
    it('useMetrics default', function() {
      const hub = new Hub();
      hub.afterInitialization();

      assert.equal(hub.useMetric, true);
    });
    it('useMetricUnits', function() {
      const hub = new Hub();
      hub.afterInitialization();

      hub.useMetricUnits();
      assert.equal(hub.useMetric, true);
    });
    it('useImperialUnits', function() {
      const hub = new Hub();
      hub.afterInitialization();

      hub.useImperialUnits();
      assert.equal(hub.useMetric, false);
    });
  });

  describe('#afterInitialization', function() {
    it('correct configuration AB', function() {
      const hub = new Hub();
      hub.afterInitialization({ left: 'A', right: 'B'});
    });
    it('correct configuration BA', function() {
      const hub = new Hub();
      hub.afterInitialization({ left: 'B', right: 'A'});
    });
    it('invalid configuration AA', function() {
      const hub = new Hub();
      assert.throws(() => hub.afterInitialization({ left: 'A', right: 'A'}), Error);
    });
    it('invalid configuration BB', function() {
      const hub = new Hub();
      assert.throws(() => hub.afterInitialization({ left: 'B', right: 'B'}), Error);
    });
    it('invalid configuration CB', function() {
      const hub = new Hub();
      assert.throws(() => hub.afterInitialization({ left: 'C', right: 'B'}), Error);
    });
    it('invalid configuration AC', function() {
      const hub = new Hub();
      assert.throws(() => hub.afterInitialization({ left: 'A', right: 'C'}), Error);
    });
  });

  describe('#drive', function() {
    it('correct values to motorAngleMultiAsync (motor AB)', function() {
      let values = [];
      Hub.prototype.motorAngleMultiAsync = (...rest) => values = [ ...rest ];

      const config = new Boost().motorConfig.vernie;

      const hub = new Hub();
      hub.afterInitialization(config);

      hub.drive(100);
      assert.equal(values[0], 2850);
      assert.equal(values[1], 25);
      assert.equal(values[2], 25);
      assert.equal(values[3], true);
    });
    it('correct values to motorAngleMultiAsync (motor BA)', function() {
      let values = [];
      Hub.prototype.motorAngleMultiAsync = (...rest) => values = [ ...rest ];

      const config = new Boost().motorConfig.car;

      const hub = new Hub();
      hub.afterInitialization(config);

      hub.drive(100);
      assert.equal(values[0], 2850);
      assert.equal(values[1], -25);
      assert.equal(values[2], -25);
      assert.equal(values[3], true);
    });
  });

  describe('#turn', function() {
    it('correct values to motorAngleMultiAsync (motor AB)', async function() {
      let values = [];
      Hub.prototype.motorAngleMultiAsync = (...rest) => values = [ ...rest ];

      const config = new Boost().motorConfig.vernie;

      const hub = new Hub();
      hub.afterInitialization(config);

      hub.turn(90);
      assert.equal(values[0], 230.4);
      assert.equal(values[1], 20);
      assert.equal(values[2], -20);
      assert.equal(values[3], true);
    });
    it('correct values to motorAngleMultiAsync (motor BA)', async function() {
      let values = [];
      Hub.prototype.motorAngleMultiAsync = (...rest) => values = [ ...rest ];

      const config = new Boost().motorConfig.car;

      const hub = new Hub();
      hub.afterInitialization(config);

      hub.turn(90);
      assert.equal(values[0], 230.4);
      assert.equal(values[1], -20);
      assert.equal(values[2], 20);
      assert.equal(values[3], true);
    });
  });
});

describe('Boost', function() {
  describe('#hubFoundAsync', function() {
    it('find hub as hubDetails is set', async function() {
      const boost = new Boost();
      boost.afterInitialization();

      boost.hubDetails = 'foundSet';
      await boost.hubFoundAsync();
    });
  });
});
