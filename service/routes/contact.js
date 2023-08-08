var express = require('express');
var router = express.Router();

const contactsController = require('../controllers/contactController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router
  .route('/my-strangers')
  .get(
    authController.checkAuth,
    contactsController.getStrangers,
    userController.getAll
  );

router
  .route('/')
  .get(authController.checkAuth, contactsController.getMyContacts)
  .post(authController.checkAuth, contactsController.createContacts);

router
  .route('/:id')
  .get(contactsController.getContactsById)
  .put(authController.checkAuth, contactsController.updateContact);

module.exports = router;
