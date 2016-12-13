var express = require('express');
var router = express.Router();
    User = require('../models/User');

router.get('/', function(req, res, next) {
  res.render('index', {});
});
router.get('/signin', function(req, res, next) {
  res.render('signin');
});

module.exports = router;
