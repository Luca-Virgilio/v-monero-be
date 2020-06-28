const mongoose = require('mongoose');
const Wallet = mongoose.model('Wallet');

const getWallets = async (req, res) => {
    try {
        wallets = await Wallet.find();
        return res.status(200).json(wallets);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
}
const createWallet = async (req, res) => {
    try {
        const { address, name } = req.body;
        existEmails = await Wallet.find({ email });
        console.log("existEmails", existEmails);
        if (existEmails.length != 0) {
            throw new Error('email already exist');
        }
        const newUser = await Wallet.create({ email, name });
        console.log("res", newUser);
        return res.status(201).json(newUser);

    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
}

module.exports = {
    getWallets,
    createWallet
}