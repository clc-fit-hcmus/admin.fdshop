const express = require('express');
const upload = require('../../utils/multer');
const {postFD, getFDs, getFD} = require("./fdsController");

const router = express.Router();

// router.get('/', getFDs);
// router.get('/:fdname', getFD);

// add-fd page
router.get('/add-fd', function(req, res, next) {
  res.render('crud/add-fd');
});

router.post('/add-fd', upload.single('image'), postFD);

router.get('/product-list', getFDs);

module.exports = router;