
let count = 3;

async function countDown() {
    try {
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