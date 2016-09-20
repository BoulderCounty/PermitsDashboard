var Demolition = function Demolition(config){
	console.log("START:", config);
	var clicker = 0;
	var records = [];
	var columnData = [];


	      /********************************************************************************/
	      /*
	      /*  DATA GRAB
	      /*
	      /********************************************************************************/
	check = function(config){
		if (config){

		var grabLast365 = PermitDashboard.cache.last365;
		console.log(grabLast365);

		requestJSONa(grabLast365, function(json) {

		    var records = json.records;
		    var demoRecords = clone(records);
		    var timeRecords = clone(records);


			switch (document.getElementById('monthList-dropdown-menu').value){

		  		case '1':
		    		demoRecords.forEach(function(record, inc, array) {
		     		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
		    	});

		    		weeklyBunch =[];
		  		break;
		     
		  		default:
		   			demoRecords.forEach(function(record, inc, array) {
		    		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
		  			});

		  			 weeklyBunch = [];


                    for (var  i = 0; i<demoRecords.length; i++){
                      var then = demoRecords[i].AppliedDate;


                      var ago = moment(then);
                      var weeksAgoLabel = ago.startOf('isoWeek').format('MMM-DD-YY');
                      weeklyBunch.push([timeRecords[i]["AppliedDate"], weeksAgoLabel]);


                    };

                    console.log(weeklyBunch);

		  	}; 
//
//  NEED TO ADD TO OTHER TYPES
//
		  	var initialStartDate = document.getElementById('monthList-dropdown-menu').value;

			if (initialStartDate > 6) {
	        	initialStartDate = (parseInt(initialStartDate) + 1);
	        	demoRecords.forEach(function(record, inc, array) {
		    		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
		  		});
            }

		  	var startDateMoment = moment().subtract(initialStartDate, 'M');

		  	var weekStartDateMoment =  moment().subtract(initialStartDate, 'M').startOf('isoWeek');
            console.log(weekStartDateMoment);


		 	console.log(startDateMoment);

			var appliedLast365Days = demoRecords.filter(function(d) { 
			   return moment(d.AppliedDate) > startDateMoment; 
			});

			 var appliedPerWeekSelectedDays = weeklyBunch.filter(function(d) {
	              return (moment(d[0]) > weekStartDateMoment);
	            });


		  	permitTypes=[];


			//Get a distinct list of neighborhoods
			for (var i = 0; i < demoRecords.length; i++) {
			    permitTypes.push([demoRecords[i]["PermitType"], demoRecords[i].count]);
			}

			if (config != 1){				
				 appliedLast365Days.forEach(function(day, inc, arr){
		                appliedLast365Days[inc]["week"] = appliedPerWeekSelectedDays[inc][1];
	              })
			}

			else {
				 appliedLast365Days.forEach(function(day, inc, arr){
		                appliedLast365Days[inc]["week"] = null;
	        	 })
			}



			 console.log(appliedLast365Days);


			var appliedLast365Days = demoRecords.filter(function(d) { 
			   return moment(d.AppliedDate) > startDateMoment; 
			});


		  	var appliedLastYearByType = appliedLast365Days.filter(function(o) {
		    	return o.PermitTypeMapped === "Demolition";
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



                var weeklyAppliedByDayByType = d3.nest()  

                  // concatenates date
                  .key(function(d) { return d.week })

                  // concatanates type
                  .key(function(d) { return d.PermitType })

                  // takes the records and creates a count
                  .rollup (function(v) { return v.length })

                  // creates a d3 object from the records
                  .entries(appliedLastYearByType);



        var subtypes = ["Commercial Deconstruction", "Residential Deconstruction", "Residential Demolition"];
		     
		    var output = [];
		    var weeklyOutput = [];


		    console.log(weeklyAppliedByDayByType);
		    // console.log(appliedLastYearByType);
		    // console.log(appliedByDayByType);

		               
		  	subtypes.forEach(function(subtype) {
		      output[subtype] = appliedByDayByType.map(function(month) {
		          var o = {};
		          o[month.key] = month.values.filter(function(val) {
		            return val.key == subtype;
		          }).map(function(m) { return m.values; }).shift() || 0;
		          return o;
		        })
		    });

		    subtypes.forEach(function(subtype) {
		      weeklyOutput[subtype] = weeklyAppliedByDayByType.map(function(month) {
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

			weeklyColumnData = Object.keys(weeklyOutput).map(function(type) {
		        var a = weeklyOutput[type].map(function(month){
		          return month[Object.keys(month)[0]];
		        });
		        return [type].concat(a);
			});

			console.log(weeklyColumnData);

			

		  	// var returnObj = ([Object.keys(output)[0]]).con cat(returnObj);

		    datesArray=[];
		    output[Object.keys(output)[0]].forEach(function(d, i) {
			    var dArray = [dates[i]];
		    	datesArray.push(dArray);
			});

			weeklyDatesArray=[];
		    weeklyOutput[Object.keys(weeklyOutput)[0]].forEach(function(d, i) {
			    var dArray = [dates[i]];
		    	weeklyDatesArray.push(dArray);
			});

		    console.log(weeklyDatesArray);


		          /*  Within Reloaded Pie-Chart - Enables Selection Based On Type
		          /*
		          /*    DATA PLOT   
		          /*
		          /************************************************************************************/



	       if((config == 1) || (config > 6)){


		       var chart = c3.generate({
		            bindto: '#byDay',
		            data: {
		              columns : columnData,
		              colors: {
			            	"Commercial Deconstruction": 'hsl(10, 30.2%, 12.2%)',
			            	"Residential Deconstruction": 'hsl(10, 30.2%, 42.2%)',
			            	"Residential Demolition": 'hsl(10, 30.2%, 72.2%)'
			          },
		              type: 'bar'//,
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

	       	else{
		        var chart = c3.generate({
		            bindto: '#byDay',
		            data: {
		              columns : weeklyColumnData
		              ,
		            colors: {
		            	"Commercial Deconstruction": 'hsl(10, 30.2%, 12.2%)',
		            	"Residential Deconstruction": 'hsl(10, 30.2%, 42.2%)',
		            	"Residential Demolition": 'hsl(10, 30.2%, 72.2%)'
		            },
		              type: 'bar'//,
		            }, 
		            axis: {
		                y: {tick : {format: d3.format('d')}},
		                x: {
		                type: 'category',
		                categories: window.datesingArray
		              	}
		            }
		        });
		    }
		            
		});

		return columnData;
	
		}


	};

	

	columnData = check(config);

	console.log($('.btn-primary').attr('id'));
    document.getElementById("toggleWithPieClick").innerHTML= ("<span>Graph options - toggle between: <div class='btn-group' data-toggle='buttons'><label class='btn btn-primary btn-inline' id='"+ $('.btn-primary').attr('id') +"' style = 'display: inline-block'><input type='radio' class='innerSelectSub'> Totals </label><span style='display: inline-block' id='innerSelectSubs'><span>");

  $(".monthly-dropdown-menu").empty();
  $("#innerSelectSubs").append('<select id="dem-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value="">ALL</option>'+
                              '<option value="deCommercial Deconstruction">Commercial Deconstruction</option>'+
                              '<option value="deResidential Deconstruction">Residential Deconstruction</option>'+
                              '<option value="deResidential Demolition">Residential Demolition</option></select>');

	console.log('*******  ',columnData,'  *******');

	$("#uniqueSelector").on('select', $(".monthly-dropdown-menu"),
                          function (){
                            var selectedSubtype = this.querySelector("div").querySelector("span").querySelector("div").querySelector("label").id;
                            console.log(selectedSubtype);
                            ToggleBarGraph(selectedSubtype, toggleSubtype);
                          });

	$('#Demolition').text('Totals');

	var clickHole = document.getElementById("toggleWithPieClick").querySelector("span").querySelector("div").querySelector("label");

	$(clickHole).on('click', null, columnData, function(e){

		console.log(columnData, clicker);

		if (clicker%2 == 0){

			if (config != 1){
				var coolum = window.returningObj;
				var daates = window.datesingArray;
				console.log(coolum);
				console.log(daates);
			}

			else {
				var coolum = columnData;
				var daates = datesArray;

				console.log(daates);

                var returnObjFunc = function(columnData){
				                	

				var	repacked =['Demolition'];
				var	prepacked = [0];
				suprepacked = [];
	                for (var i = 1; i<columnData[0].length ; i++){
	                	prepacked[i] = [];
	                	columnData.forEach(function(sub, inc){
	                		console.log(inc, prepacked[i]);
	                		suprepacked[i]=prepacked[i].push(sub[i]);
	                	})
	                }
	                
	                for (var i = 1; i<columnData[0].length ; i++){
	                	console.log(i);
	                	// console.log(prepacked[i]);
	                	repacked[i]=prepacked[i].reduce((a , b) => a + b, 0);
	                	// console.log(repacked);
	            	}
	                console.log(repacked);

	                return(repacked);

	            }

				console.log('STOP');
			}

			$('#bld-monthly-dropdown-menu').hide();
			$('#Demolition').text('Subtype(s)');

		    console.log(e);
		    console.log(e.target);


			function returnObjChart(returnObj, datesArray){
			    var chart = c3.generate({
			    bindto: '#byDay',
			    data: {
			      columns: 
			          [returnObj]
			      ,
			      type: 'bar',
			      colors: {
                 'Demolition': 'hsl(10, 30.2%, 42.2%)',
			      }
			    },
			    axis: {
			        y: {tick : {format: d3.format('d')}},
			        x: {
			        type: 'category',
			        categories: datesArray
			      }
			    }
			  });
			};     

			// console.log(returnObj(coolum));

			if (config == 1){
				coolum = returnObjFunc(coolum);
			}

			returnObjChart(coolum, daates);

		    }

   		   	else {

   		   		console.log('BREAK');

	          	if((config == 1) || (config > 6)){

			       	var chart = c3.generate({
			            bindto: '#byDay',
			            data: {
			              columns : columnData
			              ,
			              colors: {
			            	"Commercial Deconstruction": 'hsl(10, 30.2%, 12.2%)',
			            	"Residential Deconstruction": 'hsl(10, 30.2%, 42.2%)',
			            	"Residential Demolition": 'hsl(10, 30.2%, 72.2%)'
			              },
			              type: 'bar'//,
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

		       	else{
			        var chart = c3.generate({
			            bindto: '#byDay',
			            data: {
			              columns : weeklyColumnData
			              ,
			              type: 'bar'//,
			            },
			            colors: {
			            	"Commercial Deconstruction": 'hsl(10, 30.2%, 12.2%)',
			            	"Residential Deconstruction": 'hsl(10, 30.2%, 42.2%)',
			            	"Residential Demolition": 'hsl(10, 30.2%, 72.2%)'
			            },
			            axis: {
			                y: {tick : {format: d3.format('d')}},
			                x: {
			                type: 'category',
			                categories: window.datesingArray
			              	}
			            }
			        });
			    }

		    	$('#dem-monthly-dropdown-menu').show();

		    	$('#Demolition').text('Totals');
		    };



		  clicker++;

	  });

	return subtype;



};

window.Demolition = Demolition;