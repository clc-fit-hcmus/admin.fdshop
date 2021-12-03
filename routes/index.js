const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// *** GET app.shop pages ***

// product-details
router.get('/product-details', function(req, res, next) {
  res.render('apps.shop/product-details');
});

module.exports = router;
