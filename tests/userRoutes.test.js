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

chai.use(chaiHttp);
const should = chai.should();
const agent = chai.request.agent(server);

const user = {
  username: 'test1',
  password: 'Unl1m1t3dBr41nUlt1m4t3P455w0rd!',
  email: 'john.fakey.email@gmail.com',
  publicEthAddress: '0xa257767e48462AF52C67F1CE0BdD72001da35190',
};

describe('User routes', function () {
  it('Should get the form to create users', function (done) {
    agent
      .get('/user/create')
      .end(function (err, res) {
        should.not.exist(err);
        res.status.should.be.equal(200);
        done();
      });
  });
  it('Should allow users to be created', function (done) {
    User.deleteMany({ username: 'test1' }, function () {
      agent
        .post('/user/create')
        .send(user)
        .end(function (err, res) {
          res.status.should.be.equal(200);
          agent.should.have.cookie('nToken');
          done();
        });
    });
  });
  it('Should get an update form', function (done) {
    agent
      .get('/user/update')
      .end(function (err, res) {
        should.not.exist(err);
        res.status.should.be.equal(200);
        done();
      });
  });
  it('Should allow users to be updated', function (done) {
    user.email = 'a.different.email@gmail.com';
    agent
      .put('/user/update')
      .send(user)
      .end(function (err, res) {
        res.status.should.be.equal(200);
        done();
      });
  });
  it('Should allow users to be deleted', function (done) {
    User.findOne({ username: 'test1' })
      .then(function (foundUser) {
        if (foundUser === null) {
          throw new Error('user not found');
        }
        agent
          .delete('/user/delete')
          .end(function (err, res) {
            res.status.should.be.equal(200);
            User
              .findById(foundUser._id)
              .then(function (doc) {
                should.not.exist(doc);
                done();
              });
          });
      });
  });
});

after(function (done) {
  console.log('Closing connection');
  connection.close();
  done();
});
