
const ctrlBlockchain = require('../../app_api/lib/blockchain');
const mongoose = require('mongoose');
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

const createFakeElector = async to => {
    try {
        console.log("!!!!!!!!!!!!!!!!!!! createFakeElector");
        existFake = await Wallet.find({ type: "fake" });
        console.log("existFake", existFake.length, to);
        if (existFake.length <= to) {
            const rows = [];
            for (let i = existFake.length; i <= to; i++) {
                const name = `ffff${i}`;
                const address = await ctrlBlockchain.createWallet(name);
                const type = "fake"
                rows.push({ name, address, type });
            }
            const result = await Wallet.insertMany(rows);
        }
    } catch (error) {
        console.log(error);
    }
}

const setUpFakeElector = async _ => {
    try {
        console.log("********* setUpFakeElector");
        wallets = await Wallet.find({ type: "fake", isUsed: false }).limit(5);
        if (wallets.length > 0) {
            const electorsAddress = wallets.map(wallet => wallet.address);
            await ctrlBlockchain.transferMultiple(electorsAddress,true);
            const promises = [Wallet.updateMany({ address: { $in: electorsAddress } }, { isUsed: true }), mining(10000)];
            await Promise.all(promises);
            console.log("recall");
        } else return;
    } catch (error) {
        console.log(error);
        await ctrlBlockchain.stopMining();
        return;
    }
}

module.exports = {
    manageMining,
    setupMining,
    setUpFakeElector,
    createFakeElector
}