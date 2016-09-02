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
  subtypeVar = subtypeVar.charAt(0);
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
            '<option value="bNRB">New Residence Building</option>'+
            '<option value="bNew Residence">New Residence</option>'+
            '<option value="bRA">Residential Accessory</option>'+
            '<option value="bResidential Accessory Building">Residential Accessory Building</option>'+
            '<option value="bResidential Addition"">Residential Addition</option>'+
            '<option value="bResidential Remodel">Residential Remodel</option></optgroup><optgroup label="Commercial">'+
            '<option value="bCommercial Remodel">Commercial Remodel</option>'+
            '<option value="bNCR">New Commercial Residence</option></optgroup><optgroup label="Agriculture">'+
            '<option value="bAccessory Agricultural Building">Accessory Agriculture Building</option></optgroup>'+
            '<option value="bobuild">Other</option></select>');                          
          clearDomElementUS();
        }

      break;

      case "d":
      case "D":
        var subtype = Demolition(innerValue);

        if (innerValue !=""){
          $("#innerSelectSubs").html('<select id="dem-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value="">ALL</option>'+
            '<option value="dCommercial Deconstruction">Commercial Deconstruction</option>'+
            '<option value="dResidential Deconstruction">Residential Deconstruction</option>'+
            '<option value="dResidential Demolition">Residential Demolition</option></select>');
         clearDomElementUS();
        }

      break;



      case "e":
      case "E":
        var subtype = Electrical(innerValue);

        if (innerValue != ""){
          $("#innerSelectSubs").html('<select id="elc-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value="">ALL</option>'+
            '<option value="eCommercial Electric">Commercial Electric</option>'+
            '<option value="eElectrical Lift Station">Electrical Lift Station</option>'+
            '<option value="eElectrical Re-Wiring">Electrical Re-Wiring</option>'+
            '<option value="eElectrical Service Change">Electrical Service Change</option>'+
            '<option value="eTemporary Electrical Service">Temporary Electrical Service</option>'+
            '<option value="eGenerator">Generator</option>'+
            '<option value="eSolar Electrical System">Solar Electrical System</option>'+
            '<option value="eElectrical Other">Electical Other</option></select>');
          clearDomElementUS();
        }


      break;

      case "m":
      case "M":
        var subtype = Mechanical(innerValue);

        if (innerValue != ""){
          $("#innerSelectSubs").html('<select id="mch-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value="">ALL</option>'+
            '<option value="mAir Conditioning">Air Conditioning</option>'+
            '<option value="mBoiler">Boiler</option>'+
            '<option value="mEvaportive Cooler">Evaporative Cooler</option>'+
            '<option value="mFurnace">Furnace</option>'+
            '<option value="mGas Log Fireplace">Gas / Log Fireplace</option>'+
            '<option value="mWood Stove">Wood Stove</option>'+
            '<option value="mSolar Thermal">Solar Thermal</option>'+
            '<option value="mMechanical - Other">Other</option></select>');
          clearDomElementUS();
        }


      break;

      case "o":
      case "O":
        var subtype = Other(innerValue);

        if (innerValue != ""){
          $("#innerSelectSubs").html('<select id="oth-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value="">ALL</option>'+
            '<option value="oBridge">Bridge</option>'+
            '<option value="oBuilding Lot Determination">Building Lot Determination</option>'+
            '<option value="oOil and Gas Development">Oil and Gas Development</option></select>');
          clearDomElementUS();
        } 


      break;

      case "p":
      case "P":
        var subtype = Plumbing(innerValue);

        if (innerValue != ""){
          $("#innerSelectSubs").html('<select id="plm-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="SelectSubtype(value);"><option value="">ALL</option>'+
            '<option value="pWater Heater">Water Heater</option>'+
            '<option value="pGas Piping">Gas Piping</option>'+
            '<option value="pEldorado Springs Sanitation Hookup">Eldorado Springs Sanitation Hookup</option>'+
            '<option value="pPlumbing - Other">Plumbing - Other</option></select>');
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
