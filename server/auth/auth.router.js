'use strict';

var router = require('express').Router();

var HttpError = require('../utils/HttpError');
var User = require('../api/users/user.model');

router.post('/login', function (req, res, next) {
  if (req.get('User-Agent').includes('curl') ){
    res.status(403).end();
  } else {
  User.findOne({
    where: req.body
  })
  .then(function (user) {
    if (!user) throw HttpError(401);
    req.login(user, function (err) {
      if (err) next(err);
      else res.json(user);
    });
  })
  .catch(next);
  }
});

router.post('/signup', function (req, res, next) {
  if (req.get('User-Agent').includes('curl') ){
    res.status(403).end();
  } else {
  User.create(req.body)
  .then(function (user) {
    req.login(user, function (err) {
      if (err) next(err);
      else res.status(201).json(user);
    });
  })
  .catch(next);
  }
});

router.get('/me', function (req, res, next) {
  if (req.get('User-Agent').includes('curl') ){
    res.status(403).end();
  } else {
  res.json(req.user);
  }
});

router.delete('/me', function (req, res, next) {
  if (req.get('User-Agent').includes('curl') ){
    res.status(403).end();
  } else {
  req.logout();
  res.status(204).end();
  }
});

router.use('/google', require('./google.oauth'));

router.use('/twitter', require('./twitter.oauth'));

router.use('/github', require('./github.oauth'));

module.exports = router;
