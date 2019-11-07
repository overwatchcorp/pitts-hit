// override form submit action so we can capture the data
const form = $('#signup');

form.submit((e) => {
  e.preventDefault();
  const now = new Date().toUTCString();
  d3.select("#date").node().value = now;
  $("#tottime").attr('value', now);
  $("#totbounce").attr('value', $("#bounces").text());
  const formData = form.serializeArray();
  // store trial type in local database
  let tt = sessionStorage.getItem('trialType');
 
  // append white letters cross center line count and responses to array database
  let res = JSON.parse(sessionStorage.getItem('stimData'))
  // if this is the first trial, set the results to an empty arrray
  if (res === null) res = [];
  // the nubmer of times the white letters crossed the middle line
  const actualCrosses = $("#bounces").text();
  // the number of crosses the participant inputted in the form
  const crossesRes = formData.find(r => r.name === 'respInput1').value;
  const trialResults = { trialType: tt, actualCrosses, crossesRes };
  // append trial results to the array
  res.push(trialResults);
  // save to session storage
  sessionStorage.setItem('stimData', JSON.stringify(res));

  if (tt === "blank") {
    sessionStorage.trialType = "firstCross";
    ReloadPage();
  }
  else if (tt === "firstCross") {
    sessionStorage.trialType = "secondCross";
    ReloadPage();
  }
  else if (tt === "secondCross") {
    console.log(res);
    fetch('https://maker.ifttt.com/trigger/pitts_hit/with/key/bkQUNmpBBdm3JpYQniuksI', { 
      method: 'POST', 
      mode: 'cors', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ value1: JSON.stringify(res) })
    }).then((r) => r.text())
      .then(console.log);
  }
  return false;
});

//// Controls overall timing of the window (uses jQuery, make sure you have it) ////
$(window).load(function() {
  var totalTime = $("#totalTime"),
    tarrT = 0,
    delayT = 10;
  setInterval(function() {
    tarrT = tarrT + delayT;
    totalTime.text(tarrT);
  }, delayT);
});

//// Experimental variables ////
var w = 610,
  h = 500,
  n = 8,
  m = 12, //don't know what this does.
  speedMax = 2.7, //2.7,
  speedMin = 1.7, //1.7,
  bounceNum = 0,
  distPathArray = [],
  trialLength = 15, //15
  firstCross = 5, //5
  secondCross = 5; //5
//distractorsColors = d3.scale.category10().domain(d3.range(6));

var bounces = $("#bounces");

// Sets initial starting position and path
var distractors = d3.range(n).map(function() {
  var x = Math.random() * (w - 150) + 50,
    y = Math.random() * (h - 150) + 50,
    myArray = [1, -1];
  return {
    vx:
      (Math.random() * (speedMax - speedMin) + speedMin) *
      myArray[Math.floor(Math.random() * myArray.length)],
    vy:
      (Math.random() * (speedMax - speedMin) + speedMin) *
      myArray[Math.floor(Math.random() * myArray.length)],
    //vx: speedMin,
    //vy: speedMin,

    //vx: speed + Math.random()*1.7, //Randomly vary the speed a bit
    //vy: speed + Math.random()*1.7,

    path: d3.range(m).map(function() {
      return [x, y];
    })
  };
});

//// Draw elements on SVG ////

var svg = d3
  .select("#svgHere")
  .append("svg:svg")
  .attr("width", w)
  .attr("height", h);

// distractors //
var g = svg
  .selectAll("g")
  .data(distractors)
  .enter()
  .append("svg:g");

// var head = g.append("svg:ellipse")
// 	.style("fill",function(d,i) {if (i % 2 == 0){return "black";} else {return "white";}}) //Make half black/white
//     .attr("rx", 15)
//     .attr("ry", 15);

// T's and L's
var head = g
  .append("svg:text")
  .attr("class", "head")
  .style("fill", function(d, i) {
    if (i % 2 == 0) {
      return "black";
    } else {
      return "white";
    }
  }) //Make half black/white
  .text(function(d, i) {
    if (i < n / 2.0) {
      return "T";
    } else {
      return "L";
    }
  }) //Make half black/white
  .style("font-size", "50px")
  .style("font-family", "sans-serif");

// Center Line //
var line = g
  .append("svg:line")
  .attr("id", "line")
  .attr("x1", 0)
  .attr("y1", h / 2)
  .attr("x2", w)
  .attr("y2", h / 2);

// Fixation Box //
var fix = g
  .append("svg:rect")
  .attr("id", "fixation")
  .attr("height", 10)
  .attr("width", 10)
  .attr("x", w / 2)
  .attr("y", h / 2 - 10 / 2);

// Distractor Crosses //
var cross1 = g
  .append("svg:text")
  .attr("class", "cross")
  .text("+")
  .attr("x", w + 50)
  .attr("y", h / 2 + 50 / 4 + 8) //+3 when black and 50px
  .style("font-size", "65px")
  // .style("fill","Black");
  .style("fill", "rgba(0, 0, 0, 0.05)");

var cross2 = g
  .append("svg:text")
  .attr("class", "cross")
  .text("+")
  .attr("x", w + 50)
  .attr("y", h / 2 + 50 / 4 + 8) //+3 when black and 50px
  .style("font-size", "65px")
  // .style("fill","Black");
  .style("fill", "rgba(0, 0, 0, 0.05)");

//// Experiment Functions ////

// Distractor Cross Dynamics //
function startCross1() {
  cross1
    .transition()
    .duration(5000)
    .ease("linear")
    //.attr("x",-50)

    // Use attrTween to return the x values for the targets
    .attrTween("x", function(d, i, a) {
      return function(t) {
        var ip_value = d3.interpolate(a, -50)(t);
        // console.log(ip_value);

        curPos = [0, 0, 0];
        curPos[0] = cross1.text();
        curPos[1] = Math.round(ip_value * 100) / 100;
        curPos[2] = h / 2 + 50 / 4 + 8;
        distPathArray.push("(" + curPos + ")");

        return ip_value;
      };
    });
}

function startCross2() {
  cross1
    .transition()
    .duration(5000)
    .ease("linear")
    //.attr("x",-50)

    // Use attrTween to return the x values for the targets
    .attrTween("x", function(d, i, a) {
      return function(t) {
        var ip_value = d3.interpolate(a, -50)(t);
        // console.log(ip_value);

        curPos = [0, 0, 0];
        curPos[0] = cross1.text();
        curPos[1] = Math.round(ip_value * 100) / 100;
        curPos[2] = h / 2 + 50 / 4 + 8;
        distPathArray.push("(" + curPos + ")");

        return ip_value;
      };
    });
}

// Distractors movement control //
function makeDistractors(curTime) {
  for (var i = -1; ++i < n; ) {
    var distractor = distractors[i],
      path = distractor.path,
      dx = distractor.vx,
      dy = distractor.vy,
      v = Math.sqrt(dx * dx + dy * dy),
      x = (path[0][0] += dx),
      y = (path[0][1] += dy);

    // Bounce off the walls.
    if (x < 0 || x > w - 27) {
      distractor.vx *= -1;
    } //bounces.text(bounceNum+1);bounceNum = bounceNum +1;}
    if (y < 36 || y > h) {
      distractor.vy *= -1;
    } //bounces.text(bounceNum+1);;bounceNum = bounceNum +1;}

    // Count center line passes
    if (i % 2 == 1) {
      //count all white ones, not just T's or L's
      if (curTime < 16000) {
        //if (i < n/2.0){ //turn on for just L's
        if (y < h / 2 + v / 2.8 && y > h / 2 - v / 2.8) {
          bounces.text(bounceNum + 1);
          bounceNum = bounceNum + 1;
        }
      }
    }
    //}

    curPos = [0, 0, 0];
    curPos[0] = i; //white are odd, first 4 are L's
    curPos[1] = Math.round(path[0][0] * 100) / 100;
    curPos[2] = Math.round(path[0][1] * 100) / 100;

    distPathArray.push("(" + curPos + ")");
  }

  // Move the distractors
  head.attr("transform", function(d) {
    return "translate(" + d.path[0] + ")";
  });
}

//// Experiment Timer ////

// Set event times (must be set outside timer)//
var startTime = 1000,
  startStarted = "True",
  event1Time = firstCross * 1000,
  event1started = "False", // Needs to be string because if function returns True, d3.timer stops
  event2Time = secondCross * 1000,
  event2started = "False",
  endEvent = trialLength * 1000,
  endStarted = "False";

// This function will run continuously until it returns true //
d3.timer(function() {
  // Define current time from HTML and make test variable (can be commented out/deleted)
  var curTime = parseFloat($("#totalTime").text()),
    test = $("#test");

  //  trialType = $("#trialType").text();

  // we store the trial type in the session storage so that we can keep track of what trial we are in
  // when the stim code reloads the page
  // using session storage so that the experiment resets when the tab is closed and reopened
  let trialType = sessionStorage.getItem('trialType');
  // if this is the first trial, populate local storage
  if (trialType === null) {
    // first session--no distractor cross in the screen
    // followed by firstCross and then secondCross
    trialType = 'blank';
    sessionStorage.setItem('trialType', 'blank');
  }

  test.text(event2Time);

  // EVENT ONE //
  // When time passes event time, start the event, then mark it as started so it only 'starts' once
  //if (curTime > event1Time && (trialType == 'firstCross' || trialType == 'secondCross')) {
  if (curTime > event1Time && trialType == "firstCross") {
    if (event1started == "False") {
      startCross1();
      event1started = "True";
      test.text("done");
    }
    // Update test variable, can be commented out.
    else {
      test.text(curTime);
    }
  }

  // EVENT TW0 //
  if (curTime > event2Time && trialType == "secondCross") {
    if (event2started == "False") {
      startCross2();
      event2started = "True";
      test.text("done");
      endEvent = event2Time + 4200; //make catch trial end immediately
    } else {
      test.text(curTime);
    }
  }

  // END //
  if (curTime > endEvent) {
    if (endStarted == "False") {
      // Keep Track of the paths of the distractors etc.
      distpath = $("#distpath");
      output = "";
      for (i in distPathArray) {
        output += distPathArray[i] + ";";
      }
      distpath.text(output); // total legnth is 961

      animateArrayOff();
      endStarted = "True"; // Returns a tuple to end the script
    } else {
      test.text(curTime);
    }
  }

  //Primary function to be executed continously (after a brief delay)
  if (curTime > startTime) {
    makeDistractors(curTime);
  }
});

function animateArrayOff() {
  //head.remove(); // Removes the distractors
  //d3.select("svg").transition().delay(1000).remove();
  // d3.select("svg")
  // 	.transition()
  // 	.delay(0)
  // 	.duration(1000)
  // 	.style("background","black"); // changes response prompt to white
  d3.select("svg").remove();
  animatePleaseType();
}

function ReloadPage() {
  location.reload();
}

function animatePleaseType() {
  if (event2started == "True") {
    d3.selectAll("#typeResp")
      .transition()
      .text(
        "Did you notice anything on this last trial that was different from the first three trials of the experiment? [Y/N]"
      )
      .duration(250)
      .style("color", "white"); // changes response prompt to yellow

    d3.selectAll("#respInput")
      .transition()
      .delay(0)
      .duration(250)
      .style("background-color", "#333333")
      .style("color", "red"); // changes response prompt to yellow

    // Automatically focus the cursor on the response field.
    // document.getElementById('respInput').focus();
    d3.select("#respInput")
      .node()
      .focus(); //this is the same function of the one above it, just in d3

    // $(document).ready(function() {
    //   setTimeout("ReloadPage()", 0); //reload page immediately
    //   })
    //
  } else {
    d3.selectAll("#typeResp")
      .transition()
      .duration(250)
      .style("color", "yellow"); // changes response prompt to yellow

    d3.selectAll("#respInput")
      .transition()
      .delay(0)
      .duration(250)
      .style("background-color", "#333333")
      .style("color", "red"); // changes response prompt to yellow

    // Automatically focus the cursor on the response field.
    // document.getElementById('respInput').focus();
    d3.select("#respInput")
      .node()
      .focus(); //this is the same function of the one above it, just in d3
  }
}

function setbg(color) {
  // Sets styling for question box
  d3.select("#styled").style("background", color);
}
