var express = require("express");
var router = express.Router();
var request = require("request");


// API GetSearchResults works!!!
router.get("/", function(req, res) {
	var url = 'http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=' + process.env.ZILLOW_KEY + "&address=" + req.query.address + "&citystatezip=" + req.query.citystatezip;
  request(
    url,
    function(error, response, body) {
      // console.log(body);
      if (!error && response.statusCode === 200) {        
        var parseString = require('xml2js').parseString;
        var xml = body;
        parseString(xml, function (err, result) {
          if (error) {
            console.log(error);
          }
          // console.log(result);
          res.send(result);
          var data = result["SearchResults:searchresults"].response[0].results[0].result[0].zpid;
        });       
      }
    }
  ).then(
  	request(
		'http://www.zillow.com/webservice/GetComps.htm?zws-id=' + process.env.ZILLOW_KEY + '&zpid=48749425&count=2',
		function(error, response, body) {
			if (!error && response.statusCode === 200) {				
				var parseString = require('xml2js').parseString;
				var xml = body;
				parseString(xml, function (err, result) {
					if (error) {
						console.log(error);
					}
					var data = result["Comps:comps"].response[0].properties[0].comparables[0].comp;
				    // res.render("index", {data:data});
            res.send(result);
				});				
			}
		}
	)
  )
});

module.exports = router;