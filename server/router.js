// ====================================================
// API Routes
// ====================================================

const express  = require('express');
const router   = express.Router();

module.exports = (app) => {

  require('./routes/main')(router);

  return router;
  
};
