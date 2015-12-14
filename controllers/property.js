var express = require("express");
var Property = require("../models/property");
var router = express.Router();

router.route("/")
	.get(function(req,res) {
		Property.find(function(err, properties) {
			if (err) return res.status(500).send(err);
			res.send(properties);
		});
	})
	.post(function(req,res) {
		Property.create(req.body, function(err, airplane) {
			if (err) return res.status(500).send(err);
			res.send(property);
		});
	});

router.route("/:id")
	.get(function(req, res) {
		Property.findById(req.params.id, function(err, property) {
			if (err) return res.status(500).send(err);
			res.send({"message": "success"});
		});
	})
	.put(function(req, res) {
		Property.findByIdAndUpdate(req.params.id, req.body, function(err) {
			if (err) return res.status(500).send(err);
			res.send({"message": "success"});
		});
	})
	.delete(function(req, res) {
		Property.findByIdAndRemove(req.params.id, function(err) {
			if (err) return res.status(500).send(err);
			res.send({"message": "success"});
		});
	});

module.exports = router;











