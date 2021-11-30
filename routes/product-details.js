var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('apps.shop/product-details');
});

module.exports = router;
