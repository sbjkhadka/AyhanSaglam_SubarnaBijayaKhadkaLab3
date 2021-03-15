var students = require("../controllers/students.server.controller");
var express = require("express");
var router = express.Router();

module.exports = function (app) {
  app.get("/students", students.requiresLogin, students.getAllStudents);  
  app.post("/", students.create);
  app.post("/login", students.authenticateStudent);
  app.get("/logout", students.signout); 

  app.post("/read_cookie", students.isSignedIn);
 
};

// node
// require('crypto').randomBytes(64).toString('hex')
// 'cc337b5487e414597578da43fdb78464c1a2e2d0fce8989816170316564e9b41dcc79168c61da10a41df163c1e1b4d6af122477229d0a7edfd6ffaf277670663'
