var SelectPieClick = function SelectPieClick(d, i, urlLast365, shortStartDateMoment){
	console.log("onmouseover", d.id, i);
          requestJSON(urlLast365, function(json) {
              var records = json.result.records;
              //extract permits applied for in last 7 days
              var appliedLast7Days = records.filter(function(d) { 
                return moment(d.AppliedDate) > shortStartDateMoment; 
              });
              
              //extract permits issued in last 7 days
              var issuedLast7Days = records.filter(function(d) { 
                return moment(d.IssuedDate) > shortStartDateMoment; 
              });

              console.log(d);

              switch(d.id) {

                case "Building":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    return o.PermitTypeMapped === "Building";
                  });
                  break;

                case "Electrical":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    return o.PermitTypeMapped === "Electrical";
                  });
                  break;

                case "Plumbing":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    return o.PermitTypeMapped === "Plumbing";
                  });
                  break;

                case "Mechanical":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                                                          console.log("ERROR2!");
                    return o.PermitTypeMapped === "Mechanical";
                  });
                  break;

                case "Roof":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    console.log("ERROR!")
                    return o.PermitTypeMapped === "Roof";
                  });
                  break;

                case "Grading":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    return o.PermitTypeMapped === "Grading";
                  });
                  break;

                case "Demolition":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    return o.PermitTypeMapped === "Demolition";
                  });
                  break;

                case "Pool/Spa":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    return o.PermitTypeMapped === "Pool/Spa";
                  });
                  break;

                case "Fence":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    return o.PermitTypeMapped === "Fence";
                  });
                  break;

                case "Other":
                  var appliedLastWeek = appliedLast7Days.filter(function(o) {
                    return o.PermitTypeMapped === "Other";
                  });
                  break;
              }
              
              var appliedByDayByType = [];
              var appliedByDayByType = d3.nest()
                .key(function(d) { return d.AppliedDate })
                .key(function(d) { return d.PermitTypeMapped })
                .rollup (function(v) { return v.length })
                .entries(appliedLastWeek);

              var bld = ['Building'];
              var demo = ['Demolition'];
              var ele = ['Electrical'];
              var other = ['Other'];
              var mech = ['Mechanical'];
              var plm = ['Plumbing'];
              var psp = ['Pool/Spa'];
              var fnc = ['Fence'];
              var roof = ['Roof'];
              var datesArray = [];
              var bldAdded = false, demoAdded = false, eleAdded = false, otherAdded = false, mechAdded = false, plmAdded = false;
              var tempArray = [];

              appliedByDayByType.forEach(function(d) {

                console.log(d);

                var dArray = d.key;
                datesArray.push(dArray);

                bldAdded = false;
                demoAdded = false;
                eleAdded = false;
                otherAdded = false;
                mechAdded = false;
                plmAdded = false;
                pspAdded = false;
                fncAdded = false;
                roofAdded = false;

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
                  if (i.key == "Plumbing") {
                    plm.push(i.values);
                    plmAdded = true;    
                  }
                  if (i.key == "Roof") {
                    roof.push(i.values);
                    roofAdded = true;    
                  }
                  if (i.key == "Pool/Spa") {
                    psp.push(i.values);
                    pspAdded = true;    
                  }
                  if (i.key == "Fence") {
                    fnc.push(i.values);
                    fncAdded = true;    
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
                if (!roofAdded);
                  roof.push(0);
                if (!fncAdded);
                  fnc.push(0);
                if (!pspAdded);
                  psp.push(0);
            
              });

            var chart = c3.generate({
                  bindto: '#byDay',
                  data: {
                    columns: [
                        bld,
                        demo,
                        ele,
                        other,
                        mech,
                        plm,
                        roof,
                        fnc,
                        psp
                    ],
                    type: 'bar'//,
                    //groups: [['Building','Electrical','Other','Mechanical','Plumbing']]
                  },
                  grid: {
                    y: {
                      lines: [{value:0}]
                    }
                  },
                  axis: {
                    x: {
                      type: 'category',
                      categories: datesArray
                    }
                  }
                });
              
              // console.log(appliedLast7Days);
          });
          console.log('works!')
}

window.SelectPieClick = SelectPieClick;