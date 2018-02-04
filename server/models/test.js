
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const Promise = require('bluebird');

const database = require('./../config/db').database;
const settings = require('./../config/settings');

const TestSchema = require('./schemes/test');


TestSchema.createTest = function(title) {
  return database.transaction(transaction => {
    return TestSchema.create({
      title: title
    }, {
      transaction
    });
  });
}

module.exports = TestSchema;
