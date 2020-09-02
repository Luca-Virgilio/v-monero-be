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
        divErr.innerHTML = txt + "<br />" +"Questa pagina sarà reindirizzata in " + count + " secondi.";
        count--;
        await timer();
        countDown(txt);
    } else {
        window.location.href ="/index.html";
    }
}

async function timer () {
    return new Promise ((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
};

async function post(data) {
    document.getElementById("mareButton").disabled = true;
    document.getElementById("montagnaButton").disabled = true;
    data.emitterCode = sessionStorage.getItem('emitterCode');
    data.emissionDate = sessionStorage.getItem('emissionDate');
    data.expireDate = sessionStorage.getItem('expireDate');
    data.cf = sessionStorage.getItem('cf');
    console.log(data);
    const path = '/api/vote';
    const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    sessionStorage.removeItem('emitterCode');
    sessionStorage.removeItem('emissionDate');
    sessionStorage.removeItem('expireDate');
    sessionStorage.removeItem('cf');
    window.location.href = '/thanksgiving.html';
}

const test = _ =>{
    console.log("test");
}