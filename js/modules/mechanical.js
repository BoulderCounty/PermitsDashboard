var Mechanical = function Mechanical (config){
	        
	var records = [];



	      /********************************************************************************/
	      /*
		  /*  DATA GRAB
	      /*
	      /********************************************************************************/

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


		    var columnData=[];
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


		    var columnData=[];
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

	}

	$("#innerSelectSubs").html('<select id="mch-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value="">ALL</option>'+
	                '<option value="mAir Conditioning">Air Conditioning</option>'+
	                '<option value="mBoiler">Boiler</option>'+
	                '<option value="mEvaportive Cooler">Evaporative Cooler</option>'+
	                '<option value="mFurnace">Furnace</option>'+
	                '<option value="mGas Log Fireplace">Gas / Log Fireplace</option>'+
	                '<option value="mWood Stove">Wood Stove</option>'+
	                '<option value="mSolar Thermal">Solar Thermal</option>'+
	                '<option value="mMechanical - Other">Other</option></select>');

	return subtype;

};

window.Mechanical = Mechanical;