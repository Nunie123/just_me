"use strict";

var darkBlue = '#3e5d8e';
var offWhite = '#fcfbf7';

google.charts.load('current', {
    'packages': ['geochart', 'corechart']
});

$(document).ready(function() {
    //console.log("ready!");


    var stateJobCount = [];
    var states = {};
    var totalDataJobs = 0;


    $.get('http://jsonip.com/', function(r) {
        $.ajax({
            url: "http://api.glassdoor.com/api/api.htm?",
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                v: "1",
                "t.p": "135468",
                "t.k": "fH5UTw1reua",
                action: "jobs-stats",
                //q: "data",
                jt: "data",
                format: "json",
                userip: r.ip,
                useragent: navigator.userAgent,
                //returnJobTitles: true
                returnStates: true,
                amdLevelRequested: 1
            },
            success: function(response) {
                console.log(response);
                if (response.success === true) {
                    states = response.response.states;
                    stateJobCount.push(["State", "Number of Data Jobs"]);
                    Object.keys(states).forEach(function(key, idx) {
                        //console.log(states[key].numJobs);
                        stateJobCount.push([states[key].name, states[key].numJobs]);
                        totalDataJobs += states[key].numJobs;
                    });
                    $(".number-of-jobs").text(comma(totalDataJobs));
                    $("#jobs-map").attr("height", "500");

                    google.charts.setOnLoadCallback(drawMap(stateJobCount, jobMapOptions, 'jobs-map'));
                } else {
                    $("#jobs-map").attr("height", "0");
                    $(".glassdoor-citation").text("");
                }



                google.charts.setOnLoadCallback(drawLineChart(nGramData, nGramLineChartOptions, 'data-in-books'));

                //data loaded in from ./google_trends_data.js
                google.charts.setOnLoadCallback(drawLineChart(googleTrendsData, googleTrendsLineChartOptions, 'google-trends'));

                //data loaded in from ./internet_users_data.js
                google.charts.setOnLoadCallback(drawLineChart(internetUsersPercent, internetUsersLineChartOptions, 'internet-users'));

                //data loaded in from ./internet_users_data.js
                google.charts.setOnLoadCallback(drawMap(internetCountries2000, internetCountriesMapOptions2000, 'internet-countries-2000'));

                //data loaded in from ./internet_users_data.js
                google.charts.setOnLoadCallback(drawMap(internetCountries2015, internetCountriesMapOptions2015, 'internet-countries-2015'));

            }
        });
    });
});


var jobMapOptions = {
    region: 'US',
    displayMode: 'regions',
    resolution: 'provinces'
};
var internetCountriesMapOptions2000 = {
    colorAxis: {
        minValue: 0,
        maxValue: 100,
        colors: [offWhite, darkBlue]
    },
    region: 'world',
    displayMode: 'regions',
    resolution: 'countries',
    legend: 'none'
};
var internetCountriesMapOptions2015 = {
    colorAxis: {
        minValue: 0,
        maxValue: 100,
        colors: [offWhite, darkBlue]
    },
    title: '2015',
    titlePosition: 'out',
    titleTextStyle: {
        fontSize: 14
    },
    region: 'world',
    displayMode: 'regions',
    resolution: 'countries',
    legend: 'none'
};
var nGramLineChartOptions = {
    title: 'As the volume of data grows, people work harder to learn how to structure the data into value.',
    titlePosition: 'out',
    titleTextStyle: {
        fontSize: 14
    },
    fontName: 'sans-serif',
    curveType: 'function',
    colors: [darkBlue],
    chartArea: {
        width: '90%',
        height: '77%',
        left: '9%',
        top: '15%'
    },
    legend: {
        position: 'none'
    },
    vAxis: {
        title: 'use of "data analytics" in literature',
        titleTextStyle: {
            color: 'gray'
        },
        textPosition: 'in',
        textStyle: {
            color: 'gray'
        },
        gridlines: {
            count: 0,
            color: 'transparent'
        },
        format: 'percent'
    },
    hAxis: {
        showTextEvery: 5,
        textPosition: 'out',
        baslineColor: 'gray',
        textStyle: {
            color: 'gray'
        },
        gridlines: {
            color: 'gray'
        }
    }
};
var googleTrendsLineChartOptions = {
    title: 'The internet is the major source of the data, and also a resource for learning how to handle data.',
    titlePosition: 'out',
    titleTextStyle: {
        fontSize: 14
    },
    fontName: 'sans-serif',
    curveType: 'function',
    colors: [darkBlue],
    chartArea: {
        width: '90%',
        height: '77%',
        left: '9%',
        top: '15%'
    },
    legend: {
        position: 'none'
    },
    vAxis: {
        title: 'internet searches for "data analytics"',
        titleTextStyle: {
            color: 'gray'
        },
        textPosition: 'in',
        textStyle: {
            color: 'gray'
        },
        gridlines: {
            count: 0,
            color: 'transparent'
        },
    },
    hAxis: {
        showTextEvery: 2,
        textPosition: 'out',
        baslineColor: 'gray',
        textStyle: {
            color: 'gray'
        },
        gridlines: {
            color: 'transparent'
        },
        format: 'MMM, y'
    }
};
var internetUsersLineChartOptions = {
    title: '3.2 billion internet users contribute to the 2.5 quintillion bytes of data created each day.',
    titlePosition: 'out',
    titleTextStyle: {
        fontSize: 14
    },
    fontName: 'sans-serif',
    curveType: 'function',
    colors: [darkBlue],
    chartArea: {
        width: '90%',
        height: '77%',
        left: '9%',
        top: '15%'
    },
    legend: {
        position: 'none'
    },
    vAxis: {
        title: 'global population with internet',
        titleTextStyle: {
            color: 'gray'
        },
        textPosition: 'in',
        textStyle: {
            color: 'gray'
        },
        gridlines: {
            count: 5,
            color: 'transparent'
        },
        format: 'percent'
    },
    hAxis: {
        showTextEvery: 5,
        textPosition: 'out',
        baslineColor: 'gray',
        textStyle: {
            color: 'gray'
        },
        gridlines: {
            color: 'gray'
        }
    }
};

function drawMap(dataArray, options, nodeId) {
    var data = google.visualization.arrayToDataTable(dataArray);
    var chart = new google.visualization.GeoChart(document.getElementById(nodeId));
    chart.draw(data, options);
}

function drawLineChart(dataArray, options, nodeId) {
    var data = google.visualization.arrayToDataTable(dataArray);
    var chart = new google.visualization.LineChart(document.getElementById(nodeId));
    chart.draw(data, options);
}


//Function to add comma to seperate thousands.
//source: http://stackoverflow.com/questions/3883342/add-commas-to-a-number-in-jquery
function comma(val) {
    // while (/(\d+)(\d{3})/.test(val.toString())){
    while (/(\d+)(\d{3})/.test(val)) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}



//https://books.google.com/ngrams/graph?content=data+analytics&case_insensitive=on&year_start=1988&year_end=2008&corpus=15&smoothing=3&share=&
//direct_url=t4%3B%2Cdata%20analytics%3B%2Cc0%3B%2Cs0%3B%3Bdata%20analytics%3B%2Cc0%3B%3BData%20Analytics%3B%2Cc0
var nGramData = [
    ['year', 'Use in Literature'],
    ['1988', 0.0],
    ['1989', 7.5182959857755807e-11],
    ['1990', 8.3829133449656964e-11],
    ['1991', 7.1853542956848817e-11],
    ['1992', 7.1853542956848817e-11],
    ['1993', 8.7406931890767115e-11],
    ['1994', 1.0254978711448409e-10],
    ['1995', 1.0254978711448409e-10],
    ['1996', 6.2453503678140878e-11],
    ['1997', 9.2909419245414329e-11],
    ['1998', 1.2885002687828313e-10],
    ['1999', 2.1569585899129861e-10],
    ['2000', 5.3920232168103155e-10],
    ['2001', 9.4012998973015889e-10],
    ['2002', 1.7036791659969757e-09],
    ['2003', 2.0366700429327469e-09],
    ['2004', 2.8699634097811048e-09],
    ['2005', 3.8751640547245762e-09],
    ['2006', 4.4197045930468209e-09],
    ['2007', 4.8289617193830743e-09],
    ['2008', 5.3080787335013646e-09]
]
