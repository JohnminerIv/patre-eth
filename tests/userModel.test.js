/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
require('mocha');
const chai = require('chai');
const User = require('../models/user');
const connection = require('../data/patre-eth-db');

const should = chai.should();

const user = {
  username: 'test1',
  password: 'test1',
  email: 'john.fakey.email@gmail.com',
  publicEthAddress: '0xa257767e48462AF52C67F1CE0BdD72001da35190',
};

describe('User model', function () {
  it('Should be created in the database when given correct information',
    function (done) {
      const createdUser = new User(user);
      createdUser
        .save()
        .then(function () {
          User
            .findById(createdUser._id, function (err, doc) {
              should.not.exist(err);
              should.exist(doc);
              doc.should.be.an('object');
            })
            .then(function () {
              User
                .deleteMany({ username: 'test1' }, function (err) {
                  console.log(err);
                  console.log('del user');
                  done();
                });
            })
            .catch(function (err) {
              console.log(err);
              done();
            });
        })
        .catch(function (err) {
          console.log(err);
          done();
        });
    });
});

after(function (done) {
  console.log('Closing connection');
  connection.close();
  done();
});
