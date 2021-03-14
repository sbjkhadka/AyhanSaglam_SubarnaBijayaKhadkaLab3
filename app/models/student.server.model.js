// Module dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Schema definition
const Schema = mongoose.Schema;
var StudentSchema = new Schema({
    studentNumber: Number,
    password: {
        type: String,
        validate: [
            (password) => password && password.length > 6, 
            'Password should be greater than six characters'
        ]
    },
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    phone: String,
    email: String,
    program: String
});

// Set fullname virtual property

StudentSchema.virtual('fullName').get(() => {
    return this.firstName + ' ' + this.lastName;
}).set((fullName)=>{
    const splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});

// Use pre-saved middleware to hash password
StudentSchema.pre('save', function(next)  {
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

// Configure the 'StudentSchema' to use getters and virtuals when transforming to JSON
StudentSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

// Create the 'Student' model out of the 'StudentSchema'
mongoose.model('Student', StudentSchema);