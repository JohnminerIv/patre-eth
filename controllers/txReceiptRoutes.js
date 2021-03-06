require('cookie-parser');
const { body, validationResult } = require('express-validator');
const etherScan = require('etherscan-api').init(process.env.ETHERSCAN);
const Web3 = require('web3');
const User = require('../models/user');
const Content = require('../models/content');
const TxReceipt = require('../models/txReceipt');

module.exports = (app) => {
  app.get(
    '/content/:id/txreceipt/create',
    (req, res) => {
      if (req.user === null) {
        return res.status(401).send({ message: 'Not Authorised' });
      }
      return res.render('txReceiptCreate');
    },
  );
  app.post(
    '/content/:id/txreceipt/create',
    body('txHash').isString(),
    // eslint-disable-next-line consistent-return
    (req, res) => {
      if (req.user === null) {
        return res.status(401).send({ message: 'Not Authorised' });
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // eslint-disable-next-line no-console
        console.log(errors);
        return res.status(400).render('bruh');
      }
      // eslint-disable-next-line no-underscore-dangle
      req.body.owner = req.user._id;
      req.body.contentId = req.params.id;
      console.log('progress 1')
      etherScan.proxy
        .eth_getTransactionByHash(req.body.txHash)
        // eslint-disable-next-line consistent-return
        .then((foundTxReceipt) => {
          console.log('progress 2')
          if (foundTxReceipt.result === null) {
            return res.status(400).render('bruh');
          }

          User
            // eslint-disable-next-line no-underscore-dangle
            .findOne({ _id: req.user._id })
            .then((foundUser) => {
              console.log('progress 3')
              if (foundTxReceipt.result.from === foundUser.publicEthAddress) {
                console.log('progress 4')
                console.log(req.params.id)
                Content
                  .findOne({ _id: req.params.id })
                  .then((foundContent) => {
                    console.log('progress 5')
                    if (foundTxReceipt.result.to === foundContent.author.publicEthAddress) {
                      if (
                        Number(
                          Web3
                            .utils
                            .hexToNumberString(
                              foundTxReceipt
                                .result
                                .value,
                            ),
                        ) === foundContent.priceInWei) {
                        console.log('progress 6')
                        req.body.verified = false;
                        const createdTxReceipt = new TxReceipt(req.body);
                        createdTxReceipt
                          .save()
                          .then((savedTxReceipt) => {
                            foundUser.txReceipt.unshift(savedTxReceipt);
                            foundUser
                              .save()
                              .then(() => res.redirect(`/content/${req.params.id}`));
                          });
                      }
                    }
                  });
              }
            });
        });
    },
  );
  app.get(
    '/txreceipt/:id',
    // eslint-disable-next-line consistent-return
    (req, res) => {
      if (req.user === null) {
        return res.redirect('/');
      }
      TxReceipt
        .findById(req.params.id)
        // eslint-disable-next-line consistent-return
        .then((txReceipt) => {
          if (txReceipt === null) {
            return res.render('bruh');
          }
          // eslint-disable-next-line no-underscore-dangle
          if (req.user._id === txReceipt.owner._id) {
            return res.render('txReceipt', { txReceipt });
          }
          return res.redirect('/');
        });
    },
  );
};
