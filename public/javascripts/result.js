window.onload = async function () {
    try {
        const res = await GetResult();
        this.renderColumnChart(res[0].value, res[1].value);
    } catch (error) {
        console.log(error);
    }

}

renderColumnChart = (cand1_value, cand2_value) => {
    Chart.defaults.global.defaultFontColor = 'black'
    var ctx = document.getElementById('chartContainer');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Si', 'No'],
            datasets: [{
                data: [cand1_value, cand2_value],
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',

                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    },
                    labelString: 'numero di voti'
                }]

            },
            legend: {
                display: false
            }

        }
    });
}

GetResult = async () => {
    try {
        document.getElementById("spin").style.display = "block";
        const path = '/api/users/getResults'
        const res = await fetch(path, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            mode: 'cors'
        });
        const obj = await res.json();
        document.getElementById("spin").style.display = "none";
        if (res.status == 200) {
            return obj.candidates;
        } else {
            throw new Error(obj);
        }
    } catch (error) {
        throw error;
    }

}
