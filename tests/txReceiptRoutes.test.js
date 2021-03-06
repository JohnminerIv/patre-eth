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
const TxReceipt = require('../models/txReceipt');
const connection = require('../data/patre-eth-db');

chai.use(chaiHttp);
const should = chai.should();
const agent = chai.request.agent(server);

const _user = {
  username: 'test1',
  password: 'Unl1m1t3dBr41nUlt1m4t3P455w0rd!',
  email: 'john.fakey.email@gmail.com',
  publicEthAddress: '0x69913c7c03cce4421c1d8dc14303c02af21e7351',
};

const _user2 = {
  username: 'test2',
  password: 'test2',
  email: 'another.fakey.email@gmail.com',
  publicEthAddress: '0x3d3667d4f8402cdb0546eb786fe4e685a78abb53',
};

const content = {
  title: 'Generic Content',
  content: 'Cool content.',
  priceInWei: '1100000000000000000',
};

const txReceipt = {
  txHash: '0x1db88c73a6e7b6faad11bf7176eea4b22071e20fb8aed4a3b035159ec3e6f46a',
  verified: false,
};

describe('txReceipt routes', function () {
  it('putting user and content', function (done) {
    Content.deleteMany({ title: 'Generic Content' })
      .then(function () { User.deleteMany({ username: 'test1' }); })
      .then(function () { User.deleteMany({ username: 'test2' }); })
      .then(function () { TxReceipt.deleteMany({ txHash: '0x1db88c73a6e7b6faad11bf7176eea4b22071e20fb8aed4a3b035159ec3e6f46a' }); })
      .then(function () { return Promise.all([new User(_user2).save()]); })
      .then(function (data) {
        content.author = data[0]._id;
        return Promise.all([data[0], new Content(content).save()]);
      })
      .then(function (data) {
        data[0].content.unshift(data[1]);
        return Promise.all([data[0].save(), data[1]]);
      })
      .then(function (data) {
        should.exist(data[0]);
        should.exist(data[1]);
        data[1].author.should.equal(data[0]._id);
        done();
      })
      .catch((err) => console.log(err));
  });
  it('Should get the form to create a receipt', function (done) {
    User
      .deleteMany({ username: 'test1' }, function () {
        agent
          .post('/user/create')
          .send(_user)
          .end(function (_err, res) {
            res.status.should.be.equal(200);
            agent.should.have.cookie('nToken');
            User
              .findOne({ username: 'test1' })
              .then((foundUser) => {
                console.log(foundUser._id);
                should.exist(foundUser);
                agent
                  .get(`/content/${content._id}/txreceipt/create`)
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
  it('Should allow txReceipt to be created', function (done) {
    this.timeout(10000);
    TxReceipt.deleteMany({ txHash: '0x1db88c73a6e7b6faad11bf7176eea4b22071e20fb8aed4a3b035159ec3e6f46a' }, function () {
      agent
        .post('user/login')
        .send({
          username: _user.username,
          password: _user.password,
        })
        // eslint-disable-next-line no-unused-vars
        .end(function (_err, _res) {
          Content.findOne(content)
            .then(function (foundContent) {
              agent
                .post(`/content/${foundContent._id}/txreceipt/create`)
                .send(txReceipt)
                // eslint-disable-next-line no-shadow
                .end(function (_err, res) {
                  res.status.should.be.equal(200);
                  agent.should.have.cookie('nToken');
                  done();
                });
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
