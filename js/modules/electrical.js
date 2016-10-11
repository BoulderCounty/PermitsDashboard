var Electrical = function Electrical(config, configTime){
	console.log("START:", config);
	var clicker = 0;
	var records = [];
	var columnData = [];


	var configTime = (configTime || 12);
	console.log(configTime);


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
		    var elecRecords = clone(records);
		    var timeRecords = clone(records);

		    console.log(elecRecords, "#");

			switch ($("#monthList-dropdown-menu").val().slice(11)){

		  		case '1':
		    		elecRecords.forEach(function(record, inc, array) {
		     		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
		    	});

		    		weeklyBunch =[];
		  		break;
		     
		  		default:
		   			elecRecords.forEach(function(record, inc, array) {
		    		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
		  			});

		  			 weeklyBunch = [];


                    for (var  i = 0; i<elecRecords.length; i++){
                      var then = elecRecords[i].AppliedDate;


                      var ago = moment(then);
                      var weeksAgoLabel = ago.startOf('isoWeek').format('MMM-DD-YY');
                      weeklyBunch.push([timeRecords[i]["AppliedDate"], weeksAgoLabel]);


                    };

                    console.log(weeklyBunch);

		  	}; 
//
//  NEED TO ADD TO OTHER TYPES
//
		  	var initialStartDate = $("#monthList-dropdown-menu").val().slice(11);

			if (initialStartDate > 6) {
	        	initialStartDate = (parseInt(initialStartDate) + 1);
	        	elecRecords.forEach(function(record, inc, array) {
		    		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
		  		});
            }

		  	var startDateMoment = moment().subtract(initialStartDate, 'M');

		  	var weekStartDateMoment =  moment().subtract(initialStartDate, 'M').startOf('isoWeek');
            console.log(weekStartDateMoment);


		 	console.log(startDateMoment);

			var appliedLast365Days = elecRecords.filter(function(d) { 
			   return moment(d.AppliedDate) > startDateMoment; 
			});

			 var appliedPerWeekSelectedDays = weeklyBunch.filter(function(d) {
	              return (moment(d[0]) > weekStartDateMoment);
	            });

			 console.log(appliedPerWeekSelectedDays);


		  	permitTypes=[];


			//Get a distinct list of neighborhoods
			for (var i = 0; i < elecRecords.length; i++) {
			    permitTypes.push([elecRecords[i]["PermitType"], elecRecords[i].count]);
			}

			if (configTime != 1){				
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


			var appliedLast365Days = elecRecords.filter(function(d) { 
			   return moment(d.AppliedDate) > startDateMoment; 
			});


		  	var appliedLastYearByType = appliedLast365Days.filter(function(o) {
		    	return o.PermitTypeMapped === "Electrical";
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



		    var subtypes = ["Commercial Electric", "Electrical Lift Station", "Electrical Re-Wiring", "Electrical Service Change", "Temporary Electrical Service", "Generator", "Solar Electrical System", "Other"];
		     
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



	       if((configTime == 1) || (configTime > 6)){

	       	console.log('SATURATION');

		       var chart = c3.generate({
		            bindto: '#byDay',
		            data: {
		              columns : columnData
		              ,
		              colors :{
		              	 "Commercial Electric": 'hsl(360, 69.2%, 19.6%)',
	                     "Electrical Lift Station" : 'hsl(360, 69.2%, 29.6%)',
	                     "Electrical Re-Wiring": 'hsl(360, 69.2%, 39.6%)',
	                     "Electrical Service Change": 'hsl(360, 69.2%, 49.6%)',
	                     "Temporary Electrical Service": 'hsl(360, 69.2%, 59.6%)',
	                     "Generator": 'hsl(360, 69.2%, 69.6%)',
	                     "Solar Electrical System": 'hsl(360, 69.2%, 79.6%)',
	                     "Other": 'hsl(360, 69.2%, 89.6%)'
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
		              colors :{
		              	 "Commercial Electric": 'hsl(360, 69.2%, 19.6%)',
	                     "Electrical Lift Station" : 'hsl(360, 69.2%, 29.6%)',
	                     "Electrical Re-Wiring": 'hsl(360, 69.2%, 39.6%)',
	                     "Electrical Service Change": 'hsl(360, 69.2%, 49.6%)',
	                     "Temporary Electrical Service": 'hsl(360, 69.2%, 59.6%)',
	                     "Generator": 'hsl(360, 69.2%, 69.6%)',
	                     "Solar Electrical System": 'hsl(360, 69.2%, 79.6%)',
	                     "Other": 'hsl(360, 69.2%, 89.6%)'
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
	$("#innerSelectSubs").append('<select id="elc-monthly-dropdown-menu" class="monthly-dropdown-menu" onmouseup ="SelectSubtype(value);"><option value="">ALL</option>'+
	                '<option value="elCommercial Electric">Commercial Electric</option>'+
	                '<option value="elElectrical Lift Station">Electrical Lift Station</option>'+
	                '<option value="elElectrical Re-Wiring">Electrical Re-Wiring</option>'+
	                '<option value="elElectrical Service Change">Electrical Service Change</option>'+
	                '<option value="elTemporary Electrical Service">Temporary Electrical Service</option>'+
	                '<option value="elGenerator">Generator</option>'+
	                '<option value="elSolar Electrical System">Solar Electrical System</option>'+
	                '<option value="elElectrical Other">Electical Other</option></select>');

	console.log('*******  ',columnData,'  *******');

	$("#uniqueSelector").on('select', $(".monthly-dropdown-menu"),
                          function (){
                            var selectedSubtype = this.querySelector("div").querySelector("span").querySelector("div").querySelector("label").id;
                            console.log(selectedSubtype);
                            ToggleBarGraph(selectedSubtype, toggleSubtype);
                          });

	$('#Electical').text('Totals');

	var clickHole = document.getElementById("toggleWithPieClick").querySelector("span").querySelector("div").querySelector("label");

	$(clickHole).on('click', null, columnData, function(e){

		console.log(columnData, clicker);

		if (clicker%2 != 0){

			if (configTime != 1){
				var coolum = window.weeklyReturningObj;
				var daates = window.datesingArray;
				console.log(coolum);
				console.log(daates);

				$('#elc-monthly-dropdown-menu').hide();
				$('#Electrical').text('Subtype(s)');


				clicker++;


			}

			else {
				var coolum = columnData;
				var daates = datesArray;

				console.log(daates);

                var returnObjFunc = function(columnData){
				                	

				var	repacked =['Electrical'];
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
	                	repacked[i] = prepacked[i].reduce(function(pv, cv, i, ar) {return pv+cv});
	                	// repacked[i]=prepacked[i].reduce((a , b) => a + b, 0);
	                	// console.log(repacked);
	            	}
	                console.log(repacked);

	                return(repacked);

	            }

				console.log('STOP');
			}

		    console.log(e);
		    console.log(e.target);

			$('#elc-monthly-dropdown-menu').hide();
			$('#Electrical').text('Subtype(s)');

			function returnObjChart(returnObj, datesArray){
			    var chart = c3.generate({
			    bindto: '#byDay',
			    data: {
			      columns: 
			          [returnObj]
			      ,
			      type: 'bar',
			      colors: {
                   'Electrical': 'hsl(360, 69.2%, 49.6%)',
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

			if (configTime == 1){
				coolum = returnObjFunc(coolum);
			}

			returnObjChart(coolum, daates);

	  			// clicker++;

		    }

   		   	else {

   		   		console.log('BREAK');
				$('#elc-monthly-dropdown-menu').show();


	          	if((configTime == 1) || (configTime > 6)){

			       	var chart = c3.generate({
			            bindto: '#byDay',
			            data: {
			              columns : columnData
			              ,
			              colors :{
			              	 "Commercial Electric": 'hsl(360, 69.2%, 19.6%)',
		                     "Electrical Lift Station" : 'hsl(360, 69.2%, 29.6%)',
		                     "Electrical Re-Wiring": 'hsl(360, 69.2%, 39.6%)',
		                     "Electrical Service Change": 'hsl(360, 69.2%, 49.6%)',
		                     "Temporary Electrical Service": 'hsl(360, 69.2%, 59.6%)',
		                     "Generator": 'hsl(360, 69.2%, 69.6%)',
		                     "Solar Electrical System": 'hsl(360, 69.2%, 79.6%)',
		                     "Other": 'hsl(360, 69.2%, 89.6%)'
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

	  			clicker++;


			    }

		       	else{
			        var chart = c3.generate({
			            bindto: '#byDay',
			            data: {
			              columns : weeklyColumnData
			              ,
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


	  			// clicker++;

		    	$('#elc-monthly-dropdown-menu').show();

		    	$('#Electrical').text('Totals');
		    };




	  });


	  if (clicker == 0){
	  	clicker++;
	  };

	return subtype;



};

window.Electrical = Electrical;