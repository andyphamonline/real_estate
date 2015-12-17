var express = require("express");
var router = express.Router();
var request = require("request");
var async = require("async");

router.get("/", function(req, res) {
	var data;
	// API GetSearchResults
	function fn1(callback) {
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
	          			if (!result['SearchResults:searchresults'].response) {	          			
	          				data = null;
	          				callback(null, data);	          				
	          			}
	          			else {
		          			data = result['SearchResults:searchresults'].response[0].results[0].result[0].zpid;
		          			callback(null, data);	          				
	          			}
	        		});       
	      		}
	    	}
	  	)	  	
	}

	//API GetComps
	function fn2(data, callback) {
		request(
			'http://www.zillow.com/webservice/GetDeepComps.htm?zws-id=' + process.env.ZILLOW_KEY + '&zpid=' + data + '&count=20',
			function(error, response, body) {
				if (!error && response.statusCode === 200) {				
					var parseString = require('xml2js').parseString;
					var xml = body;
					parseString(xml, function (err, result) {
						if (error) {
							console.log(error);
						}
						if (!result["Comps:comps"].response) {	          				
	          				data = null;
	          				callback(null, data);	          				
	          			}
	          			else {
		          			data = result["Comps:comps"].response[0].properties[0].comparables[0].comp;
		          			callback(null, data);	          				
	          			}
						
					});				
				}
				
			}
		)
	}

	async.waterfall([fn1, fn2], function(err, results) {
		if (results === null) {
			res.send(err);
		}
		else {
			res.send(results);
		}
	})
});

module.exports = router;