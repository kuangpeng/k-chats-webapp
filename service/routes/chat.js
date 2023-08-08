const express = require('express');
const router = express.Router();

const chatController = require('./../controllers/chatController');
const authController = require('./../controllers/authController');

router
  .route('/groupby')
  .get(authController.checkAuth, chatController.getChatsGroup);

router
  .route('/getMore')
  .get(authController.checkAuth, chatController.getChatsGroupByDate);

router
  .route('/')
  .get(authController.checkAuth, chatController.getChats)
  .post(authController.checkAuth, chatController.addChat);

module.exports = router;
