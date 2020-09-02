window.onload = async function () {
    const res_mare = await GetResult("mare");
    const res_montagna = await GetResult("montagna");
    this.renderColumnChart(res_mare, res_montagna);
    stopMining();
}

renderColumnChart = (num_mare, num_montagna) => {
    Chart.defaults.global.defaultFontColor ='black'
    var ctx = document.getElementById('chartContainer');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mare', 'Montagna'],
            datasets: [{
                data: [num_mare, num_montagna],
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
                        stepSize:1
                    },
                    labelString:'numero di voti'
                }]

            },
            legend: {
                display: false
            }
            
        }
    });
}

GetResult = async (candidate) => {
    try {
        const path = 'http://localhost:3000/api/' + candidate;
        const res = await fetch(path, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            mode: 'cors'
        });
        const obj = await res.json();
        return obj.balance;
    } catch (error) {
        console.log(error);
    }
}

const stopMining = async _ =>{
    try {
        const path = '/api/mining';
        const data = { method: 'stop_mining' };
        const res = await fetch(path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

    } catch (error) {
        console.log(error);
    }
}