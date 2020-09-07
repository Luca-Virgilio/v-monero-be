const mongoose = require('mongoose');
const DbUser = mongoose.model('User');
const DbWallet = mongoose.model('User');
// // hash function
const crypto = require('crypto');
const pdkdf2 = require('../../app_server/lib/pdkdf2');
const blockchain = require('../lib/blockchain');

const checkUser = async (req, res) => {
    try {
        const { cf } = req.body;
        const msg = await checkUserIdentity(cf);
        if (msg == true) {
            res.status(200).json(msg);
        } else {
            res.status(400).json(msg);
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
}

const sendVote = async (req, res) => {
    try {
        const { cf, vote } = req.body;
        const msg = await checkUserIdentity(cf);
        if (msg != true) throw new Error(msg);
        const flag = checkVote();
        if (flag == false) throw new Error('Il candidato espresso non è corretto');

        // find candidate 
        const { address } = await DbWallet.find({ type: "candidate", name: vote });
        console.log("candidate addres found:", address);
        // fill vote for all candidate
        candidates = [];
        candidates.push(address);
        const otherCandidates = await DbWallet.find({ type: "candidate", address: { $nin: candidates } });
        otherCandidates.forEach(cand => {
            candidates.push(cand.address);
        });
        // choose elector wallet
        const { _id:id, name } = await DbWallet.find({ type: "elector", loaded: true, isUsed: false }).limit(1);
        console.log("wallet elector:", id, name);
        const result = await blockchain.transferMultiple(name, candidates);
        console.log("result voting", result);
        //updateWallet
        const newRow = await DbWallet.findByIdAndUpdate(id, { isUsed: true }, { new: true });
        console.log("updateWallet", newRow);
        //updateUSer
        const salt = await pdkdf2.getSalt();
        const hash = await pdkdf2.createHash(cf, salt);
        const newUser = await DbUser.create({cf:hash, wallet:name});
        console.log("new user", newUser);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
}

const checkTxId = async (req, res) => {
    try {
        const {txId} = req.body;
        const result = await blockchain.checkTxId('admin',txId);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
}

const checkUserIdentity = async cf => {
    try {
        if (!cf || checkCf() == false) throw new Error('errore nel codice fiscale');
        const salt = await pdkdf2.getSalt();
        const hash = await pdkdf2.createHash(cf, salt);
        const users = await DbUser.find({ cf: hash });
        console.log("users", users);
        if (users.length == 0) {
            return true;
        } else {
            return 'L\'utente ha già espresso il voto';
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}
const checkVote = (vote) => {
    const choice1 = /^cand1$/;
    const choice2 = /^cand2$/;
    const pattVote1 = new RegExp(choice1);
    const pattVote2 = new RegExp(choice2);
    const flag = pattVote1.test(vote) || pattVote2.test(vote);
    console.log("flag vote", flag);
    return flag;

}
const checkCf = cf => {
    const re = /^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i
    const pattCf = new RegExp(re);
    const flag = pattCf.test(cf);
    console.log("pattern cf", flag);
    return flag;
}

module.exports = {
    checkUser,
    sendVote,
    checkTxId
}