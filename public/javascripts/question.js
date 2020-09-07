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
        console.log("clicked", vote);
        document.getElementById("cand1_button").disabled = true;
        document.getElementById("cand2_button").disabled = true;
        const data = {};
        data.cf = sessionStorage.getItem('cf');
        data.vote = vote;
        console.log(data);
        const res = await fetch('/api/users/vote', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const obj = await res.json();
        if (res.status == 200) {
            console.log(obj);
            sessionStorage.setItem("txId",obj.txId);
            sessionStorage.removeItem('cf');
            window.location.href = '/thanksgiving.html';
        } else {
            const obj = await res.json();
            console.log(obj);
            throw new Error (obj.error);
        }
    } catch (error) {
        console.log(error);
    }


}

const test = _ => {
    console.log("test");
}