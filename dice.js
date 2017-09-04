var ___dice = {};
var ___stats = {};

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

function rollDice() {
  var allDices = $("#dices").find("[id]").map(function () {
    return $(this).data("dice_id");
  }).get();
  var diceCount = [];

  for (var i = 0; i < allDices.length; i++) {
    var dVal = parseInt($("#"+allDices[i]+"_count").val()) || 0;
    dVal = dVal < 0 ? 0 : dVal;
    diceCount.push([allDices[i], dVal]);
  }

  var dReturn = [];
  var dVal = [];
  for (var i = 0; i < diceCount.length; i++) {
    if (diceCount[i][1] > 0) {
      for (var j = 0; j <diceCount[i][1]; j++) {
        dVal.push(___dice[diceCount[i][0]].faces[Math.floor(___rngesus() * ___dice[diceCount[i][0]].faces.length)]);

      }
      dReturn.push([diceCount[i][0], dVal.slice()] )
    }
    dVal = [];
  }
  //console.log("roll resuls")
  //console.log(dReturn);
  displayRolls(dReturn);
}

function displayRolls(diceResult) {
  var diceDiv = $("#diceRollResultDiv");
  diceDiv.empty();
  var color, bgCol, dId;
  var total = 0;
  for (var i = 0; i < diceResult.length; i++) {
    bgCol = ___dice[diceResult[i][0]].color;
    color = getTextColor(bgCol);
    for (var j = 0; j < diceResult[i][1].length; j++) {
      //debugger;
      diceDiv.append($("<span>").addClass("badge").css(
        {"background-color":bgCol, "color":color}
        ).text(diceResult[i][1][j])
      );
      total += diceResult[i][1][j];
    }
    diceDiv.append($("<br>"));
  }
  diceDiv.append($("<span>").addClass("badge badge-secondary").text("Total: " + total));
}

function clearRolls() {
  $("#diceRollResultDiv").empty();
}

function calculateDice(e) {
  //console.log("started");
  //debugger;

  ___stats = {};
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
  //var numBlk = parseInt($("#black").val()) || 0;
  //var numBlu = parseInt($("#blue").val()) || 0;
  //var numOrg = parseInt($("#orange").val()) || 0;
  //var numSum = numBlk + numBlu + numOrg;
  /*
  if (numSum > 10) {
    alert("Please use less dice (<= 10)");
    e.target.value = 0;
    //debugger;
    //alert(e.target);
    return;
  }

  //*/

  for (i = 0; i < diceCount.length; i++) {
    for (var j = 0; j < diceCount[i][1]; j++) {
      workArr.push(___dice[diceCount[i][0]].faces.slice());
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
    finalStep = step0;
    finalIdx = step0Idx;
    steps[0] = {"idx": step0Idx, "val": step0};
  }

  //debugger;
  var stepx;
  var stepxArr;
  var stepxIdx;
  var si;
  var sIdxi;
  var tmpStpVal;

  for (i = 0; i < workArr.length; i++ ) {
    stepx = {};
    stepxArr = workArr[i];
    stepxIdx = [];

    prevStep = steps[i];

    for (si = 0; si < stepxArr.length; si++) {
      for (sIdxi = 0; sIdxi < prevStep.idx.length; sIdxi++) {
        tmpStpVal = stepxArr[si] + prevStep.idx[sIdxi];
        if (tmpStpVal in stepx) {
          stepx[tmpStpVal] += prevStep.val[prevStep.idx[sIdxi]];
        } else {
          stepx[tmpStpVal] = prevStep.val[prevStep.idx[sIdxi]];
          stepxIdx.push(tmpStpVal);
        }
      }
    }

    steps[i+1] = {"idx": stepxIdx, "val": stepx}

    if (i == workArr.length-1) {
      finalStep = stepx;
      finalIdx = stepxIdx;
    }
  }

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
  console.log("range = " + range);
  console.log("mean = " + mean);
  console.log("median = " + median);
  console.log("mode = " + mode);
  console.log("std dev = " + stdev);

  if (range.length > 1) {
    $("#rangeData").text(range[0] + " - " + range[1]);
    ___stats.range = range;
  } else {
    $("#rangeData").text("No Range");
  }
  //$("#rangeData").text(range ? range[0] + " - " + range[1] : "No Range");

  if (parseInt(mean)) {
    $("#meanData").text(mean);
    ___stats.mean = mean;
  } else {
    $("#meanData").text("No Mean");
  }
  //$("#meanData").text(mean ? mean : "No Mean");

  if (median && median.length > 0) {
    $("#medianData").text(median[0] + " @ " + Math.round(median[1] * 100) + " %");
  } else {
    $("#medianData").text("No Median");
  }
  /*$("#medianData").text(median ?
                            (median.length > 0) ? median[0] + " @ " + Math.round(median[1] * 100) + " %" : "No Median"
                          : "No Median");
  //*/
  if (mode && mode.length > 0) {
    var mText = mode[0][0] + " @ " + Math.round(mode[0][1] * 10000)/100 + " %";

    for (i = 1; i < mode.length; i++) {
      mText += ", " + mode[i][0] + " @ " + Math.round(mode[i][1] * 10000)/100 + " %";
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
  } else {
    $("#stdevData").text("No Standard Deviation");
  }
  //$("#stdevData").text(stdev ? stdev : "No Standard Deviation");
  //$('#statTable').DataTable();
  //debugger;
}

function cmean(idx, set) {
  var sum = 0;
  var count = 0;

  idx.forEach(function (el) {


    sum += set[el] * el;
    count += set[el];

  });

  return (sum/count).toFixed(2);
}

function cmedian(idx, set) {
  var count = 0;
  var median;
  var mid;
  idx.forEach(function (el) {
    count += set[el];
  });

  mid = [count/2];
  if (mid[0] != Math.round(mid[0])) {
    mid = [Math.floor(mid), Math.ceil(mid)];
  }

  var counter = 0;
  if (mid.length == 1) {
    for(var i = 0; i < idx.length; i++) {
      el = idx[i]
      if (set[el] + counter >= mid[0]) {
        median = [el, 1 - counter/count];
        break;
      }
      counter += set[el];
    }
  } else {
    var first = false;
    var last = false;
    for(var i = 0; i < idx.length; i++) {
      el = idx[i]
      if (set[el] + counter >= mid[0] && first == false) {
        first = [el, counter/count];
      }
      if (set[el] + counter >= mid[1] && last == false) {
        last = [el, counter/count];
      }
      if (first != false && last != false) {
        break;
      }
      counter += set[el];
    }
    median = [(first[0] + last[0])/2, 1 - (first[1] + last[1])/2];
  }
  return median;
}

function cmode(idx, set) {
  var count = 0;
  var mode = [[0,0]];
  idx.forEach(function (el) {
    count += set[el];
    if (set[el] > mode[0][1]) {
      mode = [[el, set[el]]];
    } else if (set[el] == mode[0][1]) {
      //debugger;
      mode.push([el, set[el]]);
    }
  });
  for(var i = 0; i < mode.length; i++) {
    mode[i][1] = mode[i][1]/count;
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
    stdAvgSum = stdAvgSum.plus(Big(el - avg).pow(2).times(set[el]));
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
  $("#display").text(value);
}

function processAddDiceMenu(e) {
  if (e.target.className == "dropdown-item") {
    var dType = e.target.text;
    var dSides = dType.replace ( /[^\d.]/g, '' );
    dSides = parseInt(dSides, 10);

    var dId = dType + (new Date()).valueOf() + Math.random();
    dId = dType + "_" + dId.hashCode();
    while (dId in ___dice) {
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
  }
}

function addDiceToNS(dId, dLabel, dSides) {
  var range = [];
  for (var i = 1; i <= dSides; i++) {
    range.push(i);
  }
  ___dice[dId] = {"label" : dLabel, "faces" : range, "color" : "white"};
  storeLS();
}

function createDicePoolEntry(id) {
  var label = ___dice[id].label;
  var sides = ___dice[id].faces;
  var color = ___dice[id].color;

  var dPDiv = $("<div>").addClass("input-group mr-3 mb-2 dice_pool_entry").attr("id", id);
  var dL = $("<span>").addClass("input-group-addon dice_pool_entry_label").text(label).css(
    {"color": getTextColor(color), "background-color": color }
  );
  var dCb = $("<span>").addClass("input-group-addon").append(
    $("<input>").addClass("dice_pool_use").attr("type", "checkbox").prop("checked", "true")
  ).append("Use?");
  var dEB = $("<span>").addClass("input-group-btn").append(
    $("<button>").addClass("btn btn-secondary dice_pool_edit_btn").attr(
      {"type": "button", "data-toggle":"modal", "data-target":"#diceEditModal"}
    ).text("Edit")
  );
  var dDB = $("<span>").addClass("input-group-btn").append(
    $("<button>").addClass("btn btn-secondary dice_pool_del_btn").attr("type", "button").text("Delete")
  );

  dPDiv.append(dL, dCb, dEB, dDB);

  return dPDiv;
}

function toggleUseDiceFromPool(e) {
  var togTarget = e.target.closest("div");
  var togId = togTarget.id;

  if (e.target.checked == true) {
    // after clicking checkbox, checkbox is checked
    addUseDiceFromPool(togId);
  }
  else {
    // after clicking checkbox, checkbox is unchecked
    delUseDiceFromPool(togId);
  }
}

function addUseDiceFromPool(dId) {
//debugger;
  var newUseDice = $("<div>").addClass("input-group mb-1").append(

    $("<span>").addClass("input-group-addon").text(___dice[dId].label).css(
      {"color": getTextColor(___dice[dId].color), "background-color":___dice[dId].color }
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
  var delTarget = e.target.closest("div");
  var delId = delTarget.id;

  // REMOVE FROM DICECOUNT TAB
  delUseDiceFromPool(delId);

  // DELETE FROM DICEEDIT TAB
  $(delTarget).remove();

  // DELETE GLOBAL NS ENTRY
  delete ___dice[delId];
  storeLS();
}

function editDicePoolEntry(e) {
  var dieTarget = e.target.closest("div");
  var dieId = dieTarget.id;

  //$("#diceEditTitle").text(___dice[dieId].label);
  $("#diceEditHeader").append(
    $("<div>").addClass("container col-12").append(
      $("<div>").addClass("row").append(
        $("<div>").addClass("col-4").append(
          $("<h5>").addClass("modal-title").text("Dice Name: ")
        )
      ).append(
        $("<div>").addClass("col-8").append(
          $("<input>").attr(
            {"id":"modalDiceEditLabel", "data-dice_id":dieId, "type":"text"}
          ).addClass("form-control").val(___dice[dieId].label).css(
            {"color": getTextColor(___dice[dieId].color), "background-color":___dice[dieId].color }
          )
        )
      )
    ).append(
      $("<div>").addClass("row").append(
        $("<div>").addClass("col-4").append(
          $("<h6>").text("Dice Color: ")
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
    color: ___dice[dieId].color,
    hideAfterPaletteSelect:true,
  });

  var diceFaces = ___dice[dieId].faces;

  var modalTableDiv = $("<div>").addClass("table-responsive").attr(
    {"id": "modalTableDiv", "data-dice_id":dieId}
  );
  var modalTable = $("<table>").addClass("table table-striped").attr("id", "modalTable").append(
    $("<thead>").append(
      $("<tr>").append(
        $("<td>").text("Dice Face")
      ).append(
        $("<td>").text("Value")
      )
    )
  );
  var tBody = $("<tbody>");

  for (var i = 0; i < diceFaces.length; i++) {
    tBody.append(
      $("<tr>").append(
        $("<td>").text(i+1)
      ).append(
        $("<td>").append(
          $("<input>").addClass("modal-table-val-entry").attr("data-didx", i).val(___dice[dieId].faces[i])
        )
      )
    );
  }

  modalTableDiv.append(modalTable.append(tBody));
  $("#diceEditBody").append(modalTableDiv);
}

function modalHide() {
  $("#diceEditHeader").empty();
  $("#diceEditBody").empty();
  storeLS();
}

function modalLabelChange(e) {
  var dId = $("#modalDiceEditLabel").data("dice_id");
  var newDiceLabel = $("#modalDiceEditLabel").val();
  ___dice[dId].label = newDiceLabel;

  if ($("#" + dId + "_count" ).length) {
    $("#" + dId + "_count" ).prevAll("span").text(newDiceLabel);
  }
  $("#" + dId + " .dice_pool_entry_label").text(newDiceLabel)
}

function modalValueChange(e) {
  //debugger;
  var dIdx = $(e.target).data("didx");
  var dVal = $(e.target).closest("[data-dice_id]").data("dice_id");

  ___dice[dVal].faces[dIdx] = parseInt($(e.target).val());
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
      rgb[i] = rgb[i]/12.92
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
  ___dice[dId].color = $(e.target).spectrum("get").toString();
  //debugger;
  var cssObj = {"color": getTextColor(___dice[dId].color), "background-color":___dice[dId].color };
  $("#modalDiceEditLabel").css(cssObj);
  $("#"+dId + " .dice_pool_entry_label").css(cssObj);
  $("#" + dId + "_count").prevAll("span").css(cssObj);
}

function storeLS() {
  localStorage.userDice = JSON.stringify(___dice);
}

function restoreLS() {
  ___dice = JSON.parse(localStorage.userDice)
}

function initializeRandom() {
  ___rngesus = new Math.seedrandom();

}


function init() {
  ___dice.d6_DarkSouls_black = {"label" : "Black", "faces" : [0, 1, 1, 1, 2, 2], "color": "black"}
  ___dice.d6_DarkSouls_blue = {"label" : "Blue", "faces" : [1, 2, 2, 2, 3, 3], "color" : "blue"}
  ___dice.d6_DarkSouls_orange = {"label" : "Orange", "faces" : [1, 2, 2, 3, 3, 4], "color": "orange"}

  ___dice.d6_MassiveDarknes_red = {"label" : "Red", "faces" : [0, 1, 1, 2, 2, 3], "color": "orangered"}
  ___dice.d6_MassiveDarknes_yellow = {"label" : "Yellow", "faces" : [0, 1, 1, 1, 1, 2], "color" : "gold"}
  ___dice.d6_MassiveDarknes_blue = {"label" : "Blue", "faces" : [0, 0, 1, 1, 1, 2], "color": "skyblue"}
  ___dice.d6_MassiveDarknes_green = {"label" : "Green", "faces" : [0, 0, 1, 2, 2, 3], "color": "lawngreen"}

  if(localStorage.userDice) {
    restoreLS();
  } else {
    storeLS();
  }

  initializeRandom();

  var diceKeys = Object.keys(___dice);
  var dEntry;
  diceKeys.forEach(function (dId) {
    $("#dicePool").append(createDicePoolEntry(dId));
    addUseDiceFromPool(dId);
  });

  $("#dices").change(calculateDice);
  $("#rollDiceBtn").click(rollDice);
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
  $("#diceEditModal").on("change", ".modal-table-val-entry", modalValueChange);
  $("#diceEditModal").on("change", ".pick_color", updateColors);
  $("#clearRollBtn").click(clearRolls);

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
