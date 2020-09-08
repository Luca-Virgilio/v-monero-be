
let count = 20;


async function countDown() {
    try {
        if (count == 20) {
            $(function () {
                $('[data-toggle="popover"]').popover()
              })
            const txId = sessionStorage.getItem("txId");
            document.getElementById("txId-value").innerHTML = `${txId}`;

        }
        if (count > 0) {
            console.log('timer ', count);
            count--;
            await timer();
            countDown();
        } else {
            sessionStorage.removeItem('txId');
            window.location.href = "/index.html";
        }
    } catch (error) {
        console.log(error);
    }
}
const copyId = _ => {
    console.log("copy");
    const txId = sessionStorage.getItem("txId");
    let dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.value = txId;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    setTimeout(function () {
        $('[data-toggle="popover"]').popover('hide');
    }, 2000);
}
async function timer() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
};