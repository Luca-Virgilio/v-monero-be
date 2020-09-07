const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.js');

// /* GET users listing. */
router
.route('/checkUser')
.get(userController.checkUser);

router.post('/vote', userController.sendVote);


router.get('/checkTxId', userController.checkTxId);



module.exports = router;
