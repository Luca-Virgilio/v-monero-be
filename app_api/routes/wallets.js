const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallets.js');
const ctrlVoting = require('../controllers/vote');
const ctrlBlockchain = require('../lib/blockchain');


/* GET users listing. */
router
.route('/wallets')
.post(walletController.createWallet)
.get(walletController.getWallets);


router.post('/mining', async (req, res) => {
    try {
        console.log(req.body);
        if (req.body.method == "start_mining") {
            const result = await ctrlBlockchain.startMining();
            return res.status(200).json(result);
        } else if (req.body.method == "stop_mining") {
            const result = await ctrlBlockchain.stopMining();
            return res.status(200).json(result);
        } else {
            return res.status(400).json('method not found');
        }
    } catch (error) {
        console.log(error);
    }
});

router
.route('/wallets/:id')
.get(walletController.getWalletInfo);

router
.route('/wallets/:id/vote')
.post(walletController.vote);

router
.route('/wallets/multiple_creation')
.post(walletController.multipleCreation);

router
.route('/send_tokens')
.post(walletController.sendTokens);

module.exports = router;
