
let count = 20;


async function countDown() {
    try {
        if(count == 20) {
            const txId = sessionStorage.getItem("txId");
            document.getElementById("txId").innerText = `Il tuo transaction Id è ${txId}`;
        }
        if (count > 0) {
            console.log('timer ', count);
            count--;
            await timer();
            countDown();
        } else {
            window.location.href = "/index.html";
        }
    } catch (error) {
        console.log(error);
    }
}

async function timer() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
};