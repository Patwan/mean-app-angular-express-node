//Bring on board depedencies
const express = require('express');

//HBring on board express router
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

//Bring on board the model
const User = require('../models/user');

//Register
router.post('/register' , (req, res, next) => {
    //Instantiate a new object from teh User model (Pass the
    // parameters passed from the form using the request object ,
    // the keys should correspond with teh column names from the db table)
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    //We invoke the method we created in the model
    User.addUser(newUser , (err , user) => {
        if(err){
            res.json({success: false, msg: 'Failed to register user'});
        }
        else{
            res.json({success: true, msg: 'User Registered'});
        }
    });
});

//Authenticate
router.post('/authenticate' , (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username , (err , user) => {
        if(err) throw err;
        if(!user){
            return res.json({ success: false, msg: 'User not found'});
        }

        User.comparePassword(password , user.password , (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({data: user}, config.secret , {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                })
            }
            else{
                return res.json({ success: false, msg: 'Wrong Password'});
            }
        });
    })

});

//profile
router.get('/profile' , passport.authenticate('jwt', {session:false}) , (req, res, next) => {
    res.json({user: req.user});
});

//Exporting the router
module.exports = router;