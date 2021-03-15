var courses = require("../controllers/courses.server.controller");
var students = require("../controllers/students.server.controller");

var express = require("express");
var router = express.Router();

module.exports = function (app) {
  app
    .route("/courses")
    .get(courses.list)
    .post(/*student.requiresLogin, */ courses.create);

  app
    .route("/courses/:courseId")
    .get(courses.read)
    .put(students.requiresLogin, courses.hasAuthorization, courses.update)
    .delete(students.requiresLogin, courses.hasAuthorization, courses.delete);
  app.param("courseId", courses.courseByID);
};
/**Create a React front end that allows students to login, 
 * add a course, 
 * update a course (for example change the section), 
 * drop a course, 
 * list all the courses taken by a student, 
 * list all students, 
 * list all courses, 
 * list all students that are taking a given course. */