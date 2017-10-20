
var ___stats = {};
var ___WORKERACTIVE = false;
var ___profiler = (function() {
  var avg = 0.01;
  var perf = [];

  function calcAvg() {
    var ta = 0;
    perf.forEach(function(el) {
      ta += el;
      avg = ta/perf.length;
    });

  }

  return {
    add: (sample) => {
      if (perf.length < 5) {
        perf.push(sample);
      } else {
        perf.shift();
        perf.push(sample);
      }
      calcAvg();
    },
    getAvg: () => avg,
    getPerf: () => perf
  }
})();
//var ___dicePageSettings = {}

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

var ___bench = (function() {

  var test = new Big(10);
  var timTmp = new Big(5);
  var minTmp = new Big(317);
  var divTmp = new Big(1039);
  var t1, t2;
  var tmp;

  var results = {};
  var p, m, t, d, eq;
  var u1 = performance.now();
  var pTot = 0;
  var acum = 1;
  var i, u2;
  var totCalc = 0;

  while (pTot < 125) {
    acum = acum * 2;
    for (i = 0; i < acum; i++) {
      //console.log("Loop "+ i);
      //results[i] = {};
      tmp = test.pow(i);

      // test +
      //t1 = performance.now()
      for (p = 0; p < 100; p++) {
        tmp.plus(tmp);
      }
      //t2 = performance.now();
      //results[i]["+"] = t2-t1;
      //console.log("  + done");

      // test *
      //t1 = performance.now()
      for (t = 0; t < 100; t++) {
        tmp.times(timTmp);
      }
      //t2 = performance.now();
      //results[i]["*"] = t2-t1;
      //console.log("  * done");

      // test eq
      //t1 = performance.now()
      for (eq = 0; eq < 50; eq++) {
        //console.log("    L "+ eq);
        tmp = tmp.plus(tmp);
        //console.log("    + done");
        //tmp = tmp.div(divTmp);
        //console.log("    / done");
        tmp = tmp.times(timTmp);
        //console.log("    * done");
        //tmp = tmp.minus(minTmp);
        //console.log("    - done");
      }
    }
    u2 = performance.now();
    pTot += u2-u1;
    totCalc += 300*acum;
  }

  //var u2 = performance.now();

  //console.log(results);
  console.log("Total Run time: " + pTot);
  console.log("Total operations: " + totCalc);

  var mspc = pTot*2/totCalc;
  // the *2 is because the benchmark tests
  // are roughly twice as fast as actual calculation speeds, so
  // the *2 will compensate for that

  console.log("MSPC: " + mspc);
  ___profiler.add(Number.parseFloat(mspc.toFixed(5)));
  return Number.parseFloat(mspc.toFixed(5));
})();

var ___Estimator = (function() {
  var last = 0;

  return({
    "last": last,
    "calc": function(dices) {
      this.last = ___Estimator2(dices);
      return this.last;
    }
  })
})();

function ___Estimator2(dices) {
  if (dices.length == 0) {
    return 0;
  }
  var ops = Big(0);
  var subOps = Big(0);


  var answers = Big(dices[0][0]);
  //var firstDice =
  dices[0][1] = dices[0][1]-1;
  if (dices[0][1] == 0) {
    dices = dices.splice(1);
  }

  //var tmpAns;
  for (var i = 0; i < dices.length; i++) {
    for (var j = 0; j < dices[i][1]; j++) {
      subOps = answers.times(dices[i][0]);
      answers = answers.plus(dices[i][0] - 1);
      //answers = tmpAns;
      ops = ops.plus(subOps);
    }
  }
  //debugger;
  console.log("E2 Estimator: " + ops + " ops");
  return ops;
}

// roll each of the dice a number of times
function rollDice() {
  // get all the visible dice's IDs from the DOM
  var allDices = $("#dices").find("[id]").map(function () {
    return $(this).data("dice_id");
  }).get();

  var diceCount = [];
  // gets the number of times each dice has to be rolled, put them into *diceCount
  for (var i = 0; i < allDices.length; i++) {
    var dVal = parseInt($("#"+allDices[i]+"_count").val()) || 0;
    // no rolling negative number of dice! (yet)
    dVal = dVal < 0 ? 0 : dVal;
    diceCount.push([allDices[i], dVal]);
  }

  var dReturn = [];
  var dVal = [];
  var dSym = [];
  var rollIdx;
  var dId;

  for (var i = 0; i < diceCount.length; i++) {
    if (diceCount[i][1] > 0) {
      dId = diceCount[i][0]
      for (var j = 0; j < diceCount[i][1]; j++) {
        // does the actual roll
        rollIdx = Math.floor(___rngesus() * ___dice.dice[dId].numFaces);
        if(___dice.dice[dId].faces && ___dice.dice[dId].faces.length) {
          dVal.push(___dice.dice[dId].faces[rollIdx]);
        }
        if(___dice.dice[dId].symbols && ___dice.dice[dId].symbols.length) {
          dSym.push(___dice.dice[dId].symbols[rollIdx]);
        }
      }
      dReturn.push({"dId" : dId, "dVal" : dVal.slice(), "dSym" : dSym.slice()} );
    }
    dVal = [];
    dSym = [];
    rollIdx = null;
  }
  //console.log("roll resuls")
  //console.log(dReturn);
  displayRolls(dReturn);

  $(window).scrollTop($("#rollsDiv").offset().top);
}

function displayRolls(diceResult) {
  var diceDiv = $("#diceRollResultDiv");
  // clear previous results
  diceDiv.empty();

  var color, bgCol, dId;
  var dVal, dSym;
  var curDiceSpan, diceColorCss;
  var total = 0;
  var subTot = 0;
  for (var i = 0; i < diceResult.length; i++) {
    subTot = 0;
    dId = diceResult[i].dId;
    bgCol = ___dice.dice[dId].color;
    color = getTextColor(bgCol);
    diceColorCss = {"background-color":bgCol, "color":color }
    for (var j = 0; j < Math.max(diceResult[i].dVal.length, diceResult[i].dSym.length); j++) {
      // debugger;
      // show each number and symbol(s)
      curDiceSpan = $("<span>").addClass("badge dice-roll-result").css(
        diceColorCss
      );
      if(diceResult[i].dVal.length) {
        curDiceSpan.append(
          $("<span>").css(
            {"vertical-align": "middle"}
          ).text(
            diceResult[i].dVal[j]
          )
        );
        subTot += diceResult[i].dVal[j];
        total += diceResult[i].dVal[j];
      }
      if(diceResult[i].dSym.length) {
        //debugger;
        if (diceResult[i].dSym[j]) {
          convertSymbols(diceResult[i].dSym[j]).forEach(function(el) {
            curDiceSpan.append(el);
          });
        }
      }
      diceDiv.append(curDiceSpan);
    }
    diceDiv.append(
      $("<span>").addClass(
        "badge dice-roll-result"
      ).css(
        diceColorCss
      ).append(
        $("<span>").css(
          {"vertical-align": "middle"}
        ).text("Subtotal: " + subTot)
      )
    );
    diceDiv.append($("<br>"));
  }
  var color = calcStatColor(total);
  //debugger;
  diceDiv.append(
    $("<span>").addClass(
      "badge badge-secondary mt-1"
    ).text("Total: " + total).css("color", color)
  );
  $("#clearRollBtn").show();
}

function convertSymbols(syms) {
  // convert list of symbols to displayables, like fontawesome icons
  // *syms has to be comma seperated for now. may try fancy things later
  //debugger;
  var returnSyms = [];

  var symList = syms.split(",").map(function(el) {
    return el.trim();
  });

  // process each symbol
  var curLi, curSym;
  var curSpan;
  var i, j, k;
  var csArr = [];
  var faArr = [];
  for (i = 0; i < symList.length; i++) {
    curLi = symList[i].split(" ");
    curSym = $("<span>");
    curSpan = $("<span>");

    // adds the fa icons/classes
    for (j = 0; j < curLi.length; j++) {
      //debugger;
      if (curLi[j].indexOf("fa-") != 0) {
        // not a font-awesome class or icon (does not begin with 'fa-')
        faArr.forEach(function(el) {
          curSym.addClass(el);
        });
        faArr = [];
        curSym.text(curLi[j]);
        curSpan.append(curSym).css(
          {"vertical-align": "middle"}
        );
        curSym = $("<span>");
      } else if(___dice.settings.symbols.indexOf(curLi[j]) != -1) {
        // is an approved font-awesome icon
        faArr.forEach(function(el) {
          curSym.addClass(el);
        });
        faArr = [];
        curSpan.append(curSym);
        curSym = $("<span>").addClass("fa").addClass(curLi[j]).css(
          {"font-size": "70%", "vertical-align": "middle"}
        );
      } else {
        // is a font-awesome class (begins with 'fa-', not an approved icon)
        faArr.push(curLi[j]);
      }
    }
    //faArr.forEach(function(el) {
      faArr.forEach(function(el) {
        curSym.addClass(el);
      });
      faArr = [];
      curSpan.append(curSym);
    //})

    /*
    curSym.forEach(function(el) {
      if(el.indexOf("fa-") == 0) {
        faArr.push(el);
      } else {
        csArr.push(el);
      }
    });

    csArr = [];
    faArr = [];
    //*/
    returnSyms.push(curSpan);
  }
  //debugger;

  return returnSyms;
}

function resetDice() {
  $("form#dices :input[type='number']").each(function() {
    $(this).val(0);
  });
  clearRolls();
  clearStats();
  $(window).scrollTop($("#tabs").position().top);
}

function clearRolls() {
  $("#diceRollResultDiv").empty();
  $("#clearRollBtn").hide();
}

function clearStats() {
  $("#rangeData").text("No Range");
  $("#meanData").text("No Mean");
  $("#medianData").text("No Median");
  $("#modeData").text("No Mode");
  $("#stdevData").text("No Standard Deviation");
  ___stats.range = [];
  ___stats.mean = 0;

}

function estimateTime() {
  var allDices = $("#dices").find("[id]").map(function () {
    return $(this).data("dice_id");
  }).get();
  var totOps = Big(0);

  //var diceCount = [];
  //var workArr = [];

  var dices = [];
  for (var i = 0; i < allDices.length; i++) {
    var dVal = parseInt($("#"+allDices[i]+"_count").val()) || 0;
    dVal = dVal < 0 ? 0 : dVal;

    if (dVal > 0) {
      dices.push([___dice.dice[allDices[i]].numFaces, dVal])
      //totOps = totOps.plus(___Estimator());
    }
    //diceCount.push([allDices[i], dVal]);
  }
  totOps = ___Estimator.calc(dices);

  //console.log("Estimated Ops: " + totOps);

  var time = Number.parseFloat(totOps.toString()) * ___profiler.getAvg();

  return time;
}

function calculateDiceWrapper() {
  var allDices = $("#dices").find("[id]").map(function () {
    return $(this).data("dice_id");
  }).get();
  var diceCount = [];
  var workArr = [];

  for (var i = 0; i < allDices.length; i++) {
    var dVal = parseInt($("#"+allDices[i]+"_count").val()) || 0;
    dVal = dVal < 0 ? 0 : dVal;
    diceCount.push([allDices[i], dVal]);
  }

  for (i = 0; i < diceCount.length; i++) {
    //totOps += ___Estimator(___dice.dice[diceCount[i][0]].numFaces, diceCount[i][1]);
    for (var j = 0; j < diceCount[i][1]; j++) {
      workArr.push(___dice.dice[diceCount[i][0]].faces.slice());
    }
  }

  var steps = {};
  var finalStep;
  var finalIdx;
  // populating first step:
  if (workArr.length > 0) {
    var step0 = {};
    var tmpArr = workArr.shift();
    var step0Idx = []
    for(i = 0; i < tmpArr.length; i++) {
      if (tmpArr[i] in step0) {
        step0[tmpArr[i]]++;
      } else {
        step0[tmpArr[i]] = 1;
        step0Idx.push(tmpArr[i]);
      }
    }
    step0Idx.forEach( function(el) {
      step0[el] = step0[el];
    });
    finalStep = step0;
    finalIdx = step0Idx;
    steps[0] = {"idx": step0Idx, "val": step0};
  }

  if(typeof(Worker) !== "undefined") {
    if (___WORKERACTIVE != false) {
      ___WORKERACTIVE.terminate();
    }
    ___WORKERACTIVE = new Worker("statWorker.js");
    ___WORKERACTIVE.addEventListener("message", processWorkerResponse);
    //debugger;
    // NEED TO ADD CODE TO CHECK WORKER BUSY STATUS LATER
    ___WORKERACTIVE.postMessage({"cmd": "proc", "workArr": workArr, "steps": steps});
  } else {
      alert("Sorry! No Web Worker support.");
      var coreResults = calculateDiceCore(workArr, steps);
      /*//
        Could potentially add compatibility code here
        but probably not needed, since the browser might not have
        web storage anyways. Or other modern functionality
        for that matter.
      //*/
  }


  //debugger;


}

function processWorkerResponse(e) {
  //debugger;
  var data = e.data;

  //debugger;
  if (data.type == "result") {
    processWorkerResult(data.data);
  } else if (data.type == "prog") {
    processWorkerProgress(data.data);
  }

}

function processWorkerProgress(data) {
  var pData = JSON.parse(data);
  var prog = (pData.count*100/___Estimator.last).toFixed(2);
  $("#statAlertProgress").text(
    prog + "%"
  ).css("width", prog + "%");
}

function processWorkerResult(data) {
  function stepToBig(step) {
    //debugger;
    var retStep = {};
    var stepKeys = Object.keys(step);
    stepKeys.forEach(function (el) {
      retStep[el] = Big(step[el]);
    });
    return retStep;
  }
  var finalStep, finalIdx;
  var pCounter, aCounter;


  var result = JSON.parse(data);
  finalStep = stepToBig(result.finalStep);
  finalIdx = result.finalIdx;


  pCounter = result.pC;
  aCounter = result.aC;

  //console.log("Avg DURATION: " + (avgTime));
  //console.log("benchTime: " + benchTime);
  //console.log("PCounter: " + __pCounter);
  //console.log("ACounter: " + __aCounter);
  console.log("Total Ops: " + (pCounter + aCounter));
  console.log("Total Time: " + result.time);

  workerDone({"finalIdx": finalIdx, "finalStep": finalStep});

}

function workerDone(returnObj) {
  calculateStats(returnObj.finalIdx, returnObj.finalStep);
  $("#warningStatsDiv").empty();
  $("#statWarnTarget").show();
  $(document).scrollTop($("#statWarnTarget").position().top);
}

function calculateStats(finalIdx, finalStep) {
  var range, mean, median, mode;
  var stdev;

  if (finalIdx) {
    range = crange(finalIdx);
    mean = cmean(finalIdx, finalStep);
    median = cmedian(finalIdx, finalStep);
    mode = cmode(finalIdx, finalStep);
    stdev = cstdev(finalIdx, finalStep, mean);
  }

  // console.log(finalStep);
  //console.log("range = " + range);
  //console.log("mean = " + mean);
  //console.log("median = " + median);
  //console.log("mode = " + mode);
  //console.log("std dev = " + stdev);

  if (range && range.length > 1) {
    $("#rangeData").text(range[0] + " - " + range[1]);
    ___stats.range = range;
  } else {
    $("#rangeData").text("No Range");
  }
  if (mean && parseInt(mean.toString())) {
    $("#meanData").text(mean.toString());
    ___stats.mean = mean;
  } else {
    $("#meanData").text("No Mean");
  }
  if (median && median.length > 0) {
    $("#medianData").text(median[0] + " @ " + median[1].times(100).round().toString() + " %");
  } else {
    $("#medianData").text("No Median");
  }
  if (mode && mode.length > 0) {
    var mText = mode[0][0] + " @ " + mode[0][1].times(10000).round().div(100).toString() + " %";

    for (i = 1; i < mode.length; i++) {
      mText += ", " + mode[i][0] + " @ " + mode[i][1].times(10000).round().div(100).toString() + " %";
    }
    $("#modeData").text(mText);
  } else {
    $("#modeData").text("No Mode");
  }

  if (parseInt(stdev)) {
    $("#stdevData").text(stdev);
    ___stats.stdev = stdev;
  } else {
    $("#stdevData").text("No Standard Deviation");
  }
}

function calcStatColor(tot) {
  var crimson = [220, 20, 60]; // below average
  var deepskyblue = [0, 191, 255]; // above average
  var spectrum = [crimson, deepskyblue];
  var white = [255, 255, 255];

  if (___stats.mean == undefined || ___stats.range == undefined) {
    return "white";
  } else {
    var avg = (___stats.range[0] + ___stats.range[1]) / 2;
    var diff = tot - avg;
    var rangeIdx = -1;
    if (diff < 0) {
      // below average
      //diff = -1 * diff;
      rangeIdx = 0;
    } else {
      rangeIdx = 1;
    }

    var bRange = ___stats.range[rangeIdx] - avg;
    var percent = diff/bRange;
    var retColor = white.slice();
    for (var i = 0; i < retColor.length; i++)
    {
      retColor[i] = Math.round(white[i] - (white[i] - spectrum[rangeIdx][i])*percent);
    }

    return "rgb(" + retColor[0] + "," + retColor[1] + "," + retColor[2] + ")";
  }
}

function calculateDice(e) {
  ___stats = {};
  if (typeof(Worker) !== "undefined" && ___WORKERACTIVE != false) {
    ___WORKERACTIVE.terminate();
  }
  var estTime = estimateTime();
  $("#statWarnTarget").show();


  $("#warningStatsDiv").empty();
  if (estTime >= 250 && estTime < 1000) {
    //console.log("Estimated time required: " + estTime);
    // Show "Show stats" to calculate
    $("#statWarnTarget").hide();
    $("#warningStatsDiv").append(
      $("<div>").addClass("alert alert-primary stat-warn stat-warn-ok").attr("id", "statWarnOk").text(
        "Calculate stats"
      )
    );
    return;
  } else if (estTime >= 1000) {
    var eTLo = Math.round(estTime / 2 / 1000);
    var eTHi = Math.round(estTime * 2 / 1000);

    //var

    if(estTime >= 1000 && estTime < 10000) {
      // Show "Show stats (This may take a few seconds...)"
      $("#statWarnTarget").hide();
      $("#warningStatsDiv").append(
        $("<div>").addClass("alert alert-info stat-warn stat-warn-ok").attr("id", "statWarnFast").text(
          "Calculate stats (This may take " + eTLo + " to " + eTHi + " seconds)"
        )
      );
      return;
    } else if (estTime >= 10000 && estTime < 20000) {
      // Show "Show stats (This may take over 10 seconds...)"
      $("#statWarnTarget").hide();
      $("#warningStatsDiv").append(
        $("<div>").addClass("alert alert-warning stat-warn stat-warn-bad").attr(
          {
            "id": "statWarnMedium",
            "data-toggle": "modal",
            "data-target": "#statWarnConfirmAlert"
          }
        ).text(
          "Calculate stats (This may take " + eTLo + " to " + eTHi + " seconds!)"
        )
      );
      return;
    } else if (estTime >= 20000 ) {
      // "Show stats (THIS WILL TAKE A LONG TIME. ESTIMATED: # SECONDS/MINUTES/HOURS...)"
      var longEstTime = Math.round(estTime/1000);
      var longUnit = " seconds";
      if (longEstTime > 120) {
        longEstTime = Math.round(longEstTime/60);
        longUnit = " minutes";

        if (longEstTime > 60) {
          longEstTime = (longEstTime/60).toFixed(1);
          longUnit = " hours";
        }
      }
      eTLo = Math.round(longEstTime / 2);
      eTHi = Math.round(longEstTime * 2);

      $("#statWarnTarget").hide();
      $("#warningStatsDiv").append(
        $("<div>").addClass("alert alert-danger stat-warn stat-warn-bad").attr(
          {
            "id": "statWarnSlow",
            "data-toggle": "modal",
            "data-target": "#statWarnConfirmAlert"
          }
        ).html(
          "Calculate stats (THIS WILL TAKE A LONG TIME!) <br>" +
          "Estimated to take: " + eTLo + " to " + eTHi + longUnit
        )
      );
      //return;
    }
  } else {
    calculateDiceWrapper();
  }
}

function statWarnConfirm() {
  console.log("confirm");
  $("#warningStatsDiv").empty();
  $("#warningStatsDiv").append(
    $("<div>").addClass("alert alert-dark").append(
      $("<div>").addClass("progress").append(
        //$("<i>").addClass("fa fa-spinner fa-spin fa-lg fa-fw")
      //).append("Calculating... ").append(
        $("<div>").prop(
          {"id": "statAlertProgress"}
        ).text("0%").addClass(
          "progress-bar progress-bar-striped progress-bar-animated"
        )
        //$("<div>").
      )
    )
  );
  calculateDiceWrapper();
}

// Long way to calculate Mean
// (Short way is to just add up the individual means)
function cmean(idx, set) {
  var sum = new Big(0);
  var count = new Big(0);

  idx.forEach(function (el) {


    sum = sum.plus(set[el].times(el));// += set[el] * el;
    count = count.plus(set[el]);// += set[el];

  });

  return (sum.div(count).round(2));//(sum/count).toFixed(2);
}

function cmedian(idx, set) {
  var count = new Big(0);
  var median;
  var mid;
  idx.forEach(function (el) {
    count= count.add(set[el]);// += set[el];
  });

  mid = [count.div(2)];
  if (!mid[0].eq(mid[0].round())) {
    BigU = Big();
    BigD = Big();
    BigU.RM = 3;
    BigD.RM = 0;


    mid = [BigD(mid[0]).round(), BigU(mid[0]).round()];
  }

  var counter = new Big(0);
  if (mid.length == 1) {
    for(var i = 0; i < idx.length; i++) {
      el = idx[i]
      if (set[el].plus(counter).gte(mid[0])) {
        median = [el, Big(1).minus(Big(counter).div(count))];
        break;
      }
      counter = counter.plus(set[el]);// += set[el];
    }
  } else {
    var first = false;
    var last = false;
    for(var i = 0; i < idx.length; i++) {
      el = idx[i]
      if (set[el].plus(counter).gte(mid[0]) && first == false) {
        first = [el, counter.div(count)];
      }
      if (set[el].plus(counter).gte(mid[1]) && last == false) {
        last = [el, counter.div(count)];
      }
      if (first != false && last != false) {
        break;
      }
      counter = counter.plus(set[el]);// += set[el];
    }
    median = [(first[0] + last[0])/2, Big(1).minus(first[1].plus(last[1]).div(2))];
  }
  return median;
}

function cmode(idx, set) {
  var count = Big(0);
  var mode = [[0,0]];
  idx.forEach(function (el) {
    count = count.plus(set[el]);
    if (set[el].gt(mode[0][1])) {
      mode = [[el, set[el]]];
    } else if (set[el].eq(mode[0][1])) {
      //debugger;
      mode.push([el, set[el]]);
    }
  });
  for(var i = 0; i < mode.length; i++) {
    mode[i][1] = mode[i][1].div(count);
  }

  return mode;
}

function cstdev(idx, set, avg) {
  if (avg == undefined) {
    avg = cmean(idx, set);
  }
  var stdAvgSum = new Big(0);
  var count = new Big(0);
  idx.forEach(function (el) {
    count = count.plus(set[el]);
    try {
      stdAvgSum = stdAvgSum.plus(Big(el - avg).pow(2).times(set[el]));
    } catch(err) {
      debugger;
    }

  });
  var v = new Big(0);
  if (count.gt(1)) {
    v = stdAvgSum.div(count.minus(1));
  }
  if (v.lt(0)) {
    debugger;
  }
  return v.sqrt().toFixed(2);
}

function crange(idx) {
  if (idx.length > 0) {
    var rngArr = idx.slice();
    rngArr.sort(function(a, b) {
      return a-b;
    });

    return [rngArr[0], rngArr[rngArr.length-1]];
  }
}

function display(value) {
  // TEST FUNCTION
  $("#display").text(value);
}

function toggleStats() {
  $("#statTable").toggle();
  if($("#statTable").is(":visible")) {
    $("#statsToggleBtn").text("Hide Stats");
  } else {
    $("#statsToggleBtn").text("Show Stats");
  }
}

function processAddDiceMenu(e) {
  if (e.target.className == "dropdown-item") {
    //debugger;
    var dType = $(e.target).data().dicetype;
    var dSides = dType.replace( /[^\d.]/g, '' );
    dSides = parseInt(dSides, 10);

    var dId = dType + (new Date()).valueOf() + Math.random();
    dId = dType + "_" + dId.hashCode();
    while (dId in ___dice.dice) {
      dId = dType + "_" + (dId + Math.random()).hashCode();
    }
    //console.log(dName);
    // ADD DICE VALUES TO GLOBAL NS
    addDiceToNS(dId, dType, dSides);

    // ADD DICE TO POOL LIST
    var dEntry = createDicePoolEntry(dId);

    addDiceEntryToGroup(dEntry);
    checkGroupVisibility("UserAdded"); //// THIS LINE IS HAXTASTIC. NEED BETTER WAY TO DO THIS
    //$("#dicePool").append(dEntry);
    storeLS();

    // ADD DICE TO DICECOUNT TAB
    addUseDiceFromPool(dId);

    // SCROLL EDIT PANE TO SHOW NEW DICE
    $("#diceEditScroll").scrollTop($("#"+dId).offset().top)
  }
}

function processAddGroupMenu(e) {
  // ***** diceTmpl should eventually come from XMLHttpRequest *****
  if (e.target.className == "dropdown-item") {
    var gType = $(e.target).data().dicegrp;
    if (!(gType in diceTmpl.groups))
      return;
    if(___dice.diceGroups[gType] == undefined) {
      ___dice.diceGroups[gType] = diceTmpl.groups[gType];

    } else if(___dice.diceGroups[gType].members != diceTmpl.groups[gType].members) {
      debugger;
      diceTmpl.groups[gType].members.forEach(function (dId) {
        if(___dice.diceGroups[gType].members.indexOf(dId) == -1) {
          ___dice.diceGroups[gType].members.push(dId);
        }
      });
    }

    ___dice.diceGroups[gType].members.forEach(function (dId) {
      if(!(dId in ___dice.dice)) {
        if(!(dId in diceTmpl.dice)) {
          // so far only used for adding the default dnd dice set
          var dType = dId.match(/.*[^\D]/)[0];
          var dSides = dType.replace( /[^\d.]/g, '' );
          dSides = parseInt(dSides, 10);
          addDiceToNS(dId, dType, dSides);
        } else {
          ___dice.dice[dId] = diceTmpl.dice[dId];
        }
        var dEntry = createDicePoolEntry(dId);
        addDiceEntryToGroup(dEntry, gType);
        // ADD DICE TO DICECOUNT TAB
        addUseDiceFromPool(dId);
      }
    });
    checkGroupVisibility(gType);
    //$("#dicePool").append(dEntry);
    storeLS();

  }
}

function addDiceEntryToGroup(dEntry, dgId) {
  if(dgId == null || dgId == undefined) {
    dgId = "UserAdded";
  }
  var dId = dEntry.attr("id");
  if(___dice.diceGroups[dgId].members.indexOf(dId) == -1) {
    ___dice.diceGroups[dgId].members.push(dId);
  }


  var grpCard = $("#"+dgId);
  if (grpCard.length == 0) {
    grpCard = createDiceGroupCard(dgId);
  }
  grpCard.find(".card-body").append(dEntry);

  $("#dicePool").append(grpCard);
}

function addDiceToNS(dId, dLabel, dSides) {
  var range = Array.apply(null, new Array(dSides)).map((_,i) => i+1);
  var syms = new Array(dSides).fill(null);
  ___dice.dice[dId] = {
    "label" : dLabel,
    "numFaces" : dSides,
    "faces" : range,
    "symbols" : syms,
    "color" : "white",
    "visible" : true,
    "group" : ""
  };
  //___dice.diceGroups.UserAdded.members.push(dId);

}

function createDiceGroupCard(gId) {
  var label = ___dice.diceGroups[gId].label;

  var cDiv = $("<div>").addClass("card mb-2").attr("id", gId);
  var chDiv = $("<div>").addClass("card-header");
  var cbDiv = $("<div>").addClass("card-body dice_pool_entry-card-body");
  var cardBGC = $("body").css("background-color");
  chDiv.append(
    $("<div>").addClass("d-flex").append(
      $("<h6>").addClass("-card-title").text(label).css(
        "color", getTextColor(cardBGC)
      )
    ).append(
      $("<i>").addClass("-l-marg-auto card-fa-eyes fa fa-eye")
    )
  );
  cDiv.append(chDiv);
  cDiv.append(cbDiv);

  return cDiv;
}

function createDicePoolEntry(dId) {
  var label = ___dice.dice[dId].label;
  var sides = ___dice.dice[dId].faces;
  var color = ___dice.dice[dId].color;

  var dPDiv = $("<div>").addClass("input-group dice_pool_entry").attr("id", dId);
  var dL = $("<span>").addClass("input-group-addon -flex1 dice_pool_entry_label").text(label).css(
    {"color": getTextColor(color), "background-color": color }
  );

  //var fACbIcon = ___dice[id].visible ? "fa-check-square-o" : "fa-square-o";
  var fACbIcon = ___dice.dice[dId].visible ? "fa-eye" : "fa-eye-slash";

  ////dFACb = dice Font Awesome Check box
  ////was originally checkbox, but is now eye and eye-slash
  var dFACb = $("<span>").addClass("input-group-addon dice_pool_use").append(
    $("<i>").addClass("fa fa-fw -dVisI " + fACbIcon)
  );

  var dBtnGrp = $("<div>").addClass("btn-group").append(
    $("<button>").addClass("btn btn-secondary dropdown-toggle dice_pool_edit_btn_grp").attr(
      {
        "type": "button", "href":"#", "roll":"button", "data-toggle": "dropdown"
      }
    ).append(
      $("<i>").addClass("fa fa-bars")
    )
  ).append(
    $("<div>").addClass("dropdown-menu").append(
      $("<a>").addClass("dropdown-item dice_pool_edit_btn").attr(
        {"href":"#", "data-toggle":"modal", "data-target":"#diceEditModal"}
      ).append(
        $("<i>").addClass("fa fa-pencil fa-lg")
      )
    ).append(
      $("<div>").addClass("dropdown-divider")
    ).append(
      $("<a>").addClass("dropdown-item dice_pool_del_btn").attr(
        {"href":"#"}
      ).append(
        $("<i>").addClass("fa fa-trash-o fa-lg")
      )
    )
  );

  var dEB = $("<span>").addClass("input-group-btn").append(
    $("<button>").addClass("btn btn-secondary dice_pool_edit_btn").attr(
      {"type": "button", "data-toggle":"modal", "data-target":"#diceEditModal"}
    ).append(
      $("<i>").addClass("fa fa-pencil")
    )
  );
  var dDB = $("<span>").addClass("input-group-btn").append(
    $("<button>").addClass("btn btn-secondary dice_pool_del_btn").attr("type", "button").append(
      $("<i>").addClass("fa fa-trash-o")
    )
  );

  dPDiv.append(dFACb, dL, dBtnGrp);

  return dPDiv;
}

function checkGroupVisibility(gId) {
  var gTarget, gEye;

  gTarget = $("#"+gId);

  gEye = $(gTarget).find(".card-fa-eyes");

  var tVis = 0;
  ___dice.diceGroups[gId].members.forEach(function (el) {
    if(___dice.dice[el].visible) {
      tVis++;
    }
  });

  //debugger;
  if (tVis == 0) {
    gEye.removeClass("fa-eye -fa-faded");
    gEye.addClass("fa-eye-slash");
    gTarget.css("order", "99")
  } else {
    gEye.removeClass("fa-eye-slash");
    gEye.addClass("fa-eye");
    if (tVis != ___dice.diceGroups[gId].members.length) {
      gEye.addClass("-fa-faded");
    } else {
      gEye.removeClass("-fa-faded");
    }
    gTarget.css("order", "");
  }
}

function toggleGroupVisibility(e) {
  var gTarget = e.target.closest("div.card");
  var gId = gTarget.id;
  var gEye = $(gTarget).find(".card-fa-eyes");

  if (gEye.hasClass("fa-eye")) {
    // if visible or partially visible, make all invisible
    ___dice.diceGroups[gId].members.forEach(function (dId) {
      if(___dice.dice[dId].visible) {
        $("#"+dId).find("i.-dVisI").toggleClass("fa-eye fa-eye-slash");
        ___dice.dice[dId].visible = false;
        delUseDiceFromPool(dId);
      }
    });
  } else {
    // if not visible, make all visible
    ___dice.diceGroups[gId].members.forEach(function (dId) {
      if(!___dice.dice[dId].visible) {
        $("#"+dId).find("i.-dVisI").toggleClass("fa-eye fa-eye-slash");
        ___dice.dice[dId].visible = true;
        addUseDiceFromPool(dId);
      }
    });
  }
  storeLS();
  checkGroupVisibility(gId);
}

function toggleUseDiceFromPool(e) {
  //debugger;
  var togTarget = e.target.closest("div.dice_pool_entry");
  var dId = togTarget.id;
  //debugger;
  var gId = e.target.closest("div.card").id;

  ___dice.dice[dId].visible = !___dice.dice[dId].visible;
  var targ;
  if ($(e.target).is("span")) {
    targ = $(e.target).find("i.-dVisI");
  } else {
    targ = $(e.target);
  }

  //targ.toggleClass("fa-check-square-o fa-square-o");
  targ.toggleClass("fa-eye fa-eye-slash");


  //___dice[dId].visible = e.target.checked;
  if (___dice.dice[dId].visible) {
    // after clicking checkbox, checkbox is checked
    addUseDiceFromPool(dId);
  }
  else {
    // after clicking checkbox, checkbox is unchecked
    delUseDiceFromPool(dId);
  }
  checkGroupVisibility(gId);
  //___dice[dId].visible = e.target.checked;
  storeLS();
}

function addUseDiceFromPool(dId) {
  if(!___dice.dice[dId].visible) {
    return;
  }
//debugger;
  var newUseDice = $("<div>").addClass("input-group mb-1 -minh35 col-10 -lr-marg-auto").append(

    $("<span>").addClass("input-group-addon dice_count_label").text(___dice.dice[dId].label).css(
      {"color": getTextColor(___dice.dice[dId].color), "background-color":___dice.dice[dId].color }
    )
  ).append(
    $("<input>").addClass("form-control").attr(
      {id: dId+"_count", "data-dice_id":dId, type:"number", min:"0", placeholder:"0"}
    )
  );
  $("#dices").append(newUseDice);
}

function delUseDiceFromPool(dId) {
  $("#" + dId + "_count").closest("div").remove();
}


function deleteDicePoolEntry(e) {
  //debugger;
  var delTarget = e.target.closest("div.dice_pool_entry");
  var dId = delTarget.id;
  var delGrp = e.target.closest("div.card");
  var gId = delGrp.id;

  // REMOVE FROM DICECOUNT TAB
  delUseDiceFromPool(dId);

  // DELETE FROM DICEEDIT TAB
  $(delTarget).remove();

  // DELETE GLOBAL NS ENTRY
  delete ___dice.dice[dId];
  ___dice.diceGroups[gId].members.splice(
    ___dice.diceGroups[gId].members.indexOf(dId), 1
  );
  checkGroupVisibility(gId);
  //___dice.diceGroups["UserAdded"].members.indexOf("d12_852458317")
  storeLS();
}

function editDicePoolEntry(e) {
  var dieTarget = e.target.closest("div.dice_pool_entry");
  var dieId = dieTarget.id;

  //$("#diceEditTitle").text(___dice[dieId].label);
  $("#diceEditHeader").append(
    $("<div>").addClass("container col-12").append(
      $("<div>").addClass("row").append(
        $("<div>").addClass("col-4").append(
          $("<h5>").addClass("modal-title").text("Name: ")
        )
      ).append(
        $("<div>").addClass("col-8").append(
          $("<input>").attr(
            {"id":"modalDiceEditLabel", "data-dice_id":dieId, "type":"text"}
          ).addClass("form-control").val(___dice.dice[dieId].label).css(
            {"color": getTextColor(___dice.dice[dieId].color), "background-color":___dice.dice[dieId].color }
          )
        )
      )
    ).append(
      $("<div>").addClass("row").append(
        $("<div>").addClass("col-4").append(
          $("<h6>").text("Color: ")
        )
      ).append(
        $("<div>").addClass("col-3").append(
          $("<span>").addClass("input-group-btn").attr("id", "basic-addon1").append(
            $("<input>").addClass("pick_color").attr({"type": "text" , "data-dice_id": dieId})
          )
          //<span class="input-group-btn" id="basic-addon1">
            //<input type='text' class='my_color'/>
          //</span>
        )
      )
    )

  );

  $(".pick_color").spectrum({
    preferredFormat: "name",
		showPalette:true,
    color: ___dice.dice[dieId].color,
    hideAfterPaletteSelect:true,
  });

  var numFaces = ___dice.dice[dieId].numFaces;
  var diceFaces = ___dice.dice[dieId].faces ? ___dice.dice[dieId].faces : new Array(numFaces).fill(0);
  var diceSyms = ___dice.dice[dieId].symbols ? ___dice.dice[dieId].symbols : new Array(numFaces).fill(null);

  var modalTableDiv = $("<div>").addClass("table-responsive").attr(
    {"id": "modalTableDiv", "data-dice_id":dieId}
  );
  var modalTable = $("<table>").addClass("table table-responsive table-striped").attr("id", "modalTable").append(
    $("<thead>").append(
      $("<tr>").append(
        $("<th>").text("Face")
      ).append(
        $("<th>").text("Value")
      ).append(
        $("<th>").text("Symbol")
      )
    )
  );
  var tBody = $("<tbody>");

  for (var i = 0; i < numFaces; i++) {
    tBody.append(
      $("<tr>").append(
        $("<td>").text(i+1)
      ).append(
        $("<td>").append(
          $("<input>").addClass("modal-table-val-entry -edit-dice-val").attr({"data-didx": i, "type": "number" }).val(diceFaces[i])
        )
      ).append(
        $("<td>").append(
          $("<input>").addClass("modal-table-sym-entry").attr("data-didx", i).val(diceSyms[i])
        )
      )
    );
  }

  var modalDoneBtn = $("<div>").addClass("d-flex -flex1 -flexd-rr").append(
    $("<button>").addClass("btn btn-primary").attr({"data-dismiss": "modal", "type": "button"}).text("Done")
  );

  modalTableDiv.append(modalTable.append(tBody)).append(modalDoneBtn);
  //modalTableDiv.append(modalDoneBtn);
  $("#diceEditBody").append(modalTableDiv);
}

var ___lastSTop = 0;

function hideTabOnScroll(e) {


  var el = $(e.currentTarget);
  var tabsTop = $("#tabs").offset().top;

  var st = el.scrollTop(); // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
  if (st > ___lastSTop){
    if($("#dices").outerHeight(true) < $("#diceCountScroll").height()) {
      return;
    }
    // downscroll code
    if($(window).scrollTop() + $(window).height() < $(document).height()) {

    }

    if (st < el.outerHeight(true)) {
      $("#diceCountScroll").css({"overflow-y" : "hidden"});
      $("#diceGrowDiv").height("calc(100% + " + st + "px)");
      $(document.body).scrollTop(st);
      //$("#diceCountScroll").scrollTop(___lastSTop);
      e.preventDefault();
      e.stopPropagation();
      $("#diceCountScroll").css({"overflow-y" : "auto"});
      return false;

    }




  } else {
    // upscroll code
  }
  ___lastSTop = st;

/*
  if (el.scrollTop() > 5) {
    if($(window).scrollTop() + $(window).height() < $(document).height()) {
      if($(document).scrollTop() < tabsTop) {
        $(document.body).animate( {'scrollTop' : tabsTop}, 100);

      }
    }
  }
  */
}

function modalHide() {
  $("#diceEditHeader").empty();
  $("#diceEditBody").empty();
  storeLS();
}

function modalLabelChange(e) {
  var dId = $("#modalDiceEditLabel").data("dice_id");
  var newDiceLabel = $("#modalDiceEditLabel").val();
  ___dice.dice[dId].label = newDiceLabel;

  if ($("#" + dId + "_count" ).length) {
    $("#" + dId + "_count" ).prevAll("span").text(newDiceLabel);
  }
  $("#" + dId + " .dice_pool_entry_label").text(newDiceLabel)
}

function modalValSymChange(e) {
  //debugger;
  var dIdx = $(e.target).data("didx");
  var dVal = $(e.target).closest("[data-dice_id]").data("dice_id");

  var targClass = $(e.target).attr("class");

  if(targClass.indexOf("sym") > -1) {
    ___dice.dice[dVal].symbols[dIdx] = $(e.target).val();
  } else if (targClass.indexOf("val") > -1) {
    ___dice.dice[dVal].faces[dIdx] = parseInt($(e.target).val());
  }
}

function modalSymbolChange(e) {
  //debugger;
  var dIdx = $(e.target).data("didx");
  var dVal = $(e.target).closest("[data-dice_id]").data("dice_id");

  ___dice.dice[dVal].symbols[dIdx] = parseInt($(e.target).val());
}

function getTextColor(bgc) {
  var colorTest = document.createElement("div");
  colorTest.style.color = bgc;
  document.body.appendChild(colorTest);
  var rgbStr = window.getComputedStyle(colorTest).color;
  document.body.removeChild(colorTest);

  var rgb = parsergbStr(rgbStr);
  //debugger;
  for( var i = 0; i < 3; i++) {
    rgb[i] = rgb[i] / 255.0;
    if (rgb[i] <= 0.03928) {
      rgb[i] = rgb[i]/12.92;
    } else {
      rgb[i] = Math.pow(((rgb[i] + 0.055)/1.055), 2.4);
    }
  }

  var L = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  if (L > 0.179) {
    return "#000000";
  } else {
    return "#ffffff";
  }
}

function parsergbStr(rgbStr) {
  var rgbArr = [];
  var numberStr = rgbStr.substr(rgbStr.indexOf("(")+1, rgbStr.length-1);
  var rgbStrArr = numberStr.split(",");
  rgbStrArr.forEach(function(el) {
    rgbArr.push(parseInt(el));
  });
  return rgbArr;
}

function updateColors(e) {
  var dId = $(e.target).data("dice_id");
  ___dice.dice[dId].color = $(e.target).spectrum("get").toString();
  //debugger;
  var cssObj = {"color": getTextColor(___dice.dice[dId].color), "background-color":___dice.dice[dId].color };
  $("#modalDiceEditLabel").css(cssObj);
  $("#"+dId + " .dice_pool_entry_label").css(cssObj);
  $("#"+dId + "_count").prevAll("span").css(cssObj);
}

function storeLS() {
  localStorage.userDice = JSON.stringify(___dice);
}

function restoreLS() {
  // compatibility check
  function compatCheck(tmp) {
    if (!tmp.meta || !tmp.meta.version || tmp.meta.version < ___dice.meta.version) {
      return false;
    }
    /*if (!tmp.d6_DarkSouls_black || !tmp.d6_DarkSouls_black.symbols) {
      return false;
    }
    if (!tmp.d6_DarkSouls_black || tmp.d6_DarkSouls_black.visible == undefined) {
      return false;
    }//*/

    return true;
  }
  var dice = JSON.parse(localStorage.userDice);
  if (compatCheck(dice)) {
    ___dice = JSON.parse(localStorage.userDice);

  }
}

function initializeRandom() {
  ___rngesus = new Math.seedrandom();

}

function initializeSymbols() {
  ___dice.settings.symbols = ["fa-sun-o", "fa-diamond", "fa-cog", "fa-gear"];
}

function initializeDice() {
  var diceKeys = Object.keys(___dice.dice);
  var groupKeys = Object.keys(___dice.diceGroups);
  var gCard, gCBody;

  groupKeys.forEach(function(gId) {
    if(___dice.diceGroups[gId].members.length > 0) {
      gCard = createDiceGroupCard(gId);

      $("#dicePool").append(gCard);

      ___dice.diceGroups[gId].members.forEach(function(dId) {
        gCBody = $("#" + gId + " .card-body");
        gCBody.append(createDicePoolEntry(dId));
        addUseDiceFromPool(dId);

      });
      checkGroupVisibility(gId);
    }
  });
}

function init() {

  // needs code for version compatibility check later
  if(localStorage.userDice) {
    restoreLS();
  } else {
    storeLS();
  }

  initializeRandom();
  initializeSymbols();
  initializeDice();

  $("#dices").change(calculateDice);
  $("#rollDiceBtn").click(rollDice);
  $("#resetDiceBtn").click(resetDice);
  $("#statsToggleBtn").click(toggleStats);
  /*$("#diceEdit").click(function(e) {
    //debugger;
    console.log(e);
  }); //*/
  $("#btnDicePoolAddMenu").click(processAddDiceMenu);
  $("#btnDiceGroupAddMenu").click(processAddGroupMenu);

  $("#dicePool").on("click", ".dice_pool_del_btn", deleteDicePoolEntry);
  $("#dicePool").on("click", ".dice_pool_use", toggleUseDiceFromPool);
  $("#dicePool").on("click", ".dice_pool_edit_btn", editDicePoolEntry);
  $("#dicePool").on("click", ".card-fa-eyes", toggleGroupVisibility);


  $("#diceEditModal").on("hidden.bs.modal", modalHide);
  $("#diceEditModal").on("change", "#modalDiceEditLabel", modalLabelChange);
  $("#diceEditModal").on("change", ".modal-table-val-entry", modalValSymChange);
  $("#diceEditModal").on("change", ".modal-table-sym-entry", modalValSymChange);
  $("#diceEditModal").on("change", ".pick_color", updateColors);

  $("#warningStatsDiv").on("click", ".stat-warn-ok", statWarnConfirm);
  $("#statWarnModalBody").on("click", "#statWarnModalYesBtn", statWarnConfirm);
  $("#clearRollBtn").click(clearRolls);


  if($("#statTable").is(":visible")) {
    $("#statsToggleBtn").text("Hide Stats");
  } else {
    $("#statsToggleBtn").text("Show Stats");
  }

}


//window.addEventListener("DOMContentLoaded", init);
$(init);
