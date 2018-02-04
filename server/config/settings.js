// ====================================================
// Settings
// ====================================================

var fs = require('fs');

var development, production;

if(fs.existsSync('./server/config/env/development.json'))
  development = require('./env/development.json');

if(fs.existsSync('./server/config/env/production.json'))
  production  = require('./env/production.json');

// Get all environments
var environment = {
  development : development,
  production  : production,
};

var NODE_ENV = process.env.NODE_ENV || 'development';

// Export the configuration for the current environment
module.exports = environment[NODE_ENV];
