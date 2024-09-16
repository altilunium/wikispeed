// var editsFeed = io.connect('stream.wikimedia.org/rc');
var gaugeNodes = document.getElementsByClassName('gauge');
var beginTimestamp = Date.now()/1000;
var counterPeriod = 60; // 60 seconds --> we'll displays edits per minute
var editsInLastMinute = {}; // List of arrays containing the timestamps of recent edits per wiki
var gaugeCharts = {}; // List of charts
var rr = {}
var la = {}
var flag = {}
var user = {}
var isUser = true;
var activeUser = {}
var userDB = {}
var ex_activeUser = {}
var isInfoMode = false;
var currentInfo = ""
var lastTenLog = {}

function getFirstSubdomain(url) {
    // Create an anchor element to easily extract different parts of the URL

    return emojii(url.split('.')[0]);
}




function summon(id){
   

    if ( (id !== "global") && (id !== "wikidatawiki")  && (id !== "commonswiki") ) {

 var scaleRatio = 1;
    var extraSize = 1;

    var parentDiv = document.getElementById("nya");
    var existingElement = document.getElementById(id);
    if (!existingElement) {
        var newDiv = document.createElement("div");


        newDiv.addEventListener('click', () => {
        // Pass the element's DOM id as a parameter to your function
        showStat(id);
      });


        newDiv.className = "gauge";
        newDiv.id = id;
        newDiv.setAttribute("title", id); // Set the title to the id or customize if needed
        theSub = la[id]
        if (isUser) {
            theSub = user[id]
        }
        
        // Append the new div to the parent div
        parentDiv.appendChild(newDiv);
        gaugeCharts[ id ] = new Highcharts.Chart({
        chart: {
            type: 'gauge',
            renderTo: id
        },
        title: {
            text: flag[id]+" "+id,
            style: {
                fontFamily :"Noto Color Emoji, sans-serif"
            }
        },
        subtitle: {
            text: theSub
        },
        tooltip: {
            enabled: false
        },
        pane: {
            startAngle: -150,
            endAngle: 150
        },
        // The Y (value) axis. Note: a gauge chart has no X axis.
        yAxis: {
            min: 1*scaleRatio,
            max: 600*scaleRatio,
            minorTickColor: '#777',
            minorTickInterval: 0.1,
            tickPositions: [
                Math.log(1*scaleRatio)/Math.log(10),
                Math.log(3*scaleRatio)/Math.log(10),
                Math.log(6*scaleRatio)/Math.log(10),
                Math.log(10*scaleRatio)/Math.log(10),
                Math.log(30*scaleRatio)/Math.log(10),
                Math.log(60*scaleRatio)/Math.log(10),
                Math.log(100*scaleRatio)/Math.log(10),
                Math.log(300*scaleRatio)/Math.log(10),
                Math.log(600*scaleRatio)/Math.log(10)
            ],
            minorTickLength: 9+extraSize,
            tickLength: 9+extraSize,
            endOnTick: true,
            tickColor: '#666',
            labels: {
                style: {
                    fontSize: (extraSize > 1 ? 16 : 8) + 'px'
                },
                distance: (extraSize > 1 ? -40 : -20)
            },
            type: 'logarithmic',
            title: extraSize > 1 ? { text: 'edits/min' } : null,
            plotBands: [{
                from: 1*scaleRatio, // In log scale, minumum can't be zero
                to: 60*scaleRatio, // 1 (or 10) per second
                color: 'YellowGreen', // Green
                thickness: 9+extraSize
            }, {
                from: 60*scaleRatio,
                to: 300*scaleRatio, // 5 (or 50) per second
                color: 'Gold', // Yellow
                thickness: 9+extraSize
            }, {
                from: 300*scaleRatio,
                to: 600*scaleRatio, // 10 (or 100) per second
                color: 'Salmon', // Red
                thickness: 9+extraSize
            }]
        },
        plotOptions: {
            gauge: {
                dial: {
                    baseWidth: 10+extraSize,
                    topWidth: 1,
                    baseLength: '0%', // location along radius where it starts narrowing
                    rearLength: '0%' // don't project back, start at center
                },
                pivot: {
                    radius: (10+extraSize)/2
                }
            }
        },
        // Only one data series, initialized with the minimum allowed value
        series: [{
            name: 'edits per minute',
            data: [1*scaleRatio],
            dataLabels: {
                backgroundColor: 'white',
                y: -15,
                style: {
                    fontSize: (extraSize > 1 ? 30 : 15) + 'px'
                },
                zIndex: 3
            }
        }],
        credits: {
            enabled: (extraSize != 1), // Only show credits in the large gauge
            position: {
                align: 'center',
                x: 0
            }
        }
    });
    }
    }



}


function destroy(){
    
   var gaugeNodes = document.getElementsByClassName('gauge');

    Array.from(gaugeNodes).forEach(function(node) {
  // If the element's id does not match the one you want to keep, remove it
      if ( (node.id !== "global") && (node.id !== "wikidatawiki") ) {
        if (rr[node.id] == 1) {
            node.remove()
        }      
      }
});



}



//############################################################
//                              SET UP CHARTS
//############################################################
for(var i=0; i<gaugeNodes.length; i++) // for(elem of gaugeNodes) doesn't seem to work on Chrome...
{
    // Initialize arrays, so we can push to them
    editsInLastMinute[ gaugeNodes[i].id ] = [];

    // Use larger limits for the global and wikidata charts
    var scaleRatio = ( gaugeNodes[i].id == "global" || gaugeNodes[i].id == "wikidatawiki" || gaugeNodes[i].id == "commonswiki" ) ? 10 : 1;
    // Use larger element sizes for the global chart
    var extraSize = ( gaugeNodes[i].id == "global" || gaugeNodes[i].id == "wikidatawiki" ) ? 10 : 1;

    // Set up the gauge charts
    gaugeCharts[ gaugeNodes[i].id ] = new Highcharts.Chart({
        chart: {
            type: 'gauge',
            renderTo: gaugeNodes[i].id
        },
        title: {
            text: gaugeNodes[i].title
        },
        subtitle: {
            text: gaugeNodes[i].dataset.lang
        },
        tooltip: {
            enabled: false
        },
        pane: {
            startAngle: -150,
            endAngle: 150
        },
        // The Y (value) axis. Note: a gauge chart has no X axis.
        yAxis: {
            min: 1*scaleRatio,
            max: 600*scaleRatio,
            minorTickColor: '#777',
            minorTickInterval: 0.1,
            tickPositions: [
                Math.log(1*scaleRatio)/Math.log(10),
                Math.log(3*scaleRatio)/Math.log(10),
                Math.log(6*scaleRatio)/Math.log(10),
                Math.log(10*scaleRatio)/Math.log(10),
                Math.log(30*scaleRatio)/Math.log(10),
                Math.log(60*scaleRatio)/Math.log(10),
                Math.log(100*scaleRatio)/Math.log(10),
                Math.log(300*scaleRatio)/Math.log(10),
                Math.log(600*scaleRatio)/Math.log(10)
            ],
            minorTickLength: 9+extraSize,
            tickLength: 9+extraSize,
            endOnTick: true,
            tickColor: '#666',
            labels: {
                style: {
                    fontSize: (extraSize > 1 ? 16 : 8) + 'px'
                },
                distance: (extraSize > 1 ? -40 : -20)
            },
            type: 'logarithmic',
            title: extraSize > 1 ? { text: 'edits/min' } : null,
            plotBands: [{
                from: 1*scaleRatio, // In log scale, minumum can't be zero
                to: 60*scaleRatio, // 1 (or 10) per second
                color: 'YellowGreen', // Green
                thickness: 9+extraSize
            }, {
                from: 60*scaleRatio,
                to: 300*scaleRatio, // 5 (or 50) per second
                color: 'Gold', // Yellow
                thickness: 9+extraSize
            }, {
                from: 300*scaleRatio,
                to: 600*scaleRatio, // 10 (or 100) per second
                color: 'Salmon', // Red
                thickness: 9+extraSize
            }]
        },
        plotOptions: {
            gauge: {
                dial: {
                    baseWidth: 10+extraSize,
                    topWidth: 1,
                    baseLength: '0%', // location along radius where it starts narrowing
                    rearLength: '0%' // don't project back, start at center
                },
                pivot: {
                    radius: (10+extraSize)/2
                }
            }
        },
        // Only one data series, initialized with the minimum allowed value
        series: [{
            name: 'edits per minute',
            data: [1*scaleRatio],
            dataLabels: {
                backgroundColor: 'white',
                y: -15,
                style: {
                    fontSize: (extraSize > 1 ? 30 : 15) + 'px'
                },
                zIndex: 3
            }
        }],
        credits: {
            enabled: (extraSize != 1), // Only show credits in the large gauge
            position: {
                align: 'center',
                x: 0
            }
        }
    });
}

//############################################################
//                       SET UP EVENT STREAM
//############################################################

var editsFeed = new EventSource('https://stream.wikimedia.org/v2/stream/recentchange');

editsFeed.onopen = () => {
    console.info('Connected to the Wikimedia EventStreams service.');
};

// Process the stream event.
// See the response schema for the /recentchange endpoint at
// https://stream.wikimedia.org/?doc#/streams/get_v2_stream_recentchange
editsFeed.onmessage = (event) => {

    const eventData = JSON.parse(event.data);

    if (eventData.meta?.domain === 'canary') {
        console.log('Discarding canary event');
        return;
    }


    flag[eventData.wiki] = getFirstSubdomain(eventData.server_name)
    la[eventData.wiki] = eventData.title
    user[eventData.wiki] = eventData.user
    

   

    if (editsInLastMinute[eventData.wiki] == undefined) {
        editsInLastMinute[ eventData.wiki ] = [];
    }
     
    if (activeUser[eventData.wiki] == undefined){
        activeUser[eventData.wiki] = new Set();
    }
    activeUser[eventData.wiki].add(eventData.user)
    userDB[eventData.user] = eventData.timestamp
    

   
    if ( editsInLastMinute[ eventData.wiki ] !== undefined )
    {
        editsInLastMinute[ eventData.wiki ].push(eventData.timestamp);
    }
   

    if (lastTenLog[eventData.wiki] == undefined) {
        lastTenLog[ eventData.wiki ] = []
    }


    lastTenLog[eventData.wiki].push(eventData)

    while (lastTenLog[eventData.wiki].length > 10) {
    // Remove the oldest element (the first element)
        lastTenLog[eventData.wiki].shift();
    }



    if ( eventData.server_name.match("wikipedia") && editsInLastMinute[ "global" ] !== undefined )
    {
        editsInLastMinute["global"].push(eventData.timestamp);
        gaugeCharts["global"].subtitle.update({
            text:eventData.wiki+" "+eventData.title
        })
    }


    if (isInfoMode) {
        if (eventData.wiki == currentInfo) {

            /*
            var str = ""
            str = "<b>"+eventData.user +"</b> " +  eventData.type + " " + "<a target='_blank' href='"+eventData.notify_url+"'>" +eventData.title + "</a>"
            console.log(eventData)
            console.log(str)

            let tbody = document.querySelector("#infos");
            var newDiv = document.createElement("div");
            newDiv.innerHTML = str
            //tbody.appendChild(newDiv);
            tbody.insertBefore(newDiv,tbody.firstChild);

            if (tbody.children.length > 10) {
            // While the number of children is greater than 25, remove the last child
            while (tbody.children.length > 10) {
            tbody.removeChild(tbody.lastChild);
            }
            }
            */


        }
    }



};


editsFeed.onerror = (event) => {
    console.error('Encountered error', event);
};


function showInfoz(id){

    if (lastTenLog[id].length == 0){
        return
    }
    var eventData = lastTenLog[id].shift()
    var str = ""
    str = "<b>"+eventData.user +"</b> " +  eventData.type + " " + "<a target='_blank' href='"+eventData.notify_url+"'>" +eventData.title + "</a>"
    if (eventData.type == "log"){
        str = "<b>"+eventData.user +"</b> " +  eventData.log_action + " " + "<a target='_blank' href='"+eventData.title_url+"'>" +eventData.title + "</a>"
    }




    let tbody = document.querySelector("#infos");
    var newDiv = document.createElement("div");
    newDiv.innerHTML = str
    //tbody.appendChild(newDiv);
    tbody.insertBefore(newDiv,tbody.firstChild);

    if (tbody.children.length > 10) {
    // While the number of children is greater than 25, remove the last child
    while (tbody.children.length > 10) {
    tbody.removeChild(tbody.lastChild);
    }
    }

}








//############################################################
//                       SET UP UPDATING ROUTINE
//############################################################

function updateCounters(){
    var now = Date.now() / 1000;
    var elapsed = now - beginTimestamp;

    for(var id in editsInLastMinute)
    {
        var currentCount;
        if( elapsed < counterPeriod)
        {
            // Less than `counterPeriod` seconds passed since we started counting,
            // so we'll extrapolate from the data we've got so far.
            currentCount = Math.round(editsInLastMinute[id].length * counterPeriod / elapsed);
            ex_activeUser[id] =  Math.round(activeUser[id].size * counterPeriod / elapsed);
        }
        else
        {
            //activeUser[id].clear()

            activeUser[id].forEach(value => {
              if (userDB[value] > (now - counterPeriod)){
                activeUser[id].delete(value)
              }
            });

            // Remove old data
            editsInLastMinute[id] = editsInLastMinute[id].filter( function (editTimestamp) {
                return editTimestamp > (now - counterPeriod);
            });
            // Get count of edits in the last `counterPeriod` seconds
            currentCount = editsInLastMinute[id].length;
        }
        if( gaugeCharts[id] != undefined )
        {
            // Each chart has a single series, with a single data point.
            // Note: zero is not allowed, as log(0) is mathematically undefined
            var min = ( id == "global" ) ? 10 : 1;
            gaugeCharts[id].series[0].points[0].update( Math.max(min, currentCount) );
            rr[id] = Math.max(min, currentCount);
        }
        var min = ( id == "global" ) ? 10 : 1;
        rr[id] = Math.max(min, currentCount);

    }
}

// Start the update loop
var loopID = setInterval( updateCounters, 1000);






window.onbeforeunload = function(){
    editsFeed.close();
    clearInterval(loopID);
};


 function sortAndDisplay() {


      // Convert the object to an array of [key, value] pairs and sort by value (descending order)
      let sortedData = Object.entries(rr).sort((a, b) => b[1] - a[1]);

      // Select the table body
      let tbody = document.querySelector("#sortedTable");

      // Clear existing rows
      tbody.innerHTML = "";



      // Populate the table with sorted data
      sortedData.forEach(([key, value]) => {
        nyaa = la[key]
        if (value > 1){
            summon(key)
        }
        else if (key !== "wikidatawiki" && key !== "commonswiki") {

            let row = `<div class='item'><div class='emoji'>${flag[key]} ${key}</div></div>`;
            tbody.innerHTML += row;
        }
        
      });
    }

    sortAndDisplay();


function gaugeUpdater() {

     destroy()      
      sortAndDisplay();
      sortDivs();
}




var loopSubtitle = setInterval(subtitleUpdater, 1000);
var loopGauge = setInterval(gaugeUpdater, 500);
var loopInfoz 

function backToHome(){

    let tbody = document.querySelector("#nya");
    tbody.innerHTML = "";
    loopGauge = setInterval(gaugeUpdater, 500);
    isInfoMode = false;
    currentInfo = ""




 let inp = document.querySelector("#suicchi");
     inp.innerHTML = ""
    
}


function showStat(id){
    //editsFeed.close()
    //clearInterval(loopID)
    //clearInterval(loopSubtitle)
    clearInterval(loopGauge)


    let tbody = document.querySelector("#nya");
    tbody.innerHTML = "";

    summon(id)





    var newDiv = document.createElement("div");
    newDiv.id = "infos";
    tbody.appendChild(newDiv);

    isInfoMode = true;
    currentInfo = id;


     let inp = document.querySelector("#suicchi");
     inp.innerHTML = "Displaying "+currentInfo + ' recent changes | <a href="javascript:void(0)" onclick="backToHome()">back</a>'
}




function subtitleUpdater(){
      var gaugeNodes = document.getElementsByClassName('gauge');


    for(var i=0; i<gaugeNodes.length; i++) {
         nyaa = la[gaugeNodes[i].id]
    if (isUser) {
        nyaa = "<b>[" +ex_activeUser[gaugeNodes[i].id] +"]</b> " + user[gaugeNodes[i].id]
    }
        gaugeCharts[gaugeNodes[i].id].subtitle.update({
        text:nyaa
    })

    }


    if (isInfoMode){
        showInfoz(currentInfo)
    }

}


function sortDivs() {
      try {
        // Get all the divs with class 'sortable-div'
        var divs = document.getElementsByClassName('gauge');

        // Convert NodeList to an array for sorting
        var divArray = Array.from(divs);

        // Sort the array based on the numeric value of the id
        divArray.sort(function(a, b) {
          return parseInt(parseInt(rr[b.id] - rr[a.id]));
        });

        // Get the parent element (in this case, the body)
        var parent = document.getElementById("nya")

        // Re-append the sorted divs to the parent (this will reorder them)
        divArray.forEach(function(div) {
          parent.appendChild(div);
        });

      } catch (error) {
        console.error('An error occurred while sorting divs:', error.message);
      }
    }

document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === '.') {
    console.log('CTRL + . detected');
    // Add your code here to handle the event
    switchh()
  }
});

function switchh(){
    isUser = !isUser
    var a = document.getElementById("suicchi")
    if (isUser){
        a.innerHTML = 'Config : <a href="javascript:void(0)" onclick="switchh()">page</a> | <b>[active users/min] user</b>'
    }
    else {
        a.innerHTML = 'Config : <b>page</b> | <a href="javascript:void(0)" onclick="switchh()">[active users/min] user</a>'
    }
}