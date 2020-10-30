/*const socket = io();
socket.on('connect', function () {
    console.log('connect');
});
socket.on('disconnect', function () {
    console.log('disconnect');
});

socket.emit('read-smartcard');

socket.on('card-removed', () => {
    document.getElementById("mareButton").disabled = true;
    document.getElementById("montagnaButton").disabled = true;
    sessionStorage.removeItem('emitterCode');
    sessionStorage.removeItem('emissionDate');
    sessionStorage.removeItem('expireDate');
    sessionStorage.removeItem('cf');
    document.getElementById("alertmsg").style.display = "block";
    countDown("Attenzione. Carta rimossa");
});

socket.on('device-deactivated', () => {
    document.getElementById("mareButton").disabled = true;
    document.getElementById("montagnaButton").disabled = true;
    sessionStorage.removeItem('emitterCode');
    sessionStorage.removeItem('emissionDate');
    sessionStorage.removeItem('expireDate');
    sessionStorage.removeItem('cf');
    document.getElementById("alertmsg").style.display = "block";
    countDown("Attenzione. Device disconnesso");
});

socket.on('generic-error', (error) => {
    sessionStorage.removeItem('emitterCode');
    sessionStorage.removeItem('emissionDate');
    sessionStorage.removeItem('expireDate');
    sessionStorage.removeItem('cf');
    document.getElementById("mareButton").disabled = true;
    document.getElementById("montagnaButton").disabled = true;
    document.getElementById("alertmsg").style.display = "block";
    countDown("Attenzione. Errore di sistema");
});
*/
let count = 3;

async function countDown(txt) {
    const divErr = document.getElementById("alertmsg");
    if (count > 0) {
        divErr.innerHTML = txt + "<br />" + "Questa pagina sarà reindirizzata in " + count + " secondi.";
        count--;
        await timer();
        countDown(txt);
    } else {
        window.location.href = "/index.html";
    }
}

async function timer() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
};

async function post(vote) {
    try {
        document.getElementById("cand1_button").disabled = true;
        document.getElementById("cand2_button").disabled = true;
        document.getElementById("spin").style.display = "block";
        const data = {};
        data.cf = sessionStorage.getItem('cf');
        data.vote = vote;
        const res = await fetch('/api/users/vote', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const obj = await res.json();
        if (res.status == 200) {
            sessionStorage.setItem("txId", obj.txId);
            sessionStorage.removeItem('cf');
            window.location.href = '/thanksgiving.html';
            document.getElementById("cand1_button").disabled = false;
            document.getElementById("cand2_button").disabled = false;
        } else {
            console.log(obj);
            document.getElementById("error-danger").innerHTML = obj.error;
            document.getElementById("error-danger").style.display = "block";
            setTimeout(function () {
                document.getElementById("error-danger").style.display = "none";
                document.getElementById("cand1_button").disabled = false;
                document.getElementById("cand2_button").disabled = false;
            }, 5000);
        }
    } catch (error) {
        console.log(error);
    }
    document.getElementById("spin").style.display = "none";


}

const test = _ => {
    console.log("test");
}