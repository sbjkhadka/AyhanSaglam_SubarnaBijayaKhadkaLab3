// Load module dependencies
const Student = require('mongoose').model('Student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const jwtExpirySeconds = 300;
const jwtKey = config.secretKey;

// Create a new user
exports.create = function (req, res, next) {
    // Create a new instance of the 'User' Mongoose model
    var student = new Student(req.body); //get data from React form
    console.log("body: " + req.body.firstName);

    // Use the 'User' instance's 'save' method to save a new user document
    student.save(function (err) {
      if (err) {
        // Call the next middleware with an error message
        return next(err);
      } else {
        // Use the 'response' object to send a JSON response
        res.json(student);
      }
    });
};