const mongoose = require('mongoose');
//Used for encryption of passwords
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema
const UserSchema = mongoose.Schema({
    name: {
        type:String
    },
    email:{
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User' , UserSchema);

//Function to get User by Id (we are using module.exports since
//we are using the function outside its logic file)
module.exports.getUserById = function(id , callback){
    User.findById(id, callback);
}

//Another function to get user by Username
module.exports.getUserByUsername = function(username, callback){
    const query = { username: username }
    User.findOne(query, callback);
}


module.exports.addUser = function(newUser , callback){
    //Hash the password , genSalt method is used to generate a salt
    //which is a random key that is used to hash the password
    bcrypt.genSalt(10 , (err, salt) => {
        bcrypt.hash(newUser.password , salt , (err , hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if(err) throw err;
      callback(null, isMatch);
    });
}
  
  