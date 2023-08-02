var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.json({
    message: 'home'
  });
});

router.post('/login', authController.login);
router.post('/register', authController.register);
// router.post('/logout', authController.logout);

module.exports = router;
