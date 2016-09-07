var ToggleBarGraph = function ToggleBarGraph(value , toggleCount, returnObj){

  console.log('fed up');
  console.log(returnObj);
  console.log(toggleSubtype);


  innerValue = $(".monthly-dropdown-menu option:selected").val();

  console.log($(".monthly-dropdown-menu option:selected").val());
  console.log(value);
  console.log(d.id, "+++++++++++++++");
  // console.log(value.target.id,"&&&&&&&&&&&&&");
  subtypeVar = value  || d.id;
  subtypeVar = subtypeVar.charAt(0)+subtypeVar.charAt(1);
  console.log(subtypeVar);


  if (toggleSubtype==0){
    SubtypeRadioButtons(subtypeVar);
    console.log(toggleSubtype);
    console.log("ZERO");
    toggleSubtype++;
  }



  else if (((toggleSubtype%2) == 0) && (returnObj)){
    console.log(subtypeVar);
    console.log(toggleSubtype);
    console.log("EVEN");


    // REMOVE CSS STYLE
    $('#toggleWithPieClick').empty();
    document.getElementById("toggleWithPieClick").innerHTML= ("<span>Graph options - toggle between: <div class='btn-group' data-toggle='buttons'><label class='btn btn-primary btn-inline' style = 'display: inline-block'><input type='radio' class='innerSelectSub' value='sub' autocomplete='off' id='" + subtypeVar + "'> Subtype(s) </label>");
    console.log('sqeak');

    var chart = c3.generate({
      bindto: '#byDay',
      data: {
        columns: [
            returnObj
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
      // grid: {y: {lines: [{value: AVERAGE}]}},
      axis: {
          y: {tick : {format: d3.format('d')}},
          x: {
          type: 'category',
          categories: datesArray
          }
      } 
    });
    toggleSubtype++; 

    
  }

  else {

    console.log("TOTALS");

    switch (subtypeVar){
      case "b":
      case "B":
        var subtype = Building(innerValue);

        console.log(subtype);


        if (innerValue != ""){

          $("#innerSelectSubs").html('<select id="bld-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value="">ALL</option>'+
            '<optgroup label="Residential">'+    
            '<option value="buNRB">New Residence Building</option>'+
            '<option value="buNew Residence">New Residence</option>'+
            '<option value="buRA">Residential Accessory</option>'+
            '<option value="buResidential Accessory Building">Residential Accessory Building</option>'+
            '<option value="buResidential Addition"">Residential Addition</option>'+
            '<option value="buResidential Remodel">Residential Remodel</option></optgroup><optgroup label="Commercial">'+
            '<option value="buCommercial Remodel">Commercial Remodel</option>'+
            '<option value="buNCR">New Commercial Residence</option></optgroup><optgroup label="Agriculture">'+
            '<option value="buAccessory Agricultural Building">Accessory Agriculture Building</option></optgroup>'+
            '<option value="buobuild">Other</option></select>');                          
          clearDomElementUS();
        }

      break;

      case "d":
      case "D":
        var subtype = Demolition(innerValue);

        if (innerValue !=""){
          $("#innerSelectSubs").html('<select id="dem-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value="">ALL</option>'+
            '<option value="deCommercial Deconstruction">Commercial Deconstruction</option>'+
            '<option value="deResidential Deconstruction">Residential Deconstruction</option>'+
            '<option value="deResidential Demolition">Residential Demolition</option></select>');
         clearDomElementUS();
        }

      break;



      case "e":
      case "E":
        var subtype = Electrical(innerValue);

        if (innerValue != ""){
          $("#innerSelectSubs").html('<select id="elc-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value="">ALL</option>'+
            '<option value="elCommercial Electric">Commercial Electric</option>'+
            '<option value="elElectrical Lift Station">Electrical Lift Station</option>'+
            '<option value="elElectrical Re-Wiring">Electrical Re-Wiring</option>'+
            '<option value="elElectrical Service Change">Electrical Service Change</option>'+
            '<option value="elTemporary Electrical Service">Temporary Electrical Service</option>'+
            '<option value="elGenerator">Generator</option>'+
            '<option value="elSolar Electrical System">Solar Electrical System</option>'+
            '<option value="elElectrical Other">Electical Other</option></select>');
          clearDomElementUS();
        }


      break;

      case "m":
      case "M":
        var subtype = Mechanical(innerValue);

        if (innerValue != ""){
          $("#innerSelectSubs").html('<select id="mch-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value="">ALL</option>'+
            '<option value="meAir Conditioning">Air Conditioning</option>'+
            '<option value="meBoiler">Boiler</option>'+
            '<option value="meEvaportive Cooler">Evaporative Cooler</option>'+
            '<option value="meFurnace">Furnace</option>'+
            '<option value="meGas Log Fireplace">Gas / Log Fireplace</option>'+
            '<option value="meWood Stove">Wood Stove</option>'+
            '<option value="meSolar Thermal">Solar Thermal</option>'+
            '<option value="meMechanical - Other">Other</option></select>');
          clearDomElementUS();
        }


      break;

      case "o":
      case "O":
        var subtype = Other(innerValue);

        if (innerValue != ""){
          $("#innerSelectSubs").html('<select id="oth-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value="">ALL</option>'+
            '<option value="otBridge">Bridge</option>'+
            '<option value="otBuilding Lot Determination">Building Lot Determination</option>'+
            '<option value="otOil and Gas Development">Oil and Gas Development</option></select>');
          clearDomElementUS();
        } 


      break;

      case "p":
      case "P":
        var subtype = Plumbing(innerValue);

        if (innerValue != ""){
          $("#innerSelectSubs").html('<select id="plm-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value="">ALL</option>'+
            '<option value="plWater Heater">Water Heater</option>'+
            '<option value="plGas Piping">Gas Piping</option>'+
            '<option value="plEldorado Springs Sanitation Hookup">Eldorado Springs Sanitation Hookup</option>'+
            '<option value="plPlumbing - Other">Plumbing - Other</option></select>');
          clearDomElementUS();
        }


      break;

      default:
        console.log("no subtypes");
      break;

    }

  toggleSubtype++;


  }


return (returnObj);

}


window.ToggleBarGraph = ToggleBarGraph;
