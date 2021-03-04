/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const User = require('../models/user');
const connection = require('../data/patre-eth-db');

// const should = chai.should();
chai.use(chaiHttp);
const agent = chai.request.agent(server);

const user = {
  username: 'test1',
  password: 'test1',
  email: 'john.fakey.email@gmail.com',
  publicEthAddress: '0xa257767e48462AF52C67F1CE0BdD72001da35190',
};

describe('Route /user/create', function () {
  it('Should get the form to create users', function (done) {
    agent
      .get('/user/create')
      .end(function (err, res) {
        should.not.exist(err);
        res.status.should.be.equal(200);
        done();
      })
      .catch(function (err) {
        console.log(err);
        done();
      });
  });
  it('Should allow users to be created', function (done) {
    agent
      .post('/user/create')
      .send(user)
      .then(function (res) {
        res.status.should.be.equal(200);
        done();
      })
      .catch(function (err) {
        console.log(err);
        done();
      });
  });
  it('Should allow users to be updated', function (done) {
    user.email = 'a.different.email@gmail.com';
    agent
      .put('/user/create')
      .send(user)
      .then(function (res) {
        res.status.should.be.equal(200);
        done();
      })
      .catch(function (err) {
        console.log(err);
        done();
      });
  });
  it('Should allow users to be deleted', function (done) {
    User.findOne({ username: 'test1' })
      .then(function (foundUser) {
        agent
          .delete(`user/${foundUser._id}/delete`)
          .then(function (res) {
            res.status.should.be.equal(200);
            User
              .findById(foundUser)
              .then(function (doc) {
                doc.should.not.exist();
                done();
              })
              .catch(function (err) {
                console.log(err);
                done();
              });
          });
      });
  });
});

after(function (done) {
  connection.close();
  done();
});
