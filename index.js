var express = require("express");
var app = express();
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var request = require("request");
var expressJWT =require("express-jwt");
var jwt = require("jsonwebtoken");
var path = require("path");
var port = process.env.PORT || 3000;

var secret = "mysecretpassword";
var User = require("./models/user");

app.use(ejsLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine', 'ejs');

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/real_estate");

app.use("/api/properties", expressJWT({secret: secret}));
// app.use("/api/search", expressJWT({secret: secret}));
//it won't let me login
// app.use('/api/users', expressJWT({secret: secret})
// .unless({path: ['/api/users'], method: 'post'}));



app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({message: 'You need an authorization token to view this information.'})
  }
});

app.use("api/properties", require("./controllers/property"));
app.use('/api/users', require('./controllers/users'));
app.use("/api/search", require("./controllers/search"));



app.post('/api/auth', function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (err || !user) return res.send({message: 'User not found'});
    user.authenticated(req.body.password, function(err, result) {
      if (err || !result) return res.send({message: 'User not authenticated'});

      var token = jwt.sign(user, secret);
      res.send({user: user, token: token});
    });
  });
});

// // API GetSearchResults works!!!
// app.get("/foobar", function(req, res) {
//   console.log("******** root? *********");
//   request(
//     'http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=' + process.env.ZILLOW_KEY + '&address=2114+Bigelow+Ave&citystatezip=Seattle%2C+WA',
//     function(error, response, body) {
//       console.log("******* Requesting root! **********");
//       console.log(body);
//       if (!error && response.statusCode === 200) {        
//         var parseString = require('xml2js').parseString;
//         var xml = body;
//         parseString(xml, function (err, result) {
//           if (error) {
//             console.log(error);
//           }
//           console.log(result);
//           res.send(result);
//           // var data = result["Comps:comps"].response[0].properties[0].comparables[0].comp;
            
//         });       
//       }
//     }
//   )
// });

// // this API call works. DO NOT DELETE
// app.get("/foobar", function(req, res) {
// 	request(
// 		'http://www.zillow.com/webservice/GetComps.htm?zws-id=' + process.env.ZILLOW_KEY + '&zpid=48749425&count=2',
// 		function(error, response, body) {
// 			if (!error && response.statusCode === 200) {				
// 				var parseString = require('xml2js').parseString;
// 				var xml = body;
// 				parseString(xml, function (err, result) {
// 					if (error) {
// 						console.log(error);
// 					}
// 					var data = result["Comps:comps"].response[0].properties[0].comparables[0].comp;
// 				    // res.render("index", {data:data});
//             res.send(result);
// 				});				
// 			}
// 		}
// 	)
// });
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port);