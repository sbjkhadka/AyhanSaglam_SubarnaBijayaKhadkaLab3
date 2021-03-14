// Load module dependencies
const Student = require("mongoose").model("Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const jwtExpirySeconds = 300;
const jwtKey = config.secretKey;

// Create a new error handling controller method
const getErrorMessage = function (err) {
  var message = "";

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = "email already exists";
        break;
      default:
        message = "Something went wrong";
    }
  } else {
    for (const errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }
};
// Create a new user
exports.create = function (req, res, next) {
  var student = new Student(req.body);
  console.log("body: " + req.body.firstName);

  student.save(function (err) {
    if (err) {
      return next(err);
    } else {
      res.json(student);
    }
  });
};
//Get All Students
exports.getAllStudents = function (req, res, next) {
  Student.find({}, function (err, students) {
    console.log(students);
    if (err) {
      console.log("some error in getAllStudents method");
      return next(err);
    } else {
      res.json(students);
    }
  });
};

// authenticates a Student
exports.authenticate = function (req, res, next) {
  // Get credentials from request
  console.log(req.body);
  const email = req.body.auth.email;
  const password = req.body.auth.password;
  console.log(password);
  console.log(email);
  //find the user with given email using static method findOne
  Student.findOne({ email: email }, (err, student) => {
    if (err) {
      return next(err);
    } else {
      console.log(student);
      //compare passwords
      if (bcrypt.compareSync(password, student.password)) {
        // Create a new token with the student id in the payload
        // and which expires 300 seconds after issue
        const token = jwt.sign(
          { id: student._id, email: student.email },
          jwtKey,
          { algorithm: "HS256", expiresIn: jwtExpirySeconds }
        );
        console.log("token:", token);
        // set the cookie as the token string, with a similar max age as the token
        // here, the max age is in milliseconds
        res.cookie("token", token, {
          maxAge: jwtExpirySeconds * 1000,
          httpOnly: true,
        });
        res.status(200).send({ screen: student.email });
        //
        //res.json({status:"success", message: "student found!!!", data:{student:
        //student, token:token}});

        req.student = student;
        //call the next middleware
        next();
      } else {
        res.json({
          status: "error",
          message: "Invalid email/password!!!",
          data: null,
        });
      }
    }
  });
};


//deletes the token on the client side by clearing the cookie named 'token'
exports.signout = (req, res) => {
  res.clearCookie("token");
  return res.status("200").json({ message: "signed out" });
  res.redirect("/");
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
