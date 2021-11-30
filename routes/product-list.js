var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('apps.shop/product-list');
});

module.exports = router;
