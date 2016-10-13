var BreakItDown = function BreakItDown(timeRecords, appliedLast365Days){

  if (!(appliedLast365Days[0]["week"])){

    var appliedByDayByType = d3.nest()
      .key(function(d) { return d.AppliedDate })
      .key(function(d) { return d.PermitTypeMapped })
      .rollup (function(v) { return v.length })
      .entries(appliedLast365Days);

    }

    else {

    var appliedByDayByType = d3.nest()
      .key(function(d) { return d.week })
      .key(function(d) { return d.PermitTypeMapped })
      .rollup (function(v) { return v.length })
      .entries(appliedLast365Days);

    weeks = [];

    }

  var bld = ['Building'];
  var demo = ['Demolition'];
  var ele = ['Electrical'];
  var other = ['Other'];
  var mech = ['Mechanical'];
  var plm = ['Plumbing'];
  var spa = ['Pool/Spa'];
  var fnc = ['Fence'];
  var roof = ['Roof'];
  var grad = ['Grading'];
  var datesArray = [];

  appliedByDayByType.forEach(function(d) {

    var dArray = d.key;
    datesArray.push(dArray);

    bldAdded = false;
    demoAdded = false;
    eleAdded = false;
    otherAdded = false;
    mechAdded = false;
    plmAdded = false;
    spaAdded = false;
    fncAdded = false;
    roofAdded = false;
    gradAdded = false;


    d.values.forEach(function(i) {
      
      if (i.key == "Building") {
        bld.push(i.values);
        bldAdded = true;
      }
      if (i.key == "Demolition") {
        demo.push(i.values);
        demoAdded = true;
      }
      if (i.key == "Electrical") {
        ele.push(i.values);
        eleAdded = true;
      }
      if (i.key == "Other") {
        other.push(i.values);
        otherAdded = true;
      }
      if (i.key == "Mechanical") {
        mech.push(i.values);
        mechAdded = true;
      }
      if (i.key == "Roof") {
        roof.push(i.values);
        roofAdded = true;    
      }
      if (i.key == "Pool/Spa") {
        spa.push(i.values);
        spaAdded = true;    
      }
      if (i.key == "Fence") {
        fnc.push(i.values);
        fncAdded = true;    
      }

      if (i.key == "Plumbing") {
        plm.push(i.values);
        plmAdded = true;    
      }

      if (i.key == "Grading") {
        grad.push(i.values);
        gradAdded = true;    
      }

    });

    if (!bldAdded)
      bld.push(0);
    if (!demoAdded)
      demo.push(0);
    if (!eleAdded)
      ele.push(0);
    if (!mechAdded)
      mech.push(0);
    if (!otherAdded)
      other.push(0);
    if (!plmAdded)
      plm.push(0);
    if (!roofAdded)
      roof.push(0);
    if (!fncAdded)
      fnc.push(0);
    if (!spaAdded)
      spa.push(0);
    if (!gradAdded)
      grad.push(0);


  });

                  
  function returnedData() {
     return {
      "bld": bld
      , "roof": roof
      , "mech": mech
      , "ele": ele
      , "plm": plm
      , "demo": demo
      , "grad": grad
      , "other": other
      , "spa": spa
      , "fnc": fnc
      ,'datesArray': datesArray
    }
  };

  var returnedDatas = returnedData();

  return returnedDatas;
}

window.BreakItDown = BreakItDown;