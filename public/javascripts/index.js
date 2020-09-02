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
const checkCf = async (data) =>{
    try {
        document.getElementById("go_btn").disabled = true;
        const cf = document.getElementById("cf").value;
        console.log("test", cf);
        // const res = await fetch('/api/checkIdentity', {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(data)
        // });
        // console.log(res);
        sessionStorage.setItem('cf', cf);
        window.location.href = '/question.html';

    } catch (error) {
        
    }
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