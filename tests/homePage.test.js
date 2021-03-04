/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

// const should = chai.should();
chai.use(chaiHttp);
const agent = chai.request.agent(server);

describe('Home page', function () {
  it('Should load and give status 200', function (done) {
    agent
      .get('/')
      .end(function (err, res) {
        res.status.should.be.equal(200);
        done();
      });
  });
});
