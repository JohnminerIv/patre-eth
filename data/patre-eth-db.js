/* Mongoose Connection */
require('dotenv').config();
const mongoose = require('mongoose');
const assert = require('assert');

const url = `mongodb://${process.env.ROOTUSER}:${process.env.ROOTPASS}@db:27017/${process.env.DATABASENAME}?authSource=admin`;
mongoose.Promise = global.Promise;
mongoose.connect(
  url,
  {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false,
  },
  (err /* , _db */) => {
    assert.strictEqual(null, err);
    console.log('Connected successfully to database');
    // _db.close(); // turn on for testing
  },
);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection Error:'));
mongoose.set('debug', true);
module.exports = mongoose.connection;