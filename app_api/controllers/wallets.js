const mongoose = require('mongoose');
const Wallet = mongoose.model('Wallet');
const blockchain = require('../lib/blockchain');

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
        let { address, name, type } = req.body;
        if(!address && !name) throw new Error ('invalid name and address')
        if(!address && name) {
            console.log('creating new wallet...');
            address = await blockchain.createWallet(name);
        }
        existAddresses = await Wallet.find({ address });
        console.log("existAddresses", existAddresses);
        if (existAddresses.length != 0) {
            throw new Error('address already exist');
        }
        const newWallet = await Wallet.create({ address, name, type });
        console.log("res", newWallet);
        return res.status(201).json(newWallet);

    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
}

module.exports = {
    getWallets,
    createWallet
}