
const checkCf = async _ => {
    try {
        document.getElementById("go_btn").disabled = true;
        const cfInput = document.getElementById("cf").value;
        const cf = cfInput.trim();
        const data = {};
        data.cf = cf.toUpperCase();
        const res = await fetch('/api/users/checkUser', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        console.log(res);
        if (res.status == 200) {
            sessionStorage.setItem('cf', data.cf);
            window.location.href = '/question.html';
        } else {
            const objRes = await res.json();
            document.getElementById("cf-danger").innerHTML = objRes.error;
            document.getElementById("cf-danger").style.display = "block";
        }
    } catch (error) {
        console.log(error);
    }
    document.getElementById("go_btn").disabled = false;
}
const hideAlert = (elements) => {
    const temp = elements.map(id => {
        document.getElementById(id).style.display = "none";
        return id;
    });
}

const cleanModal = _ => {
    document.getElementById("txId").value = null;
    document.getElementById("txId-success").style.display = "none";
    document.getElementById("txId-danger").style.display = "none";

}
const checkTxId = async _ => {
    try {
        document.getElementById("txId-success").style.display = "none";
        document.getElementById("txId-danger").style.display = "none";
        document.getElementById("checkId").disabled = true;
        const txIdInput = document.getElementById("txId").value;
        const txId = txIdInput.trim();
        if (!txId) throw new Error('Inserire un Id valido');
        const data = {};
        data.txId = txId;

        const res = await fetch('/api/users/checkTxId', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const obj = await res.json();
        if (res.status == 200) {
            document.getElementById("txId-success").innerHTML = 'Il tuo voto è stato conteggiato con successo';
            document.getElementById("txId-success").style.display = "block";
        } else {
            console.log(obj);
            document.getElementById("txId-danger").innerHTML = (obj.in_pool == true && obj.double_spend_seen == false)
                ? 'Il tuo voto non è stato ancora conteggiato. Bisogna attendere 1 ora da quanto è stato espresso il voto'
                : 'Inserire un Id valido';
            document.getElementById("txId-danger").style.display = "block";
        }

    } catch (error) {
        console.log(error);
        document.getElementById("txId-danger").innerHTML = error;
        document.getElementById("txId-danger").style.display = "block";
    }
    document.getElementById("checkId").disabled = false;
}

const finish = async _ => {
    try {
        const path = '/api/mining';
        const data = { method: 'start_mining' };
        const res = await fetch(path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        document.getElementById("result_btn").style.display = "block";
        document.getElementById("finish_btn").style.display = "none";
    } catch (error) {
        console.log(error);
    }
}