var courses = require('../controllers/courses.server.controller');
var students=require('../controllers/students.server.controller')

var express = require('express');
var router = express.Router();

module.exports = function (app) {
    app.route('/courses')
        .get(courses.list)
        .post(/*student.requiresLogin, */courses.create);
    
    // app.route('/articles/:articleId')
    //     .get(articles.read)
    //     .put(users.requiresLogin, articles.hasAuthorization, articles.
    //         update)
    //     .delete(users.requiresLogin, articles.hasAuthorization, articles.
    //         delete);
    //
   // app.param('articleId', articles.articleByID);
};
