const express = require('express');
const upload = require('../../utils/multer');
const {postFD, updateFD, deleteFD, getFDs, getToUpdate, getFD} = require("./fdsController");
const { isLoggedIn } = require('../../utils/login')

const router = express.Router();

// add-fd page
router.get('/add-fd', isLoggedIn, function(req, res, next) {
  res.render('crud/add-fd');
});

router.post('/add-fd', upload.single('image'), postFD);

// update-fd page
router.get('/update-fd/:id', isLoggedIn, getToUpdate);

router.post('/update-fd/:id', upload.single('image'), updateFD);

// delete-fd page
router.delete('/delete-fd/:id', deleteFD);

// product-list page
router.get('/product-list', isLoggedIn, getFDs);

// product-details page
router.get('/product-details/:id', getFD);

module.exports = router;