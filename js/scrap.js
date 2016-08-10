      switch (d.id){
                case 'Building':
                  $('#toggleWithPieClick').html(' Applications by Day over last Month <select id="monthly-dropdown-menu" onchange ="selectSubtype(value);"><option value="">ALL</option>'+
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
                break;

                case 'Mechanical':
                  $('#toggleWithPieClick').html(' Applications by Day over last Month <select id="monthly-dropdown-menu" onchange ="selectSubtype(value);"><option value="">ALL</option>'+
                                '<option value="mac">Air Conditioning</option>'+
                                '<option value="mboil">Boiler</option>'+
                                '<option value="mevap">Evaporative Cooler</option>'+
                                '<option value="mfurnace">Furnace</option>'+
                                '<option value="mg-l-fire">Gas / Log Fireplace</option>'+
                                '<option value="mstove">Wood Stove</option>'+
                                '<option value="msolar">Solar Thermal</option>'+
                                '<option value="momech">Other</option></select>');
                break;

                case 'Electrical':
                  $('#toggleWithPieClick').html(' Applications by Day over last Month <select id="monthly-dropdown-menu" onchange ="selectSubtype(value);"><option value="">ALL</option>'+
                                '<option value="ecom">Commercial Electric</option>'+
                                '<option value="els">Electrical Lift Station</option>'+
                                '<option value="erewire">Electrical Re-Wiring</option>'+
                                '<option value="eservice">Electrical Service Change</option>'+
                                '<option value="etemp">Temporary Electrical Service</option>'+
                                '<option value="egen">Generator</option>'+
                                '<option value="esolar">Solar Electrical System</option>'+
                                '<option value="eoelec">Other</option></select>');
                break;

                case 'Plumbing':
                  $('#toggleWithPieClick').html(' Applications by Day over last Month <select id="monthly-dropdown-menu" onchange ="selectSubtype(value);"><option value="">ALL</option>'+
                                '<option value="pheat">Water Heater</option>'+
                                '<option value="pgas">Gas Piping</option>'+
                                '<option value="phook">Eldorado Springs Sanitation Hookup</option>'+
                                '<option value="poplum">Plumbing - Other</option></select>');
                break;

                case 'Demolition':
                  $('#toggleWithPieClick').html(' Applications by Day over last Month <select id="monthly-dropdown-menu" onchange ="selectSubtype(value);"><option value="">ALL</option>'+
                                '<option value="dcomm">Commercial Deconstruction</option>'+
                                '<option value="dresdecon">Residential Deconstruction</option>'+
                                '<option value="dresdemo">Residential Demolition</option></select>');
                break;

                case 'Other':
                  $('#toggleWithPieClick').html(' Applications by Day over last Month <select id="monthly-dropdown-menu" onchange ="selectSubtype(value);"><option value="">ALL</option>'+
                                '<option value="obridge">Bridge</option>'+
                                '<option value="olot">Building Lot Determination</option>'+
                                '<option value="ooilngas">Oil and Gas Development</option></select>'); 


                default:
                  console.log(d.id);
                break;
              }