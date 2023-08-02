const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

/* GET users listing. */
router.route('/').get(userController.getAll);

module.exports = router;
