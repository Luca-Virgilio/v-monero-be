const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.js');

// /* GET users listing. */
router
.route('/checkUser')
.post(userController.checkUser);

router.post('/vote', userController.sendVote);


router.post('/checkTxId', userController.checkTxId);

router.get('/getResults', userController.getResults);



module.exports = router;
