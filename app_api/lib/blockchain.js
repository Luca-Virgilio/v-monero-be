const fetch = require("node-fetch");

const voteAddress = new Map();
// GET
const verifyWallet = async (wallet1, wallet2) => {
    try {
        await postRequest("close_wallet");
        const res_admin = await postRequest("open_wallet", { filename: "admin", "password": "" });
        console.log(res_admin);
        (res_admin.error) ? await createWallet("admin") : await postRequest("close_wallet"); console.log(`admin's wallet alredy exist`);
        const res1 = await postRequest("open_wallet", { filename: wallet1, "password": "" });
        console.log(res1);
        (res1.error) ? await createWallet(wallet1) : await postRequest("close_wallet"); console.log(`${wallet1}'s wallet alredy exist`);
        const res2 = await postRequest("open_wallet", { filename: wallet2, "password": "" });
        console.log(res2);
        (res2.error) ? await createWallet(wallet2) : await postRequest("close_wallet"); console.log(`${wallet2}'s wallet alredy exist`);
        await printAddress(wallet1, wallet2);
    } catch (error) {
        console.log(error);
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
const transfer = async candidate => {
    try {
        await postRequest("close_wallet");
        await postRequest("open_wallet", { "filename": "admin", "password": "" });
        const res = await postRequest("transfer", { "destinations": [{ "amount": 1000000000000, "address": voteAddress.get(candidate) }], "account_index": 0 });
        console.log("transfer:", res);
        await postRequest("close_wallet");

    } catch (error) {
        console.log(error);
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
        const num = res.result.balance / 1000000000000;
        return { balance: num };

    } catch (error) {
        console.log(error);
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
        console.log(res.result);
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
        const response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
}
module.exports = {
    createWallet,
    verifyWallet,
    transfer,
    getBalance,
    startMining,
    stopMining,
    getHeight
}