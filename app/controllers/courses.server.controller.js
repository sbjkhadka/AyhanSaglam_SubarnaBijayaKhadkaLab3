// Load module dependencies
const Student = require("mongoose").model("Student");
const Course = require("mongoose").model("Course");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const jwtExpirySeconds = 300;
const jwtKey = config.secretKey;

function getErrorMessage(err) {
  if (err.errors) {
    for (let errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return "Unknown server error";
  }
}

// Create a new Course
exports.create = function (req, res) {
  var course = new Course();
  console.log(req.body);

  Student.findOne({ studentNumber: req.body.studentNumber }, (err, student) => {
    if (err) {
      return getErrorMessage(err);
    }
    req.id = student._id;
    console.log("student._id", req.id);
  }).then(function () {
    course.student = req.id;
    console.log("student._id", req.id);
    course.save((err) => {
      if (err) {
        console.log("error", getErrorMessage(err));
        return res.status(400).send({
          message: getErrorMessage(err),
        });
      } else {
        res.status(200).json(course);
      }
    });
  });
};

//Get All Courses
exports.list = function (req, res, next) {
  Course.find({}, function (err, courses) {
    console.log(courses);
    if (err) {
      console.log("some error in getAllCourses method");
      return next(err);
    } else {
      res.json(courses);
    }
  });
};
//List the courses by student (courses chosen by a student)

// Courses list by Students
exports.coursesByStudent = function (req, res, next) {
  var email = req.session.email;
  console.log("session_email", email);
  console.log("request", req.id);
  Student.findOne({ email: req.session.email }, (err, student) => {
    if (err) {
      return getErrorMessage(err);
    }    
    console.log("Student :", student);    
    req.student = student;
  }).then(function () {   
    Course.find(
      {
        student: req.student._id,        
      },
      (err, courses) => {
        if (err) {
          return getErrorMessage(err);
        }        
        res.status(200).json(courses);
      }
    );
  });
};

// Courses list by Students
// List the students who chose the course offered
exports.coursesByStudent = function (req, res, next) {
  var
  var email = req.session.email;
  console.log("session_email", email);
  console.log("request", req.id);
  Student.findOne({ email: req.session.email }, (err, student) => {
    if (err) {
      return getErrorMessage(err);
    }    
    console.log("Student :", student);    
    req.student = student;
  }).then(function () {   
    Course.find(
      {
        student: req.student._id,        
      },
      (err, courses) => {
        if (err) {
          return getErrorMessage(err);
        }        
        res.status(200).json(courses);
      }
    );
  });
};


//Update Course by given id
exports.update = function (req, res) {
  console.log('in update:', req.course)
  const course = req.course;
  course.save((err) => {
      if (err) {
          return res.status(400).send({
              message: getErrorMessage(err)
          });
      } else {
          res.status(200).json(course);
      }
  });
};

//Delete course by given id
exports.delete = function (req, res) {
  const course = req.course;
  course.remove((err) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err),
      });
    } else {
      res.status(200).json(course);
    }
  });
};

//Find by course id
exports.courseByID = function (req, res, next, id) {
  Course.findById(id).populate('creator', 'firstName lastName fullName').exec((err, article) => {if (err) return next(err);
  if (!course) return next(new Error('Failed to load course '
          + id));
      req.course = course;
      console.log('in courseByID:', req.course)
      next();
  });
};
//Read course
exports.read = function (req, res) {
  res.status(200).json(req.course);
};

//to verify that the current student is the creator of the current course
exports.hasAuthorization = function (req, res, next) {
  console.log("in hasAuthorization - student: ", req.course.student);
  console.log("in hasAuthorization - student: ", req.id);

  if (req.course.student.id !== req.id) {
    return res.status(403).send({
      message: "Student is not authorized",
    });
  }
  next();
};

//isAuthenticated() method to check whether a student is currently authenticated
exports.requiresLogin = function (req, res, next) {
  const token = req.cookies.token;
  console.log(token);
  if (!token) {
    return res.send({ screen: "auth" }).end();
  }
  var payload;
  try {
    payload = jwt.verify(token, jwtKey);
    console.log("in requiresLogin - payload:", payload);
    req.id = payload.id;
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).end();
    }
    return res.status(400).end();
  }
  next();
};
