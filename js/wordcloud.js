var resourceId = "d914e871-21df-4800-a473-97a2ccdf9690";
//var baseURI = "http://www.civicdata.com/api/action/datastore_search_sql?sql=";
var baseURI = "http://www.civicdata.com/api/action/datastore_search_sql?sql=";

// Helper function to make request for JSONP.
function requestJSON(url, callback) {
  $.ajax({
    beforeSend: function() {
      // Handle the beforeSend event
    },
    url: url,
    complete: function(xhr) {
      callback.call(null, xhr.responseJSON);
      $('.canvas').show();
      $('#loading').hide();
       
    }
  });
}

var dateCalc = moment().subtract(12, 'M').format("YYYY-MM-DD");
var permitDescQuery = "SELECT \"Description\" from \"resource_id\" WHERE \"IssuedDate\" >= \'" + dateCalc + "\'";
var permitDesc = baseURI + encodeURIComponent(permitDescQuery.replace("resource_id", resourceId));

requestJSON(permitDesc, function(json) {
    var descriptions = json.result.records;

    var descString = "";
    descriptions.forEach(function(d) {
      descString += d.Description + " ";
    });

    var descArray = descString.split(" ");

    var descObjects = [];
    descArray.forEach(function(d) {
      if (!isNumeric(d) && !matches(d, "AND", "OF", "TO", "", "&", "ON", "-", "THE", "IN", "BE", "FOR", "A")) {
        var descObject = {}
        descObject.description = d;
        descObjects.push(descObject);
      }
    });
              
    var wordCount = d3.nest()
      .key(function(d) { return d.description; })
      .rollup(function(v) { return v.length; })
      .entries(descObjects);

    wordCount.sort(function(a, b) {
      return b.values - a.values;
    });    

    var tags = [];

    wordCount.forEach(function(d) {
      tags.push([d.key, parseInt(d.values)]);
    });

    tags = tags.slice(0, 1000);

    WordCloud(document.getElementById('cloud'), {
      gridSize: 12, 
      weightFactor: 2, 
      rotateRatio: 0.5,
      list : tags.map(function(word) { return [word[0], Math.round(word[1] / 10)]; }), 
      wait: 10
    });

    console.log(tags.map(function(word) { return [word[0], Math.round(word[1] / 2)]; }));
    //console.log(tagMap);
    
    var clicked = function(ev) {
      if (ev.target.nodeName === "SPAN") {
        var tag = ev.target.textContent;
        var tagElem;
        if (tags.some(function(el) { if (el[0] === tag) {tagElem = el; return true;} return false; })) {
          document.getElementById("details").innerText = "There were " + tagElem[1] + 
              " mentions of “" + tag + "” in the last year";
        }
      } else {
        document.getElementById("details").innerText = "";
      }
    }
    document.getElementById("cloud").addEventListener("click", clicked)
      
  });

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function matches(eVal, argList) {
  for (var i = 1; i < arguments.length; i++)
   if (arguments[i] == eVal)
     return true;
}
