function calculateDiceCore(workArr, steps) {
  var stepx;
  var stepxArr;
  var stepxIdx;
  var i, si;
  var sIdxi;
  var tmpStpVal;
  var _aCount = 0;
  var _pCount = 0;

  var returnObj;
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
          _pCount++;
        } else {
          stepx[tmpStpVal] = new Big(prevStep.val[prevStep.idx[sIdxi]]);
          _aCount++;
          stepxIdx.push(tmpStpVal);
        }
      }
    }

    steps[i+1] = {"idx": stepxIdx, "val": stepx}

    if (i == workArr.length-1) {
      returnObj = { "finalStep": stepx, "finalIdx":stepxIdx, "pC": _pCount, "aC": _aCount};
      //finalStep = stepx;  // Array of Big() numbers
      //finalIdx = stepxIdx;
    }
  }
  return returnObj;
}
