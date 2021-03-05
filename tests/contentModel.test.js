/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
require('mocha');
const chai = require('chai');
const User = require('../models/user');
const Content = require('../models/content');
const connection = require('../data/patre-eth-db');

const should = chai.should();

const user = {
  username: 'test1',
  password: 'test1',
  email: 'john.fakey.email@gmail.com',
  publicEthAddress: '0xa257767e48462AF52C67F1CE0BdD72001da35190',
};

const content = {
  title: 'Generic Content',
  content: 'Cool content.',
  priceInWei: 5000000000000000,
};

describe('Content Model', function () {
  it('Should be create Content Model in the database when given correct information',
    function (done) {
      Content
        .deleteMany(
          { title: 'Generic Content' },
          User
            .deleteMany(
              { username: 'test1' },
              () => {
                const createdUser = new User(user);
                createdUser
                  .save()
                  .then(function (savedUser) {
                    content.author = savedUser._id;
                    const createdContent = new Content(content);
                    createdContent
                      .save()
                      .then((savedContent) => {
                        savedUser.content.unshift(savedContent);
                        savedUser
                          .save()
                          .then((savedUserWithContent) => {
                            should.exist(savedUserWithContent.content[0]);
                            done();
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              },
            )
            .catch((err) => {
              console.log(err);
            }),
        )
        .catch((err) => {
          console.log(err);
        });
    });
});

after(function (done) {
  console.log('Closing connection');
  connection.close();
  done();
});
