/*const socket = io();
socket.on('connect', function () {
    console.log('connect');
    socket.emit('read-smartcard');
});
socket.on('disconnect', function () {
    console.log('disconnect');
});
socket.on('start-read-card', function () {
    console.log('start-read-card');
    document.getElementById("spin").style.display = "block";
    document.getElementById("alertmsg").style.display = "none";
});

// evento in cui il cf è presente nel db
socket.on('cns-read', (data) => {
    document.getElementById("spin").style.display = "none";
    console.log(data);
    sessionStorage.setItem('cf', data.cf);
    sessionStorage.setItem('emitterCode', data.emitterCode);
    sessionStorage.setItem('emissionDate', data.emissionDate);
    sessionStorage.setItem('expireDate', data.expireDate);
    console.log(data);
    window.location.href = '/question.html';
});
// evento in cui la persona ha già votato
socket.on('cns-invalid', (data) => {
    console.log(data);
    console.log('cns-invalid');
    document.getElementById("spin").style.display = "none";
    document.getElementById("alertmsg").style.display = "block";
    document.getElementById("alertmsg").innerText = "con questa tessera è già stato effettuato il voto.";
});
// evento in cui si utilizza un cf di un minorenne
socket.on('age-invalid', (data) => {
    console.log(data);
    console.log('age-invalid');
    document.getElementById("spin").style.display = "none";
    document.getElementById("alertmsg").style.display = "block";
    document.getElementById("alertmsg").innerText = "Possono votare solo i maggiorenni.";
});

socket.on('cns-error', (error) => {
    console.log(error);
    console.log('cns-error');
    document.getElementById("spin").style.display = "none";
    let errCount = parseInt(sessionStorage["errCount"]);
    if (isNaN(errCount)) {
        sessionStorage.setItem("errCount", 1);
        window.location.reload(true);
    } else {
        if (errCount < 4) {
            sessionStorage.setItem("errCount", errCount + 1);
            window.location.reload(true);
        } else {
            document.getElementById("alertmsg").style.display = "block";
            document.getElementById("alertmsg").innerText = "Errore nella lettura della carta. Prego, reinserirla";
            setTimeout(() => {
                document.getElementById("alertmsg").style.display = "none";
                sessionStorage.removeItem('errCount');
            }, 5000);
        }
    }
});

socket.on('generic-error', (error) => {
    console.log(error);
    console.log('generic-error');
    document.getElementById("spin").style.display = "none";
    let errCount = parseInt(sessionStorage["errCount"]);
    if (isNaN(errCount)) {
        sessionStorage.setItem("errCount", 1);
        window.location.reload(true);
    } else {
        if (errCount < 4) {
            sessionStorage.setItem("errCount", errCount + 1);
            window.location.reload(true);
        } else {
            document.getElementById("alertmsg").style.display = "block";
            document.getElementById("alertmsg").innerText = "Errore di sistema. Prego, reinserire la carta";
            setTimeout(() => {
                document.getElementById("alertmsg").style.display = "none";
                sessionStorage.removeItem('errCount');
            }, 5000);
        }
    }
});

socket.on('device-error', (error) => {
    console.log(error);
    console.log('device-error');
    document.getElementById("spin").style.display = "none";
    document.getElementById("alertmsg").style.display = "block";
    document.getElementById("alertmsg").innerText = "Errore. Carta non riconosciuta";
    setTimeout(() => {
        document.getElementById("alertmsg").style.display = "none";
        sessionStorage.removeItem('errCount');
    }, 5000);
});

socket.on('card-removed', (error) => {
    console.log(error);
    console.log('card-removed');
    document.getElementById("spin").style.display = "none";
    document.getElementById("alertmsg").style.display = "none";
    sessionStorage.removeItem('errCount');

});

socket.on('device-activated', (error) => {
    console.log(error);
    console.log('device-activated');
    document.getElementById("spin").style.display = "none";
    document.getElementById("alertmsg").style.display = "none";
});
// handle device-deactivated
socket.on('device-deactivated', (error) => {
    console.log(error);
    console.log('device-error');
    document.getElementById("spin").style.display = "none";
    document.getElementById("alertmsg").style.display = "block";
    document.getElementById("alertmsg").innerHTML = 'Errore. Device scollegato';
});
*/

const checkCf = async _ => {
    try {
        document.getElementById("go_btn").disabled = true;
        const cfInput = document.getElementById("cf").value;
        const cf = cfInput.trim();
        console.log("test", cf);
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
    console.log("cleanModal")
    document.getElementById("txId").value = null;
    document.getElementById("txId-success").style.display = "none";
    document.getElementById("txId-danger").style.display = "none";

}
const checkTxId = async _ => {
    try {
        document.getElementById("checkId").disabled = true;
        const txIdInput = document.getElementById("txId").value;
        const txId = txIdInput.trim();
        console.log("aaa", txId==undefined, txId == null, !txId);
        if (!txId) throw new Error('Inserire un Id valido');
        const data = {};
        data.txId = txId;
        console.log("check", data);

        const res = await fetch('/api/users/checkTxId', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const obj = await res.json();
        console.log(obj);
        if (res.status == 200) {
            document.getElementById("txId-success").innerHTML = 'Il tuo voto è stato conteggiato con successo';
            document.getElementById("txId-success").style.display = "block";
        } else {
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