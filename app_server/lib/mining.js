
const ctrlBlockchain = require('../../app_api/lib/blockchain');

const mining = async _ => {
    try {
        await ctrlBlockchain.startMining();
        setTimeout(() => {
            ctrlBlockchain.stopMining()
        }, 20000);
    } catch (error) {
        console.log(error);
    }
}

const manageMining = _ => {
    setInterval(() => {
        mining()
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

module.exports = {
    manageMining,
    setupMining
}