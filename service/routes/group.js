const express = require('express');
const router = express.Router();

const groupController = require('./../controllers/groupController');
const authController = require('./../controllers/authController');

router
  .route('/')
  .get(authController.checkAuth, groupController.getMyGroups)
  .post(authController.checkAuth, groupController.createGroup);

router
  .route('/my/:id')
  .put(authController.checkAuth, groupController.updateMyGroup);

router
  .route('/:id')
  .put(authController.checkAuth, groupController.joinGroup)
  .delete(authController.checkAuth, groupController.leaveGroup);

module.exports = router;
