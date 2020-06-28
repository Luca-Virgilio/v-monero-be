// import for access database
const mongoose = require('mongoose');
const UserDB = mongoose.model('User');
// hash function
const crypto = require('crypto');
const pdkdf2 = require('../../app_server/lib/pdkdf2');
const ctrlBlockchain = require('../lib/blockchain');


// version http without engine
const votingController = async (req, res) => {
    console.log('body:');
    console.log(req.body);
    try {
        if (await verifiedReq(req.body.vote, req.body.cf) && req.body.emitterCode && req.body.emissionDate && req.body.expireDate) {

            const stringData = req.body.cf + req.body.emitterCode + req.body.emissionDate + req.body.expireDate;
            const salt = await pdkdf2.getSalt();
            const hash = await pdkdf2.createHash(stringData, salt);
            const result = await UserDB.find({ name: hash });

            if (result.length > 0) {
                res.status(400).json(req.body);
            } else {
                await addUser(stringData);
                ctrlBlockchain.transfer(req.body.vote);

                res
                    .status(201)
                    .json({ msg: 'vote ' + req.body.vote });
            }
        } else {
            res.status(400).json('bad request');
        }
    } catch (error) {
        console.log(error);
    }
};

// insert user into the database
const addUser = async (user) => {
    try {
        console.log('creation ...');
        const salt = await pdkdf2.getSalt();
        const derivedKEy = await pdkdf2.createHash(user, salt);
        await UserDB.create({ name: derivedKEy });
    } catch (error) {
        console.log(error);
    }
};

// verified correctness of vote and cf
const verifiedReq = async (vote, cf) => {
    if (vote && cf) {
        const re = /^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i
        const choice1 = /^montagna$/;
        const choice2 = /^mare$/;

        const pattCf = new RegExp(re);
        const pattVote1 = new RegExp(choice1);
        const pattVote2 = new RegExp(choice2);

        const flag1 = pattCf.test(cf);
        const flag2 = pattVote1.test(vote) || pattVote2.test(vote);
        
        if (flag1 && flag2) {
            return true;
        } else {
            return false;
        }
    } else return false;
}

module.exports = {
    votingController
}