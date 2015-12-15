var express = require("express");
var router = express.Router();
var request = require("request");
var async = require("async");


router.get("/", function(req, res) {
	var data;
	// API GetSearchResults
	function fn1(callback) {
		// console.log("*****************top of fn 1", data);
		var url = 'http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=' + process.env.ZILLOW_KEY + "&address=" + req.query.address + "&citystatezip=" + req.query.citystatezip;
	    request(
	    	url,
	    	function(error, response, body) {
	      		if (!error && response.statusCode === 200) {        
	        		var parseString = require('xml2js').parseString;
	        		var xml = body;
	        		parseString(xml, function (err, result) {
	          			if (error) {
	            			console.log(error);
	          			}
	          			data = result["SearchResults:searchresults"].response[0].results[0].result[0].zpid;
	          			// console.log("*****************data at bottom of fn 1", data);
	          			callback(null, data);
	        		});       
	      		}
	    	}
	  	)	  	
	}

	//API GetComps
	function fn2(data, callback) {
		// console.log("*****************data at top of fn 2: ", data);
		request(
			'http://www.zillow.com/webservice/GetComps.htm?zws-id=' + process.env.ZILLOW_KEY + '&zpid=' + data + '&count=20',
			function(error, response, body) {
				if (!error && response.statusCode === 200) {				
					var parseString = require('xml2js').parseString;
					var xml = body;
					parseString(xml, function (err, result) {
						if (error) {
							console.log(error);
						}
	            		//res.send(result);
	            		//console.log("*****************result: ", result);
						data = result["Comps:comps"].response[0].properties[0].comparables[0].comp;
						//console.log("*****************data at bottom of fn 2: ", data);
						callback(null, data);
					});				
				}
			}
		)
		
	}

	async.waterfall([fn1, fn2], function(err, results) {
		// console.log("*****************results at async: ", results);
		res.send(results);
	})
});

module.exports = router;