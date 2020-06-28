const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.js');

/* GET users listing. */
router
.route('/')
.post(userController.createUser)
.get(userController.getUsers);


module.exports = router;
