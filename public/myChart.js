// Define a function called logCountryCode. This function takes no arguments 
// (the brackets after the function name are empty). When the function is called, 
// the two indented lines of code are executed.
function logCountryCode() {
    // Define a variable called countryCode. Put into it the value that is in the 
    //HTML element with id 'country'.
    var countryCode = document.getElementById('country').value;
    // Print the value of the variable countryCode into the console.
    console.log(countryCode);
}

// Add an event listener to the HTML element with the id 'renderBtn'. That's our 
// button. When the event 'click' happens (when the button is clicked), run the 
// function 'logCountryCode'.
document.getElementById('renderBtn').addEventListener('click', fetchData);

var currentChart;

async function fetchData() {
    var countryCode = document.getElementById('country').value;
    const indicatorCode = 'SP.POP.TOTL';  
    const baseUrl = 'https://api.worldbank.org/v2/country/';
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?format=json&per_page=60';
    console.log('Fetching data from URL: ' + url);

    var response = await fetch(url);

    if (response.status == 200) {
        var fetchedData = await response.json();
        console.log(fetchedData);

        var data = getValues(fetchedData);
        var labels = getLabels(fetchedData);
        var countryName = getCountryName(fetchedData);
        var indicator = getIndicatorName(fetchedData);
        renderChart(data, labels, countryName, indicator);

        //document.getElementById("info-title").innerHTML = countryName + ' - ' + indicator;
    }
}

function getValues(data) {
    var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
}

function getLabels(data) {
    var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    return labels;
}

function getCountryName(data) {
    var countryName = data[1][0].country.value;
    return countryName;
}

function getIndicatorName(data) {
    var indicator = data[1][0].indicator.value;
    return indicator;
}

function renderChart(data, labels, countryName, indicator) {
    var ctx = document.getElementById('myChart').getContext('2d');

    //// Make neongradient
    //var gradient = ctx.createLinearGradient(100, 0, 1000, 0);
    //gradient.addColorStop(0, "#4deeea");
    //gradient.addColorStop(1, "#f000ff");
    //// another neongradiento for hover
    //var gradient2 = ctx.createLinearGradient(100, 0, 1000, 0);
    //gradient2.addColorStop(0, "#f000ff");
    //gradient2.addColorStop(1, "#4deeea");

    //Sympagradient
    var sympaGradient = ctx.createLinearGradient(0, -100, 0, 1000);
    sympaGradient.addColorStop(0, "#e63f3c");
    sympaGradient.addColorStop(1, "#fff");
    
    if (currentChart) {
        // Clear the previous chart if it exists
        currentChart.destroy();
    }

    // Draw new chart
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Population, ' + countryName,
                data: data,
                backgroundColor: sympaGradient,
                borderColor: sympaGradient,
                hoverBackgroundColor: sympaGradient,
                hoverBorderColor: sympaGradient
            }]
        },
        options: {
            title: {
                display: true,
                text: countryName + ' - ' + indicator,
                fontSize: 30,
                fontStyle: 'bold',
                //fontColor: '#000',
            },
            legend: {
                position: "bottom"
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "rgba(0,0,0,0.5)",
                        fontStyle: "bold",
                        beginAtZero: true,
                        maxTicksLimit: 5,
                        padding: 20
                    },
                    gridLines: {
                        drawTicks: false,
                        display: false
                    }
                }],
                xAxes: [{
                    gridLines: {
                        zeroLineColor: "transparent"
                    },
                    ticks: {
                        padding: 20,
                        fontColor: "rgba(0,0,0,0.5)",
                        fontStyle: "bold"
                    }
                }]
            },
            animation: {
                duration: 10000
            }
        }
    });
}