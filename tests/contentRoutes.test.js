/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const Content = require('../models/content');
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
const content = {
  title: 'Generic Content',
  content: 'Cool content.',
  priceInWei: '5000000000000000',
};

describe('Content routes', function () {
  it('Should get the form to create content', function (done) {
    User
      .deleteMany({ username: 'test1' }, function () {
        agent
          .post('/user/create')
          .send(user)
          .end(function (_err, res) {
            res.status.should.be.equal(200);
            agent.should.have.cookie('nToken');
            User
              .findOne({ username: 'test1' })
              .then((foundUser) => {
                console.log(foundUser._id);
                should.exist(foundUser);
                agent
                  .get('/content/create')
                  // eslint-disable-next-line no-shadow
                  .end(function (err, res) {
                    agent.should.have.cookie('nToken');
                    should.not.exist(err);
                    res.status.should.be.equal(200);
                    done();
                  });
              });
          });
      });
  });
  it('Should allow content to be created', function (done) {
    Content.deleteMany({ title: 'Generic Content' }, function () {
      agent
        .post('user/login')
        .send({
          username: user.username,
          password: user.password,
        })
        // eslint-disable-next-line no-unused-vars
        .end(function (_err, _res) {
          agent
            .post('/content/create')
            .send(content)
            // eslint-disable-next-line no-shadow
            .end(function (_err, res) {
              res.status.should.be.equal(200);
              agent.should.have.cookie('nToken');
              done();
            });
        });
    });
  });
  it('Should get an update form for content', function (done) {
    Content
      .findOne({ title: 'Generic Content' })
      .then((foundContent) => {
        agent
          .get(`/content/${foundContent._id}/update`)
          .end(function (err, res) {
            should.not.exist(err);
            res.status.should.be.equal(200);
            done();
          });
      });
  });
  it('Should allow content to be updated', function (done) {
    content.priceInWei = 1000000000000000;
    Content
      .findOne({ title: 'Generic Content' })
      .then((foundContent) => {
        console.log(foundContent);
        agent
          .put(`/content/${foundContent._id}/update`)
          .send(content)
          .end(function (_err, res) {
            res.status.should.be.equal(200);
            done();
          });
      });
  });
  it('Should allow content to be deleted', function (done) {
    Content
      .findOne({ title: 'Generic Content' })
      .then(function (foundContent) {
        if (foundContent === null) {
          throw new Error('content not found');
        }
        agent
          .delete(`/content/${foundContent._id}/delete`)
          .end(function (_err, res) {
            res.status.should.be.equal(200);
            Content
              .findById(foundContent._id)
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
