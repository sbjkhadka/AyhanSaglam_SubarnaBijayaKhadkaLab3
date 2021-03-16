require("dotenv").config();
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
// Create a new student
exports.create = function (req, res, next) {
  var student = new Student(req.body);
  // console.log("body: " + req.body.firstName);

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
    // console.log(students);
    if (err) {
      // console.log("some error in getAllStudents method");
      return next(err);
    } else {
      res.json(students);
    }
  });
};



exports.authenticateStudent = (req, res) => {
  console.log("login called by ", req.body.email + req.body.password);
  Student.findOne({ email: req.body.email }, (error, student) => {
    if (error) {
      // console.log("student not found");
      return next(error);
    } else {
      // console.log("Student found", student);
      if (bcrypt.compareSync(req.body.password, student.password)) {
        // console.log("login granted");
        const token = jwt.sign(
          { email: student.email },
          jwtKey,
          { algorithm: "HS256", expiresIn: jwtExpirySeconds }
        );

        // console.log("token:", token);
    
        res.cookie("token", token, {
          httpOnly: true
        });
        res.status(200).send({ currentLoggedIn: student.email, token: token });
        //
        //res.json({status:"success", message: "student found!!!", data:{student:
        //student, token:token}});

        req.student = student;
      } else {
        // console.log("Invalid username or password");
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
};

//isAuthenticated() method to check whether a student is currently authenticated
exports.requiresLogin = function (req, res, next) {
  const token = req.cookies.token;
  // console.log(token);

  if (!token) {
    return res.send({ screen: "auth" }).end();
  }
  var payload;
  try {
    payload = jwt.verify(token, jwtKey);
    // console.log("in requiresLogin - payload:", payload);
    req.id = payload.id;
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).end();
    }
    return res.status(400).end();
  }

  next();
};

exports.isSignedIn = (req, res) => {
  // Obtain the session token from the requests cookies,
  // which come with every request
  // console.log('req_cook', req);
  // const token = req.cookies.token;
  const token = req.body.authKey;
  console.log('token_received', token);
  // if the cookie is not set, return 'auth'
  if (!token) {
    // console.log('no_token')
    return res.send({ currentLoggedIn: "noOne" }).end();
  }
  var payload;
  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, jwtKey);
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // the JWT is unauthorized, return a 401 error
      return res.status(401).end();
    }
    // otherwise, return a bad request error
    return res.status(400).end();
  }

  // Finally, token is ok, return the username given in the token
  res.status(200).send({ currentLoggedIn: payload.email });
};
