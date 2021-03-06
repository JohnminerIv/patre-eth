/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
require('mocha');
const chai = require('chai');
const User = require('../models/user');
const Content = require('../models/content');
const TxReceipt = require('../models/txReceipt');
const connection = require('../data/patre-eth-db');

const should = chai.should();

const _user = {
  username: 'test1',
  password: 'test1',
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

describe('TxReceipt Model', function () {
  it('Should be create TxReceipt Model in the database when given correct information',
    function (done) {
      Content.deleteMany({ title: 'Generic Content' })
        .then(function () { User.deleteMany({ username: 'test1' }); })
        .then(function () { User.deleteMany({ username: 'test2' }); })
        .then(function () { TxReceipt.deleteMany({ txHash: '0x1db88c73a6e7b6faad11bf7176eea4b22071e20fb8aed4a3b035159ec3e6f46a' }); })
        .then(function () { return Promise.all([new User(_user).save()]); })
        .then(function (user1) { return Promise.all([user1[0], new User(_user2).save()]); })
        .then(function (data) {
          content.author = data[1]._id;
          return Promise.all([data[0], data[1], new Content(content).save()]);
        })
        .then(function (data) {
          console.log(data);
          data[1].content.unshift(data[2]);
          return Promise.all([data[0], data[1].save(), data[2]]);
        })
        .then(function (data) {
          txReceipt.owner = data[0]._id;
          txReceipt.contentId = data[2]._id;
          return Promise.all([data[0], data[1], data[2], new TxReceipt(txReceipt).save()]);
        })
        .then(function (data) {
          data[0].txReceipt.unshift(data[3]);
          return Promise.all([data[0].save(), data[1], data[2], data[3]]);
        })
        .then(function (data) {
          should.exist(data[0]);
          should.exist(data[1]);
          should.exist(data[2]);
          should.exist(data[3]);
          data[3].owner.should.equal(data[0]._id);
          data[2].author.should.equal(data[1]._id);
          data[3].contentId.should.equal(data[2]._id);
          done();
        })
        .catch((err) => console.log(err));
    });
});

after(function (done) {
  console.log('Closing connection');
  connection.close();
  done();
});
