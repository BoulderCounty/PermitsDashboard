var SubtypeRadioButtons = function SubtypeRadioButtons(value){

	 console.log('change radio');

      innerValue = $(".monthList-dropdown-menu option:selected").val();

      console.log($(".monthList-dropdown-menu option:selected").val());
      console.log(value);


      switch (value){
        case "b":
        case "B":

          console.log(d.id);

          if (innerValue != ""){

            // var subtype = Building(innerValue);

            $("#innerSelectSubs").html('<select id="bld-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="Building(value);"><option value="">ALL</option>'+
                        '<optgroup label="Residential">'+    
                        '<option value="bNRB">New Residence Building</option>'+
                        '<option value="bNew Residence">New Residence</option>'+
                        '<option value="bRA">Residential X Accessory</option>'+
                        '<option value="bResidential Accessory Building">Residential Accessory Building</option>'+
                        '<option value="bResidential Addition"">Residential Addition</option>'+
                        '<option value="bResidential Remodel">Residential Remodel</option></optgroup><optgroup label="Commercial">'+
                        '<option value="bCommercial Remodel">Commercial Remodel</option>'+
                        '<option value="bNCR">New Commercial Residence</option></optgroup><optgroup label="Agriculture">'+
                        '<option value="bAccessory Agricultural Building">Accessory Agriculture Building</option></optgroup>'+
                        '<option value="bobuild">Other</option></select>');
            clearDomElementUS();
          
          }

          Building(innerValue);

        break;

        case "d":
        case "D":


          if (innerValue !=""){

            // var subtype = Demolition(innerValue);

            $("#innerSelectSubs").html('<select id="dem-monthly-dropdown-menu" class="monthly-dropdown-menu" onchange ="SelectSubtype(value);"><option value="">ALL</option>'+
                      '<option value="dCommercial Deconstruction">Commercial Deconstruction</option>'+
                      '<option value="dResidential Deconstruction">Residential Deconstruction</option>'+
                      '<option value="dResidential Demolition">Residential Demolition</option></select>');
            clearDomElementUS();
          }

          Demolition(innerValue);

        break;

        case "e":
        case "E":


          if (innerValue != ""){

            // var subtype = Electrical(innerValue);

            $("#innerSelectSubs").html('<select id="elc-monthly-dropdown-menu" class="monthly-dropdown-menu" onchange ="SelectSubtype(value);"><option value="">ALL</option>'+
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

          Electrical(innerValue);

        break;

        case "m":
        case "M":

          if (innerValue != ""){

            // var subtype = Mechanical(innerValue);

            $("#innerSelectSubs").html('<select id="mch-monthly-dropdown-menu" class="monthly-dropdown-menu" onchange ="SelectSubtype(value);"><option value="">ALL</option>'+
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

          Mechanical(innerValue);

        break;

        case "o":
        case "O":

          if (innerValue != ""){

            // var subtype = Other(innerValue);

            $("#innerSelectSubs").html('<select id="oth-monthly-dropdown-menu" class="monthly-dropdown-menu" onchange ="SelectSubtype(value);"><option value="">ALL</option>'+
                    '<option value="oBridge">Bridge</option>'+
                    '<option value="oBuilding Lot Determination">Building Lot Determination</option>'+
                    '<option value="oOil and Gas Development">Oil and Gas Development</option></select>');
            clearDomElementUS();
          } 

          Other(innerValue);

        break;

        case "p":
        case "P":

          if (innerValue != ""){

            // var subtype = Plumbing(innerValue);

            $("#innerSelectSubs").html('<select id="plm-monthly-dropdown-menu" class="monthly-dropdown-menu" onchange ="SelectSubtype(value);"><option value="">ALL</option>'+
                  '<option value="pWater Heater">Water Heater</option>'+
                  '<option value="pGas Piping">Gas Piping</option>'+
                  '<option value="pEldorado Springs Sanitation Hookup">Eldorado Springs Sanitation Hookup</option>'+
                  '<option value="pPlumbing - Other">Plumbing - Other</option></select>');
            clearDomElementUS();
          }

          Plumbing(innerValue);

        break;

        default:
          console.log("no subtypes");

        break;

  	}
    return;
  };

  window.SubtypeRadioButtons = SubtypeRadioButtons;