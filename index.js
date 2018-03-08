const { Boost, Hub } = require('./movehub-async');

const boost = new Boost();
boost.afterInitialization();

module.exports = boost;