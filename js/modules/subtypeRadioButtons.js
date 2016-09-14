var SubtypeRadioButtons = function SubtypeRadioButtons(value, innerValue){

	 console.log(value);

      innerValue = $("#monthList-dropdown-menu option:selected").val();

      console.log($("#monthList-dropdown-menu option:selected").val());
      console.log(value);


      switch (value){
        case "bu":
        case "Bu":

          console.log(d.id);

          if (innerValue != ""){

            // var subtype = Building(innerValue);

            $("#innerSelectSubs").html('<select id="bld-monthly-dropdown-menu" class="monthly-dropdown-menu" oninput ="Building(value);"><option value="">ALL</option>'+
                        '<optgroup label="Residential">'+    
                        '<option value="buNRB">New Residence Building</option>'+
                        '<option value="buNew Residence">New Residence</option>'+
                        '<option value="buRA">Residential X Accessory</option>'+
                        '<option value="buResidential Accessory Building">Residential Accessory Building</option>'+
                        '<option value="buResidential Addition"">Residential Addition</option>'+
                        '<option value="buResidential Remodel">Residential Remodel</option></optgroup><optgroup label="Commercial">'+
                        '<option value="buCommercial Remodel">Commercial Remodel</option>'+
                        '<option value="buNCR">New Commercial Residence</option></optgroup><optgroup label="Agriculture">'+
                        '<option value="buAccessory Agricultural Building">Accessory Agriculture Building</option></optgroup>'+
                        '<option value="buobuild">Other</option></select>');
            clearDomElementUS();
          
          }

          Building(innerValue);

        break;

        case "de":
        case "De":


          if (innerValue !=""){

            // var subtype = Demolition(innerValue);

            $("#innerSelectSubs").html('<select id="dem-monthly-dropdown-menu" class="monthly-dropdown-menu" onchange ="SelectSubtype(value);"><option value="">ALL</option>'+
                      '<option value="deCommercial Deconstruction">Commercial Deconstruction</option>'+
                      '<option value="deResidential Deconstruction">Residential Deconstruction</option>'+
                      '<option value="deResidential Demolition">Residential Demolition</option></select>');
            clearDomElementUS();
          }

          Demolition(innerValue);

        break;

        case "el":
        case "El":


          if (innerValue != ""){

            // var subtype = Electrical(innerValue);

            $("#innerSelectSubs").html('<select id="elc-monthly-dropdown-menu" class="monthly-dropdown-menu" onchange ="SelectSubtype(value);"><option value="">ALL</option>'+
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

          Electrical(innerValue);

        break;

        case "me":
        case "Me":

          if (innerValue != ""){

            // var subtype = Mechanical(innerValue);

            $("#innerSelectSubs").html('<select id="mch-monthly-dropdown-menu" class="monthly-dropdown-menu" onchange ="SelectSubtype(value);"><option value="">ALL</option>'+
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

          Mechanical(innerValue);

        break;

        case "ot":
        case "Ot":

          if (innerValue != ""){

            // var subtype = Other(innerValue);

            $("#innerSelectSubs").html('<select id="oth-monthly-dropdown-menu" class="monthly-dropdown-menu" onchange ="SelectSubtype(value);"><option value="">ALL</option>'+
                    '<option value="otBridge">Bridge</option>'+
                    '<option value="otBuilding Lot Determination">Building Lot Determination</option>'+
                    '<option value="otOil and Gas Development">Oil and Gas Development</option></select>');
            clearDomElementUS();
          } 

          Other(innerValue);

        break;

        case "pl":
        case "Pl":

          if (innerValue != ""){

            // var subtype = Plumbing(innerValue);

            $("#innerSelectSubs").html('<select id="plm-monthly-dropdown-menu" class="monthly-dropdown-menu" onchange ="SelectSubtype(value);"><option value="">ALL</option>'+
                  '<option value="plWater Heater">Water Heater</option>'+
                  '<option value="plGas Piping">Gas Piping</option>'+
                  '<option value="plEldorado Springs Sanitation Hookup">Eldorado Springs Sanitation Hookup</option>'+
                  '<option value="plPlumbing - Other">Plumbing - Other</option></select>');
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