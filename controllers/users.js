var express = require('express');
var User = require('../models/user');
var Property = require('../models/property');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) return res.status(500).send(err);
      res.send(users);
    });
  })
  .post(function(req, res) {
    User.create(req.body, function(err, user) {
      if (err) return res.status(500).send({error: err, message:"HELLLOOOOO"});
      console.log("api/users post: ", user);
      res.send(user);
    });
  });

router.route('/:id').get(function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return res.status(500).send(err);
    res.send(user);
  })
  router.put("/:id", function(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) return res.status(500).send(err);
      res.send({"message": "success"});
    });
  })
});

router.route("/:id/properties/")
  .get(function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if (err) return res.status(500).send(err);
      Property.find({user: user.id}, function(err, property) {
        if (err) return res.status(500).send(err);
        res.send(property);
      })
    })
  })

module.exports = router;
