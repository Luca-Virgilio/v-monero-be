
const ctrlBlockchain = require('../../app_api/lib/blockchain');
const { randomBytesFy } = require('./pdkdf2');
const mongoose = require('mongoose');
const wallets = require('../../app_api/controllers/wallets');
const Wallet = mongoose.model('Wallet');

const mining = async (time) => {
    try {
        await ctrlBlockchain.startMining();
        await timer(time);
        await ctrlBlockchain.stopMining();
        // setTimeout(() => {
        //     ctrlBlockchain.stopMining()
        // }, time);
    } catch (error) {
        console.log(error);
    }
}

const manageMining = _ => {
    setInterval(() => {
        mining(20000)
    }, 600000);
}

async function timer(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

const setupMining = async _ => {
    try {
        await ctrlBlockchain.startMining();
        let flag = true;
        while (flag) {
            const res = await ctrlBlockchain.getHeight();
            if (res.height > 100) {
                await ctrlBlockchain.stopMining();
                console.log("setupMining complete. Blockchain height:", res.height);
                flag = false;
            } else {
                await timer(30000);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const createWalletElector = async to => {
    try {
        console.log("!!!!!!!!!!!!!!!!!!! createElector");
        const existElector = await Wallet.find({ type: "elector" });
        console.log("existwalletElector", existElector.length, to);
        if (existElector.length < to) {
            const rows = [];
            for (let i = existElector.length; i <= to; i++) {
                // const rand = await randomBytesFy(10);
                const name = `testEle${i}`;
                const address = await ctrlBlockchain.createWallet(name);
                const type = "elector"
                console.log("insert ", { name, address, type })
                rows.push({ name, address, type });
            }
            const result = await Wallet.insertMany(rows);
        }
    } catch (error) {
        console.log(error);
    }
}

const setUpElector = async _ => {
    try {
        // do {
            console.log("********* setUpElector");
            const wallets = await Wallet.find({ type: "elector", loaded: false }).limit(11);
            console.log('num', wallets.length );
            if (wallets.length > 0) {
                const electorsAddress = wallets.map(wallet => wallet.address);
                await ctrlBlockchain.transferMultiple('admin', electorsAddress);
                const promises = [Wallet.updateMany({ address: { $in: electorsAddress } }, { loaded: true }), mining(10000)];
                await Promise.all(promises);
                console.log("recall");
                setUpElector();
            } else return;
        // } while (wallets.length != 0);
        return;
    } catch (error) {
        console.log(error);
        await ctrlBlockchain.stopMining();
        return;
    }
}

module.exports = {
    manageMining,
    setupMining,
    setUpElector,
    createWalletElector
}