
const ctrlBlockchain = require('../../app_api/lib/blockchain');
const mongoose = require('mongoose');
const wallets = require('../../app_api/controllers/wallets');
const Wallet = mongoose.model('Wallet');
const Info = mongoose.model('Info');

const mining = async (time) => {
    try {
        await ctrlBlockchain.startMining();
        await timer(time);
        await ctrlBlockchain.stopMining();
    } catch (error) {
        console.log(error);
    }
}

const manageMining = _ => {
    setInterval(() => {
        mining(20000)
    }, 180000);
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
        // await some seconds to start mining
        // there is a bug. getHegiht return height:293 if 1st block doesn't exist 
        await timer(10000);
        let flag = true;
        while (flag) {
            const res = await ctrlBlockchain.getHeight();
            if (res.height > 100) {
                await ctrlBlockchain.stopMining();
                console.log("SetupMining complete. Blockchain height:", res.height);
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
        console.log("\nCreating wallet elector");
        const existElector = await Wallet.find({ type: "elector" });
        console.log("number of elector's wallet existing", existElector.length,"of", to);
        if (existElector.length < to) {
            const rows = [];
            for (let i = existElector.length+1; i <= to; i++) {
                const name = `testEle${i}`;
                const address = await ctrlBlockchain.createWallet(name);
                const type = "elector"
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
        const wallets = await Wallet.find({ type: "elector", loaded: false }).limit(11);
        if (wallets.length > 0) {
            console.log("\nAdmin send token to electors");
            const electorsAddress = wallets.map(wallet => wallet.address);
            await ctrlBlockchain.transferMultiple('admin', electorsAddress);
            const promises = [Wallet.updateMany({ address: { $in: electorsAddress } }, { loaded: true }), mining(10000)];
            await Promise.all(promises);
            setUpElector();
        } else {
            const info = await Info.find();
            if (info.length == 0) {
                const setVoting = await Info.create({ isVoting: true });
                console.log("\nVoting phase:", setVoting.isVoting);
            } else
                console.log("\nVoting phase:", info[0].isVoting);
            return;
        }
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