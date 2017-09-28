var ___dice = {"dice" : {}, "settings" : {}, "meta" : {}};
var ___stats = {};
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

function ___Estimator(dFace, rolls) {
  if (rolls <= 0) {
    console.log("Rolls: " + rolls);
    debugger;
    return Big(0);
  }
  var bF = Big(dFace);
  var bR = Big(rolls);

  // (0.5d^2 - 0.5d)x^2 - (0.5d^2 - 1.5d)x - d
  var ans = bF.pow(2).times(0.5).minus(bF.times(0.5)).times(bR.pow(2)).minus(
    bF.pow(2).times(0.5).minus(bF.times(1.5)).times(bR)
  ).minus(bF);

  console.log("For " + rolls + " d" + dFace + ": " + ans.toString() + " ops");

  return ans;
}

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
  diceDiv.append($("<span>").addClass("badge badge-secondary mt-1").text("Total: " + total));
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
  totOps = ___Estimator2(dices);

  //console.log("Estimated Ops: " + totOps);

  var time = Number.parseFloat(totOps.toString()) * ___profiler.getAvg();

  return time;
}

function calculateDiceRaw(bench) {
  //console.log("started");
  //debugger;

  //;
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

  //var totOps = 0;

  //for (i = 0; i < diceCount.length; i++) {}


  for (i = 0; i < diceCount.length; i++) {
    //totOps += ___Estimator(___dice.dice[diceCount[i][0]].numFaces, diceCount[i][1]);
    for (var j = 0; j < diceCount[i][1]; j++) {
      workArr.push(___dice.dice[diceCount[i][0]].faces.slice());
    }
  }



  //var rollResult = rollDice(diceCount);

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
      step0[el] = Big(step0[el]);
    });
    finalStep = step0;
    finalIdx = step0Idx;
    steps[0] = {"idx": step0Idx, "val": step0};
  }

  //debugger;
  var __stepsOriginal = JSON.parse(JSON.stringify(steps));
  var stepx;
  var stepxArr;
  var stepxIdx;
  var si;
  var sIdxi;
  var tmpStpVal;

  var __t1, __t2, __pCounter, __aCounter;
  var benchTime, benchIdx;

  if (Number.isInteger(bench)) {
    benchIdx = bench;
  } else {
    benchIdx = 1;
  }
  benchTime = 0;
  for (var bi = 0; bi < benchIdx; bi++) {
    __t1 = performance.now();
    __pCounter = 0;
    __aCounter = 0;
    for (i = 0; i < workArr.length; i++ ) {
      stepx = {};
      stepxArr = workArr[i];
      stepxIdx = [];

      prevStep = steps[i];

      for (si = 0; si < stepxArr.length; si++) {
        for (sIdxi = 0; sIdxi < prevStep.idx.length; sIdxi++) {
          tmpStpVal = stepxArr[si] + prevStep.idx[sIdxi];
          if (tmpStpVal in stepx) {
            stepx[tmpStpVal] = stepx[tmpStpVal].plus(prevStep.val[prevStep.idx[sIdxi]]);
            __pCounter++;
          } else {
            stepx[tmpStpVal] = new Big(prevStep.val[prevStep.idx[sIdxi]]);
            __aCounter++;
            stepxIdx.push(tmpStpVal);
          }
        }
      }

      steps[i+1] = {"idx": stepxIdx, "val": stepx}

      if (i == workArr.length-1) {
        finalStep = stepx;  // Array of Big() numbers
        finalIdx = stepxIdx;
      }
    }
    __t2 = performance.now();
    //if (bench) {
    benchTime += __t2-__t1;
    steps = JSON.parse(JSON.stringify(__stepsOriginal));
    //}

  }

  var avgTime = (benchTime/benchIdx);

  //console.log("Avg DURATION: " + (avgTime));
  //console.log("benchTime: " + benchTime);
  //console.log("PCounter: " + __pCounter);
  //console.log("ACounter: " + __aCounter);
  console.log("Total Ops: " + (__pCounter + __aCounter));

  if(benchTime > 25) {
    var mspc = benchTime / (__pCounter+__aCounter);
    ___profiler.add(Number.parseFloat(mspc.toFixed(5)));
  }

  if (!bench) {
    return {"finalIdx": finalIdx, "finalStep": finalStep};
  } else {
    return avgTime;
  }
}

function calculateStats(finalIdx, finalStep) {

  ___stats = {}
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
  //$("#rangeData").text(range ? range[0] + " - " + range[1] : "No Range");

  if (mean && parseInt(mean.toString())) {
    $("#meanData").text(mean.toString());
    ___stats.mean = mean;
  } else {
    $("#meanData").text("No Mean");
  }
  //$("#meanData").text(mean ? mean : "No Mean");

  if (median && median.length > 0) {
    $("#medianData").text(median[0] + " @ " + median[1].times(100).round().toString() + " %");
  } else {
    $("#medianData").text("No Median");
  }
  /*$("#medianData").text(median ?
                            (median.length > 0) ? median[0] + " @ " + Math.round(median[1] * 100) + " %" : "No Median"
                          : "No Median");
  //*/
  if (mode && mode.length > 0) {
    var mText = mode[0][0] + " @ " + mode[0][1].times(10000).round().div(100).toString() + " %";

    for (i = 1; i < mode.length; i++) {
      mText += ", " + mode[i][0] + " @ " + mode[i][1].times(10000).round().div(100).toString() + " %";
    }
    $("#modeData").text(mText);
  } else {
    $("#modeData").text("No Mode");
  }
  /*$("#modeData").text( (function() {
    if (mode && mode.length > 0) {
      var mText = mode[0][0] + " @ " + Math.round(mode[0][1] * 10000)/100 + " %";

      for (var i = 1; i < mode.length; i++) {
        mText += ", " + mode[i][0] + " @ " + Math.round(mode[i][1] * 10000)/100 + " %";
      }
      return mText;
    }
    return "No Mode";
  })() );
  //*/
  if (parseInt(stdev)) {
    $("#stdevData").text(stdev);
    ___stats.stdev = stdev;
  } else {
    $("#stdevData").text("No Standard Deviation");
  }
  //$("#stdevData").text(stdev ? stdev : "No Standard Deviation");
  //$('#statTable').DataTable();
  //debugger;
}

function calculateDice(e) {
  var estTime = estimateTime();

  $("#warningStatsDiv").empty();
  if (estTime >= 250 && estTime < 1000) {
    //console.log("Estimated time required: " + estTime);
    // Show "Show stats" to calculate
    $("#statWarnTarget").hide();
    $("#warningStatsDiv").append(
      $("<div>").addClass("alert alert-primary stat-warn stat-warn-ok").attr("id", "statWarnOk").text(
        "Show stats"
      )
    );
    return;
  } else if (estTime >= 1000 && estTime < 10000) {
    // Show "Show stats (This may take a few seconds...)"
    $("#statWarnTarget").hide();
    $("#warningStatsDiv").append(
      $("<div>").addClass("alert alert-info stat-warn stat-warn-ok").attr("id", "statWarnFast").text(
        "Show stats (This may take a few seconds)"
      )
    );
    return;
  } else if (estTime >= 10000 && estTime < 20000) {
    // Show "Show stats (This may take over 10 seconds...)"
    $("#statWarnTarget").hide();
    $("#warningStatsDiv").append(
      $("<div>").addClass("alert alert-warning stat-warn stat-warn-bad").attr("id", "statWarnMedium").text(
        "Show stats (This may take over 10 seconds!)"
      )
    );
    return;
  } else if (estTime >= 20000 ) {
    // "Show stats (THIS WILL TAKE A LONG TIME. ESTIMATED: # SECONDS/MINUTES/HOURS...)"
    var longEstTime = parseInt(estTime/1000);
    var longUnit = " seconds";
    if (longEstTime > 120) {
      longEstTime = parseInt(longEstTime/60);
      longUnit = " minutes";

      if (longEstTime > 60) {
        longEstTime = longEstTime/60;
        longUnit = " hours";
      }
    }
    $("#statWarnTarget").hide();
    $("#warningStatsDiv").append(
      $("<div>").addClass("alert alert-danger stat-warn stat-warn-bad").attr("id", "statWarnSlow").text(
        "Show stats (THIS WILL TAKE A LONG TIME!) \n Estimated to take: " + longEstTime + longUnit
      )
    );
    return;
  }


<<<<<<< HEAD
  console.log("Estimated time required: " + estTime);

  actuallyCalculateDice();

}

function actuallyCalculateDice() {
=======
  //console.log("Estimated time required: " + estTime);
>>>>>>> 8916dc190d2d70804b7d3c0ba180ecf37587e2f2
  var diceStatsRaw = calculateDiceRaw();

  calculateStats(diceStatsRaw.finalIdx, diceStatsRaw.finalStep);
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
    var dType = e.target.text;
    var dSides = dType.replace ( /[^\d.]/g, '' );
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
    $("#dicePool").append(dEntry);

    // ADD DICE TO DICECOUNT TAB
    addUseDiceFromPool(dId);

    // SCROLL EDIT PANE TO SHOW NEW DICE
    $("#diceEditScroll").scrollTop($("#"+dId).offset().top)
  }
}

function addDiceToNS(dId, dLabel, dSides) {
  var range = [];
  var syms = new Array(dSides).fill(null);
  for (var i = 1; i <= dSides; i++) {
    range.push(i);
  }
  ___dice.dice[dId] = {
    "label" : dLabel,
    "numFaces" : dSides,
    "faces" : range,
    "symbols" : syms,
    "color" : "white",
    "visible" : true
  };
  storeLS();
}

function createDicePoolEntry(id) {
  var label = ___dice.dice[id].label;
  var sides = ___dice.dice[id].faces;
  var color = ___dice.dice[id].color;

  var dPDiv = $("<div>").addClass("input-group mb-2 dice_pool_entry").attr("id", id);
  var dL = $("<span>").addClass("input-group-addon -flex1 dice_pool_entry_label").text(label).css(
    {"color": getTextColor(color), "background-color": color }
  );

  //var fACbIcon = ___dice[id].visible ? "fa-check-square-o" : "fa-square-o";
  var fACbIcon = ___dice.dice[id].visible ? "fa-eye" : "fa-eye-slash";

  var dFACb = $("<span>").addClass("input-group-addon dice_pool_use").append(
    $("<i>").addClass("fa fa-fw " + fACbIcon)
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

function toggleUseDiceFromPool(e) {
  //debugger;
  var togTarget = e.target.closest("div.dice_pool_entry");
  var dId = togTarget.id;
  //debugger;
  ___dice.dice[dId].visible = !___dice.dice[dId].visible;
  var targ;
  if ($(e.target).is("span")) {
    targ = $(e.target).find("i.fa");
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
  var delTarget = e.target.closest("div.dice_pool_entry");
  var dId = delTarget.id;

  // REMOVE FROM DICECOUNT TAB
  delUseDiceFromPool(dId);

  // DELETE FROM DICEEDIT TAB
  $(delTarget).remove();

  // DELETE GLOBAL NS ENTRY
  delete ___dice.dice[dId];
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
  document.body.append(colorTest);
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

function init() {
  ___dice.dice.d6_DarkSouls_black = {"label" : "DS-Black", "numFaces": 6, "faces" : [0, 1, 1, 1, 2, 2], "symbols" : new Array(6).fill(null), "color": "black", "visible": true}
  ___dice.dice.d6_DarkSouls_blue = {"label" : "DS-Blue", "numFaces": 6, "faces" : [1, 2, 2, 2, 3, 3], "symbols" : new Array(6).fill(null), "color" : "blue", "visible": true}
  ___dice.dice.d6_DarkSouls_orange = {"label" : "DS-Orange", "numFaces": 6, "faces" : [1, 2, 2, 3, 3, 4], "symbols" : new Array(6).fill(null), "color": "orange", "visible": true}

  ___dice.dice.d6_MassiveDarknes_red = {"label" : "MD-Red", "numFaces": 6, "faces" : [0, 1, 1, 2, 2, 3], "symbols" : [,,,"fa-sun-o", "fa-sun-o", "fa-diamond"], "color": "orangered", "visible": true}
  ___dice.dice.d6_MassiveDarknes_yellow = {"label" : "MD-Yellow", "numFaces": 6, "faces" : [0, 1, 1, 1, 1, 2], "symbols" : [,,,,,"fa-sun-o"], "color" : "gold", "visible": true}
  ___dice.dice.d6_MassiveDarknes_blue = {"label" : "MD-Blue", "numFaces": 6, "faces" : [0, 0, 1, 1, 1, 2], "symbols" : [,,,,,"fa-sun-o"], "color": "skyblue", "visible": true}
  ___dice.dice.d6_MassiveDarknes_green = {"label" : "MD-Green", "numFaces": 6, "faces" : [0, 0, 1, 2, 2, 3], "symbols" : [,,,"fa-sun-o", "fa-sun-o", "fa-diamond"], "color": "lawngreen", "visible": true}
  ___dice.meta.version = 0.1;

  if(localStorage.userDice) {
    restoreLS();
  } else {
    storeLS();
  }

  initializeRandom();
  initializeSymbols();

  var diceKeys = Object.keys(___dice.dice);
  var dEntry;
  diceKeys.forEach(function (dId) {
    $("#dicePool").append(createDicePoolEntry(dId));
    addUseDiceFromPool(dId);
  });

  $("#dices").change(calculateDice);
  $("#rollDiceBtn").click(rollDice);
  $("#resetDiceBtn").click(resetDice);
  $("#statsToggleBtn").click(toggleStats);
  /*$("#diceEdit").click(function(e) {
    //debugger;
    console.log(e);
  }); //*/
  $("#btnDicePoolAddMenu").click(processAddDiceMenu);

  $("#dicePool").on("click", ".dice_pool_del_btn", deleteDicePoolEntry);
  $("#dicePool").on("click", ".dice_pool_use", toggleUseDiceFromPool);
  $("#dicePool").on("click", ".dice_pool_edit_btn", editDicePoolEntry);
  $("#diceEditModal").on("hidden.bs.modal", modalHide);
  $("#diceEditModal").on("change", "#modalDiceEditLabel", modalLabelChange);
  $("#diceEditModal").on("change", ".modal-table-val-entry", modalValSymChange);
  $("#diceEditModal").on("change", ".modal-table-sym-entry", modalValSymChange);
  $("#diceEditModal").on("change", ".pick_color", updateColors);
  $("#clearRollBtn").click(clearRolls);

  //$("#diceCountScroll").on("scroll", _.throttle(hideTabOnScroll, 50));
  //$("#diceCountScroll").promise().done()

  /*
  $('a[data-toggle="tab"][href="#diceEdit"]').on("shown.bs.tab", function(e) {
    $("#dicePoolOptions").show();
  });

  $('a[data-toggle="tab"][href="#diceEdit"]').on("hidden.bs.tab", function(e) {
    $("#dicePoolOptions").hide();
  });
  */

  if($("#statTable").is(":visible")) {
    $("#statsToggleBtn").text("Hide Stats");
  } else {
    $("#statsToggleBtn").text("Show Stats");
  }

  //___Benchmark();

}

/*
Massive Darkness Dice:
Red (attack): 0 1 1 2 2 3
Yellow (atk): 0 1 1 1 1 2
Blue (def):   0 0 1 1 1 2
Green (def):  0 0 1 2 2 3

___dice.d6_MassiveDarknes_red = {"label" : "Red", "faces" : [0, 1, 1, 2, 2, 3], "color": "orangered"}
___dice.d6_MassiveDarknes_yellow = {"label" : "Yellow", "faces" : [0, 1, 1, 1, 1, 2], "color" : "gold"}
___dice.d6_MassiveDarknes_blue = {"label" : "Blue", "faces" : [0, 0, 1, 1, 1, 2], "color": "skyblue"}
___dice.d6_MassiveDarknes_green = {"label" : "Green", "faces" : [0, 0, 1, 2, 2, 3], "color": "lawngreen"}



//*/
//window.addEventListener("DOMContentLoaded", init);
$(init);
