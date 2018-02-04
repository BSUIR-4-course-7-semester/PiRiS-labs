// ====================================================
// Load used modules
// ====================================================

const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');

const morgan = require('morgan');

const path = require('path');
const http = require('http');


// ====================================================
// Initialize global variables and functions
// ====================================================

global.l = console.log;
global.home = __dirname;

const app = express();


// ====================================================
// Application settings
// ====================================================

// Load the settings
var settings = require('./server/config/settings');

app.set('json spaces', 2);
app.enable('trust proxy');


// ====================================================
// Expressjs middleware and parsers
// ====================================================

// Log every request to the console
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get our API routes
const api = require('./server/router')(app);

// Set our api routes
app.use('/api', api);

/**
 * Get port from environment and store it in Express.
 */
const port = process.env.PORT || 3000;
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => {
  console.log(`API running on http://${server.address().address}:${port}`);
});
