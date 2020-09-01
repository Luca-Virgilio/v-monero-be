const mongoose = require('mongoose');
const Wallet = mongoose.model('Wallet');
const blockchain = require('../lib/blockchain');

const createCandidates = async (candidates) =>{
    try {
        const rowDb = await blockchain.verifyWallet(candidates);
        if(rowDb && rowDb.length != 0){
            const result = await Wallet.insertMany(rowDb);
            console.log("res createCandidates", result);
        }
    } catch (error) {
        console.log(error);
    }
}

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
        const newWallet = await storeNewWallet(address, name, type);
        console.log("res", newWallet);
        return res.status(201).json(newWallet);

    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
}

const getWalletInfo = async (req,res) =>{
    try {
        const {id} = req.params;
        console.log("id",id);
        const {name, address, type, isUsed} = await Wallet.findById(id);
        const balance = await blockchain.getBalance(name);
        return res.status(200).json({name,address, type, isUsed, balance});
        
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
} 
const multipleCreation = async (req,res) =>{
    try {
    const {from, to} = req.body;
    if (!from || !to) throw new Error('from and to field are required');
    if (typeof from != "number" || typeof to != "number" || from >= to) throw new Error('to must be greater of from');
    const rows = [];
    for(let i=from; i<=to; i++){
        const name = `ele${i}`;
        const address = await blockchain.createWallet(name);
        rows.push({name,address});
    }
    const result = await Wallet.insertMany(rows);
    return res.status(200).json(result);
    
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
}

const storeNewWallet = async (address, name, type)=>{
    try {
        existAddresses = await Wallet.find({ address });
        console.log("existAddresses", existAddresses);
        if (existAddresses.length != 0) {
            throw new Error('address already exist');
        }
        const newWallet = await Wallet.create({ address, name, type });
        return newWallet;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const sendTokens = async (req, res)=>{
    try {
        const num = req.body;
        wallets = await Wallet.find({type:"elector", isUsed:false}).limit(3);
        const electorsAddress = wallets.map(wallet => wallet.address);
        await blockchain.transferMultiple(electorsAddress);
        const result = await Wallet.updateMany({address:{$in:electorsAddress}},{isUsed:true});
        return res.status(200).json(result);

    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
}

const vote = async (req,res) =>{
    try {
        const {id} = req.params;
        const {address} = req.body;
        const {name, type, isUsed} = await Wallet.findById(id);
        if(!isUsed || type!="elector") {
            throw new Error ('this wallet can not vote')
        }else{
        candidates = [];
        candidates.push(address);
        const otherCandidates = await Wallet.find({type:"candidate", address : {$nin:candidates}});
        otherCandidates.forEach( cand =>{
            candidates.push(cand.address);
        });
        const result = await blockchain.transferVoting(name, candidates);
        return res.status(200).json(result);

        }
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
}

module.exports = {
    createCandidates,
    getWallets,
    createWallet,
    getWalletInfo,
    multipleCreation,
    sendTokens,
    vote
}