require('cookie-parser');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Content = require('../models/content');
const TxReceipt = require('../models/txReceipt');

module.exports = (app) => {
  app.get(
    '/content/create',
    (req, res) => {
      if (req.user === null) {
        return res.status(401).send({ message: 'Not Authorised' });
      }
      return res.render('contentCreate');
    },
  );
  app.post(
    '/content/create',
    body('title').isString(),
    body('content').isString(),
    body('priceInWei').isInt(),
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
      req.body.author = req.user._id;
      const createdContent = new Content(req.body);
      createdContent
        .save()
        // eslint-disable-next-line no-underscore-dangle
        .then(() => User.findOne({ _id: req.user._id }))
        .then((foundUser) => {
          // eslint-disable-next-line no-console
          console.log(foundUser);
          foundUser.content.unshift(createdContent);
          foundUser.save();
          // eslint-disable-next-line no-underscore-dangle
          res.redirect(`/content/${createdContent._id}`);
        })
        // eslint-disable-next-line no-console
        .catch((err) => console.log(err));
    },
  );
  app.get(
    '/content/:id',
    (req, res) => {
      if (req.user === null) {
        return res.redirect('/');
      }
      Content
        .findById(req.params.id)
        // eslint-disable-next-line consistent-return
        .then((content) => {
          if (content === null) {
            return res.render('bruh');
          }
          // eslint-disable-next-line no-underscore-dangle
          if (req.user._id === content.author._id) {
            return res.render('content', { content });
          }
          TxReceipt
            .findOne({
              owner: req.user.id,
              forContent: req.params.id,
            })
            .then((txToken) => {
              if (txToken === null) {
                return res.status(401).send({ message: 'Not Authorised' });
              }
              return res.render('content', { content });
            });
        });
      return res.render('user', { user: req.user });
    },
  );
  app.get(
    '/content/:id/update',
    // eslint-disable-next-line consistent-return
    (req, res) => {
      if (req.user === null) {
        return res.redirect('/');
      }
      Content
        .findById(req.params.id)
        .then((foundContent) => {
          if (foundContent === null) {
            return res.render('bruh');
          }
          // eslint-disable-next-line no-underscore-dangle
          if (!foundContent.author._id === req.user._id) {
            return res.render('bruh');
          }
          return res.render('contentUpdate', { foundContent });
        });
    },
  );
  app.put(
    '/content/:id/update',
    body('title').isString(),
    body('content').isString(),
    body('priceInWei').isInt(),
    // eslint-disable-next-line consistent-return
    (req, res) => {
      if (req.user === null) {
        return res.redirect('/');
      }
      Content
        .findOneAndUpdate(
          {
            // eslint-disable-next-line no-underscore-dangle
            author: req.user._id,
            _id: req.params.id,
          },
          req.body,
        )
        .then((foundContent) => res.render('content', { foundContent }))
        // eslint-disable-next-line no-console
        .catch((err) => console.log(err));
    },
  );
  app.delete(
    '/content/:id/delete',
    // eslint-disable-next-line consistent-return
    (req, res) => {
      if (req.user === null) {
        return res.redirect('/');
      }
      Content
        .findOneAndDelete(
          {
            // eslint-disable-next-line no-underscore-dangle
            author: req.user._id,
            _id: req.params.id,
          },
          (err) => {
            if (err !== null) {
              // eslint-disable-next-line no-console
              console.log(err);
              return res.status(404).render('bruh');
            }
            return res.redirect('/');
          },
        );
    },
  );
};
