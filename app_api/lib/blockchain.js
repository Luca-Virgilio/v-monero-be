const fetch = require("node-fetch");

const voteAddress = new Map();
// GET
const verifyWallet = async (candidates) => {
    try {
        await postRequest("close_wallet");
        const res_admin = await postRequest("open_wallet", { filename: "admin", "password": "" });
        await postRequest("close_wallet");
        console.log(`admin's wallet alredy exist`);
        // console.log(res_admin);
        // (res_admin.error) ? await createWallet("admin") : await postRequest("close_wallet"); console.log(`admin's wallet alredy exist`);
        // const res1 = await postRequest("open_wallet", { filename: wallet1, "password": "" });
        // console.log('cand1', res1);
        // (res1.error) ? await createWallet(wallet1) : await postRequest("close_wallet"); console.log(`${wallet1}'s wallet alredy exist`);
        // const res2 = await postRequest("open_wallet", { filename: wallet2, "password": "" });
        // console.log('cand2', res2);
        // (res2.error) ? await createWallet(wallet2) : await postRequest("close_wallet"); console.log(`${wallet2}'s wallet alredy exist`);
        const rowDb = [];
        for (let i = 0; i < candidates.length; i++) {
            const name = candidates[i];
            try {
                const res = await postRequest("open_wallet", { filename: name, "password": "" });
            } catch (error) {
                const address = await createWallet(name);
                await postRequest("close_wallet");
                rowDb.push({ name, address, type: 'candidate' });
            }
            console.log(`${name}'s wallet alredy exist`)
        }
        return rowDb;
        // await printAddress(wallet1, wallet2);
    } catch (error) {
        console.log(error);
        throw new FatalError("admin address doesn't exist!");
    }
};

// create destination's wallets
const createWallet = async (name) => {
    try {
        await postRequest("close_wallet");
        const res = await postRequest("create_wallet", { "filename": name, "password": "", "language": "English" });
        console.log(`${name}'s wallet created`);
        const result = await postRequest("get_address", { "account_index": 0 });
        await postRequest("close_wallet");
        return result.result.address;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// GET destination's wallets address
const printAddress = async (name1, name2) => {
    try {
        await postRequest("close_wallet");
        await postRequest("open_wallet", { "filename": name1, "password": "" });
        const result1 = await postRequest("get_address", { "account_index": 0 });
        voteAddress.set(name1, result1.result.address);
        console.log(`${name1}'s address: `, result1.result.address);
        await postRequest("close_wallet");
        if (name2) {
            await postRequest("open_wallet", { "filename": name2, "password": "" });
            const result2 = await postRequest("get_address", { "account_index": 0 });
            voteAddress.set(name2, result2.result.address);
            console.log(`${name2}'s address: `, result2.result.address);
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};
const transferVoting = async (elector, candidates) => {
    try {
        let num = 0;
        console.log("num", num);
        const payload = candidates.map(addr => {
            const amount = num == 0 ? 1000000000000 : 10000000;
            const vote = { "amount": amount, "address": addr };
            num++;
            return vote;
        });
        await postRequest("close_wallet");
        await postRequest("open_wallet", { "filename": elector, "password": "" });
        await postRequest("refresh", { "start_height": 0 });
        const res = await postRequest("transfer", { "destinations": payload, "account_index": 0 });
        await postRequest("close_wallet");
        if (res.error) throw res.error;
        console.log("transfer:", res);

    } catch (error) {
        console.log(error);
        throw error;
    }

}

const transferMultiple = async (sender, destionations) => {
    try {
        const amount = 2000000000000;
        let index = 0;
        const payload = sender=='admin' ?
        destionations.map(addr => {
                return { "amount": amount, "address": addr }
            })
            // during the vote, only the first address is the correct one. The others are fake
            : destionations.map(addr => {
                if (index = 0) {
                    return {"amount": 1000000000000, "address": addr}
                } else {
                    return { "amount": 100, "address": addr }
                }
            })
        await postRequest("close_wallet");
        await postRequest("open_wallet", { "filename": `${sender}`, "password": "" });
        await postRequest("refresh", { "start_height": 0 });
        const res = await postRequest("transfer", { "destinations": payload, "account_index": 0 });
        await postRequest("close_wallet");
        if (res.error) throw res.error;
        console.log("transfer:", res);

    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getBalance = async wallet => {
    try {
        await postRequest("close_wallet");
        await postRequest("open_wallet", { "filename": wallet, "password": "" });
        await postRequest("refresh", { "start_height": 0 });
        const res = await postRequest("get_balance", { "account_index": 0 });
        console.log("getBalance:", res);
        await postRequest("close_wallet");
        const balance = res.result.balance / 1000000000000;
        return balance;

    } catch (error) {
        console.log(error);
        throw error;
    }
}
const startMining = async _ => {
    try {
        await postRequest("close_wallet");
        await postRequest("open_wallet", { "filename": "admin", "password": "" });
        const res = await postRequest("start_mining", { "threads_count": 1 });
        console.log("start mining: ", res);
        await postRequest("close_wallet");
    } catch (error) {
        console.log(error);
    }
}

const stopMining = async _ => {
    try {
        await postRequest("close_wallet");
        await postRequest("open_wallet", { "filename": "admin", "password": "" });
        const res = await postRequest("stop_mining");
        console.log("stop mining: ", res);
        await postRequest("close_wallet");
    } catch (error) {
        console.log(error);
    }
}

const getHeight = async _ => {
    try {
        await postRequest("close_wallet");
        await postRequest("open_wallet", { "filename": "admin", "password": "" });
        console.log('verifing blockchain\'s height');
        await postRequest("refresh", { "start_height": 0 });
        const res = await postRequest("get_height");
        await postRequest("close_wallet");
        return res.result;
    } catch (error) {
        console.log(error);
    }
}

const postRequest = async (method, params) => {
    try {
        // verify destination's wallet
        const url = "http://127.0.0.1:30014/json_rpc";
        const body = { "jsonrpc": "2.0", "id": "0" };
        if (params) {
            body.method = method;
            body.params = params;
        } else {
            body.method = method;
        }
        console.log("body", JSON.stringify(body));
        const response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        });
        const res = await response.json();
        if (res.error && res.error.code != -13) throw res.error;
        return res;
    } catch (error) {
        console.log('postRequest', error);
        throw error;
    }
}
module.exports = {
    createWallet,
    verifyWallet,
    transferVoting,
    getBalance,
    startMining,
    stopMining,
    getHeight,
    transferMultiple
}