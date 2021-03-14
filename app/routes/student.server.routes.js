var students = require('../controllers/students.server.controller');
var express = require('express');
var router = express.Router();

module.exports = (app) => {
    app.get('/', (req, res)=>{res.json({a:10})})
    app.post('/create', students.create);
    app.post('/login', (req, res) => {
        console.log('received');
    });
}

// node
// require('crypto').randomBytes(64).toString('hex')
// 'cc337b5487e414597578da43fdb78464c1a2e2d0fce8989816170316564e9b41dcc79168c61da10a41df163c1e1b4d6af122477229d0a7edfd6ffaf277670663'