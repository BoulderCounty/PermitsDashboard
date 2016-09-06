var Mechanical = function Mechanical (config){

	var clicker = [];	        
	var records = [];
	var columnData = [];



	      /********************************************************************************/
	      /*
		  /*  DATA GRAB
	      /*
	      /********************************************************************************/

	check = function(config){

		if (!config){

			var grabLast365 = PermitDashboard.cache.last365;
			console.log(grabLast365);

			requestJSONa(grabLast365, function(json) {

		        var records = json.records;
	            var mechRecords = clone(records); 

			    console.log(mechRecords, "#");

				switch (document.getElementById('monthList-dropdown-menu').value){

			  		case '1':
			    		mechRecords.forEach(function(record, inc, array) {
			     		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
			    	});
			  		break;
			     
			  		default:
			   			mechRecords.forEach(function(record, inc, array) {
			    		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
			  		})   

			  	}; 

			  	var initialStartDate = document.getElementById('monthList-dropdown-menu').value;

			  	var startDateMoment = moment().subtract(initialStartDate, 'M');

			 	console.log(startDateMoment);

				var appliedLast365Days = mechRecords.filter(function(d) { 
				   return moment(d.AppliedDate) > startDateMoment; 
				});




			  	var appliedLastYearByType = appliedLast365Days.filter(function(o) {
			    	return o.PermitTypeMapped === "Mechanical";
			  	});

			  	permitTypes=[];

				//Get a distinct list of neighborhoods
				for (var i = 0; i < mechRecords.length; i++) {
				    permitTypes.push([mechRecords[i]["PermitType"], mechRecords[i].count]);
				}


				var appliedLast365Days = mechRecords.filter(function(d) { 
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

			    var subtypes = ["Air Conditioning","Boiler","Evaporative Cooler","Furnace","Gas Log Fireplace","Other","Wood Stove","Solar Thermal"];
			     
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

		else {

			var grabLast365 = PermitDashboard.cache.last365;

			config = config.slice(1);

			requestJSONa(grabLast365, function(json) {

	            var records = json.records;
	            var mechRecords = clone(records); 

			    console.log(mechRecords, "#");

				switch (document.getElementById('monthList-dropdown-menu').value){

			  		case '1':
			    		mechRecords.forEach(function(record, inc, array) {
			     		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM-DD');
			    	});
			  		break;
			     
			  		default:
			   			mechRecords.forEach(function(record, inc, array) {
			    		record.AppliedDate = moment(record.AppliedDate).format('YYYY-MM');
			  		})   

			  	}; 

			  	var initialStartDate = document.getElementById('monthList-dropdown-menu').value;

			  	var startDateMoment = moment().subtract(initialStartDate, 'M');

			 	console.log(startDateMoment);

				var appliedLast365Days = mechRecords.filter(function(d) { 
				   return moment(d.AppliedDate) > startDateMoment; 
				});




			  	var appliedLastYearByType = appliedLast365Days.filter(function(o) {
			    	return o.PermitTypeMapped === "Mechanical";
			  	});

			  	permitTypes=[];

				//Get a distinct list of neighborhoods
				for (var i = 0; i < mechRecords.length; i++) {
				    permitTypes.push([mechRecords[i]["PermitType"], mechRecords[i].count]);
				}


				var appliedLast365Days = mechRecords.filter(function(d) { 
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
	$("#innerSelectSubs").append('<select id="mch-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value="">ALL</option>'+
	                '<option value="meAir Conditioning">Air Conditioning</option>'+
	                '<option value="meBoiler">Boiler</option>'+
	                '<option value="meEvaporative Cooler">Evaporative Cooler</option>'+
	                '<option value="meFurnace">Furnace</option>'+
	                '<option value="meGas Log Fireplace">Gas / Log Fireplace</option>'+
	                '<option value="meWood Stove">Wood Stove</option>'+
	                '<option value="meSolar Thermal">Solar Thermal</option>'+
	                '<option value="meMechanical - Other">Other</option></select>');


	 $("#uniqueSelector").on('select', $(".monthly-dropdown-menu"),
                          function (){
                            var selectedSubtype = this.querySelector("div").querySelector("span").querySelector("div").querySelector("label").id;
                            console.log(selectedSubtype);
                            ToggleBarGraph(selectedSubtype, toggleSubtype);
                          });

	$('#Mechanical').text('Totals');

	var clickHole = document.getElementById("toggleWithPieClick").querySelector("span").querySelector("div").querySelector("label");


	$(clickHole).on('click', null, columnData, function(e){

	console.log(columnData);

	if (clicker%2 == 0){

		$('#mch-monthly-dropdown-menu').hide();
		$('#Mechanical').text('Subtype(s)');

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

	    	$('#mch-monthly-dropdown-menu').show();

	    	$('#Mechanical').text('Totals');
	    };


  	    clicker++;

    });

  return subtype;

};

window.Mechanical = Mechanical;