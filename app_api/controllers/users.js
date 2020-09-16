const mongoose = require('mongoose');
const DbUser = mongoose.model('User');
const DbWallet = mongoose.model('Wallet');
const InfoDB = mongoose.model('Info');
// // hash function
const crypto = require('crypto');
const pdkdf2 = require('../../app_server/lib/pdkdf2');
const blockchain = require('../lib/blockchain');

const checkUser = async (req, res) => {
    try {
        const { cf } = req.body;
        const msg = await checkUserIdentity(cf);
        if (msg == true) {
            res.status(200).json({ "result": msg });
        } else {
            res.status(400).json({ "error": msg });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ "error": error.message });
    }
}

const sendVote = async (req, res) => {
    try {
        const { cf, vote } = req.body;
        const info = await InfoDB.find().limit(1);
        if(info[0].isVoting == false) throw new Error('La votazione è terminata. Non è più possibile esprimere voti');
        const msg = await checkUserIdentity(cf);
        if (msg != true) throw new Error(msg);
        const flag = checkVote(vote);
        if (flag == false) throw new Error('Il candidato espresso non è corretto');
        // find candidate 
        const query1 = await DbWallet.find({ type: "candidate", name: vote });
        if(query1.length == 0) throw new Error("Errore nella scelta del candidato o nella creazione del proprio wallet");
        const { address } = query1[0];
        // fill vote for all candidate
        candidates = [];
        candidates.push(address);
        const otherCandidates = await DbWallet.find({ type: "candidate", address: { $nin: candidates } });
        if(otherCandidates.length == 0) throw new Error("Errore nella creazione dei wallets candidato");
        otherCandidates.forEach(cand => {
            candidates.push(cand.address);
        });
        // choose elector wallet
        const query2 = await DbWallet.find({ type: "elector", loaded: true, isUsed: false }).limit(1);
        if(query2.length == 0) throw new Error('Non sono più disponibili wallet per votare');
        const { _id: id, name } = query2[0];
        if (!name || candidates.length == 0) throw new Error('Errore nella scelta del candidato');
        const result = await blockchain.transferMultiple(name, candidates);
        //updateWallet
        const newRow = await DbWallet.findByIdAndUpdate(id, { isUsed: true }, { new: true });
        //updateUSer
        const salt = await pdkdf2.getSalt();
        const hash = await pdkdf2.createHash(cf, salt);
        const newUser = await DbUser.create({ cf: hash, wallet: name });
        const { tx_hash } = result.result;
        return res.status(200).json({ "txId": tx_hash });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ "error": error.message });
    }
}

const checkTxId = async (req, res) => {
    try {
        const { txId } = req.body;
        const info = await blockchain.checkTxId('admin', txId);
        if (info.block_height && info.double_spend_seen == false && info.in_pool == false) {
            return res.status(200).json({ "block_height": info.block_height, "double_spend_seen": info.double_spend_seen, "in_pool": info.in_pool });
        } else return res.status(400).json({ "double_spend_seen": info.double_spend_seen, "in_pool": info.in_pool });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ "error": error.message });
    }
}

const getResults = async (req, res) => {
    try {
        const info = await InfoDB.find().limit(1);
        if(info[0].isVoting == true) throw new Error('La votazione è in corso. Solo al termine è possibile vedere i risultati');
        const candidates = await DbWallet.find({ type: "candidate" }).sort({name:1});
        elements = [];
        for(let cand of candidates){
            if (cand.value) elements.push({ "name":cand.name, "value": cand.value });
            else {
                const obj = await getBalance(cand.name, cand._id);
                elements.push(obj);
            }
        }
        res.status(200).json({ "candidates": elements });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ "error": error.message });
    }
}

const getBalance = async (name, id) => {
    try {
        const balance = await blockchain.getBalance(name);
        const rounded = Math.floor(balance);
        console.log("balance", rounded);
        const newRow = await DbWallet.findByIdAndUpdate(id, { value: rounded });
        console.log("updated", newRow);
        return { name, "value": rounded };
    } catch (error) {
        console.log(error);
        throw error;
    }


}

const checkUserIdentity = async cf => {
    try {
        if (!cf || checkCf(cf) == false) throw new Error('Inserire un codice fiscale valido');
        const salt = await pdkdf2.getSalt();
        const hash = await pdkdf2.createHash(cf, salt);
        const users = await DbUser.find({ cf: hash });
        if (users.length == 0) {
            return true;
        } else {
            return 'L\'utente con questo codice fiscale ha già espresso il voto';
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}
const checkVote = (vote) => {
    const choice1 = /^cand1$/;
    const choice2 = /^cand2$/;
    const pattVote1 = new RegExp(choice1);
    const pattVote2 = new RegExp(choice2);
    const flag = pattVote1.test(vote) || pattVote2.test(vote);
    // console.log("flag vote", flag);
    return flag;

}
const checkCf = (cf) => {
    const re = /^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/;
    const pattCf = new RegExp(re);
    const flag = pattCf.test(cf);
    // console.log("is valid cf?", flag);
    return flag;
}

module.exports = {
    checkUser,
    sendVote,
    checkTxId,
    getResults
}