var Plumbing = function Plumbing(config){
	
  var clicker = [];
  var records = [];
  var columnData = [];


        /********************************************************************************/
        /*
        /* DATA GRAB
        /*
        /********************************************************************************/

  check = function(config){

    if (!config){

      var grabLast365 = PermitDashboard.cache.last365;
      console.log(grabLast365);

      requestJSONa(grabLast365, function(json) {

        var records = json.records;
        var plumRecords = clone(records); 

        console.log(plumRecords, "#");

        switch (document.getElementById('monthList-dropdown-menu').value){

          case '1':
            plumRecords.forEach(function(record, inc, array) {
            record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
          });
          break;
         
          default:
            plumRecords.forEach(function(record, inc, array) {
        		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
        		// console.log(record.AppliedDate, "*");
      		})   

      	}; 

      	var initialStartDate = document.getElementById('monthList-dropdown-menu').value;

      	var startDateMoment = moment().subtract(initialStartDate, 'M');

       	console.log(startDateMoment);

      	var appliedLast365Days = plumRecords.filter(function(d) { 
      	   return moment(d.AppliedDate) > startDateMoment; 
      	});


        	var appliedLastYearByType = appliedLast365Days.filter(function(o) {
          	return o.PermitTypeMapped === "Plumbing";
        	});

        	permitTypes=[];

      	//Get a distinct list of neighborhoods
      	for (var i = 0; i < plumRecords.length; i++) {
      	    permitTypes.push([plumRecords[i]["PermitType"], plumRecords[i].count]);
      	}


      	var appliedLast365Days = plumRecords.filter(function(d) { 
      	   return moment(d.AppliedDate) > startDateMoment; 
      	});
      	    
      	var appliedByDayByType = [];

      	// compiles array for bar-graph
      	var appliedByDayByType = d3.nest()

          // concatenates date
          .key(function(d) { return d.AppliedDate })

          // concatanates type
          .key(function(d) { return d.PermitType })

          // takes the records and creates a count
          .rollup (function(v) { return v.length })

          // creates a d3 object from the records
          .entries(appliedLastYearByType);

          var subtypes = ["Eldorado Springs Sanitation Hookup", "Gas Piping", "Water Heater", "Plumbing - Other"];
           
          var output = [];

          console.log(appliedLastYearByType);
          console.log(appliedByDayByType);

                     
        	subtypes.forEach(function(subtype) {
            output[subtype] = appliedByDayByType.map(function(month) {
                var o = {};
                o[month.key] = month.values.filter(function(val) {
                  return val.key == subtype;
                }).map(function(m) { return m.values; }).shift() || 0;
                return o;
              })
          });


          var dates = appliedByDayByType.map(function(date) {
            return date.key;
          });


          columnData=[];
          // console.log(columnData);

          // dates.forEach(function(date, i){
          //   var dArray = date;
            // console.log(i);
      	lcount=0;

      	columnData = Object.keys(output).map(function(type) {
              var a = output[type].map(function(month){
                return month[Object.keys(month)[0]];
              });
              return [type].concat(a);
      	});

      	console.log(columnData);

      	

      	var returnObj = ([Object.keys(output)[0]]).concat(returnObj)
    	  datesArray=[];
    	  output[Object.keys(output)[0]].forEach(function(d, i) {
    		    var dArray = [dates[i]];
    	    	datesArray.push(dArray);
      	});

          console.log(datesArray);


                /*  Within Reloaded Pie-Chart - Enables Selection Based On Type
                /*
                /*   DATA PLOT
                /*
                /************************************************************************************/



          var chart = c3.generate({
            bindto: '#byDay',
            data: {
              columns : columnData
              ,
              type: 'bar'//,
            }, 
            axis: {
                y: {tick : {format: d3.format('d')}},
                x: {
                type: 'category',
                categories: datesArray
              }
            }
          });

                  
      });

      return columnData;

    }

    else {


      var grabLast365 = PermitDashboard.cache.last365;

      config = config.slice(1);

      requestJSONa(grabLast365, function(json) {

        var records = json.records 
        var plumRecords = clone(records); 

        console.log(plumRecords, "#");

        switch (document.getElementById('monthList-dropdown-menu').value){

          case '1':
            plumRecords.forEach(function(record, inc, array) {
            record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
          });
          break;
         
          default:
            plumRecords.forEach(function(record, inc, array) {
            record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
            // console.log(record.AppliedDate, "*");
          })   

        }; 

        var initialStartDate = document.getElementById('monthList-dropdown-menu').value;

        var startDateMoment = moment().subtract(initialStartDate, 'M');

        console.log(startDateMoment);

        var appliedLast365Days = plumRecords.filter(function(d) { 
           return moment(d.AppliedDate) > startDateMoment; 
        });




        var appliedLastYearByType = appliedLast365Days.filter(function(o) {
          return o.PermitTypeMapped === "Plumbing";
        });

        permitTypes=[];

        //Get a distinct list of neighborhoods
        for (var i = 0; i < plumRecords.length; i++) {
            permitTypes.push([plumRecords[i]["PermitType"], plumRecords[i].count]);
        }


        var appliedLast365Days = plumRecords.filter(function(d) { 
           return moment(d.AppliedDate) > startDateMoment; 
        });
            
        var appliedByDayByType = [];

        // compiles array for bar-graph
        var appliedByDayByType = d3.nest()

          // concatenates date
          .key(function(d) { return d.AppliedDate })

          // concatanates type
          .key(function(d) { return d.PermitType })

          // takes the records and creates a count
          .rollup (function(v) { return v.length })

          // creates a d3 object from the records
          .entries(appliedLastYearByType);

          var subtypes = [config];
           
          var output = [];

          console.log(appliedLastYearByType);
          console.log(appliedByDayByType);

                     
          subtypes.forEach(function(subtype) {
            output[subtype] = appliedByDayByType.map(function(month) {
                var o = {};
                o[month.key] = month.values.filter(function(val) {
                  return val.key == subtype;
                }).map(function(m) { return m.values; }).shift() || 0;
                return o;
              })
          });


          var dates = appliedByDayByType.map(function(date) {
            return date.key;
          });


          columnData=[];
          // console.log(columnData);

          // dates.forEach(function(date, i){
          //   var dArray = date;
            // console.log(i);
        lcount=0;

        columnData = Object.keys(output).map(function(type) {
              var a = output[type].map(function(month){
                return month[Object.keys(month)[0]];
              });
              return [type].concat(a);
        });

        console.log(columnData);

        

          var returnObj = ([Object.keys(output)[0]]).concat(returnObj)
          datesArray=[];
          output[Object.keys(output)[0]].forEach(function(d, i) {
              var dArray = [dates[i]];
              datesArray.push(dArray);
        });

          console.log(datesArray);


                /*  Within Reloaded Pie-Chart - Enables Selection Based On Type
                /*
                /*  DATA PLOT    
                /*
                /************************************************************************************/



          var chart = c3.generate({
            bindto: '#byDay',
            data: {
              columns : columnData
              ,
              type: 'bar'//,
            }, 
            axis: {
                y: {tick : {format: d3.format('d')}},
                x: {
                type: 'category',
                categories: datesArray
              }
            }
          });

                  
      });

      return columnData;

    }

  };

  columnData = check(config);

  console.log($('.btn-primary').attr('id'));
  document.getElementById("toggleWithPieClick").innerHTML= ("<span>Graph options - toggle between: <div class='btn-group' data-toggle='buttons'><label class='btn btn-primary btn-inline' id='"+ $('.btn-primary').attr('id') +"' style = 'display: inline-block'><input type='radio' class='innerSelectSub'> Totals </label><span style='display: inline-block' id='innerSelectSubs'><span>");

  $(".monthly-dropdown-menu").empty();
  $("#innerSelectSubs").append('<select id="plm-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value="">ALL</option>'+
                  '<option value="pWater Heater">Water Heater</option>'+
                  '<option value="pGas Piping">Gas Piping</option>'+
                  '<option value="pEldorado Springs Sanitation Hookup">Eldorado Springs Sanitation Hookup</option>'+
                  '<option value="pPlumbing - Other">Plumbing - Other</option></select>');

  $('#Plumbing').text('Totals');

  return subtype;

  $("#uniqueSelector").on('select', $(".monthly-dropdown-menu"),
                          function (){
                            var selectedSubtype = this.querySelector("div").querySelector("span").querySelector("div").querySelector("label").id;
                            console.log(selectedSubtype);
                            ToggleBarGraph(selectedSubtype, toggleSubtype);
                          });

  $('#Plumbing').text('Totals');

  var clickHole = document.getElementById("toggleWithPieClick").querySelector("span").querySelector("div").querySelector("label");

  $(clickHole).on('click', null, columnData, function(e){

    console.log(columnData);

    if (clicker%2 == 0){

      $('#plm-monthly-dropdown-menu').hide();
      $('#Plumbing').text('Subtype(s)');

      console.log(e);
      console.log(e.target);
      var chart = c3.generate({
      bindto: '#byDay',
      data: {
        columns: [
            window.returningObj
        ],
        type: 'bar',
        colors: {
           'Building': 'rgb(31, 119, 180)',
           'Demolition': 'rgb(140, 86, 75)',
           'Electrical': 'rgb(214, 39, 40)',
           'Other': 'rgb(127, 127, 127)',
           'Mechanical': 'rgb(44, 160, 44)',
           'Roof': 'rgb(255, 127, 14)',
           'Plumbing': 'rgb(148, 103, 189)' ,
           'Pool/Spa': 'rgb(188, 189, 34)',
           'Fence': 'rgb(23, 190, 207)',
           'Grading': 'rgb(227, 119, 194)'
        }
      },
      axis: {
          y: {tick : {format: d3.format('d')}},
          x: {
          type: 'category',
          categories: datesArray
          }
        }
      })

    }

    else {

      var chart = c3.generate({
          bindto: '#byDay',
          data: {
            columns : columnData
            ,
            type: 'bar'//,
          }, 
          axis: {
              y: {tick : {format: d3.format('d')}},
              x: {
              type: 'category',
              categories: datesArray
              }
          }
      });

          $('#plm-monthly-dropdown-menu').show();

          $('#Plumbing').text('Totals');
        };



        clicker++;

      });

};

window.Plumbing = Plumbing;