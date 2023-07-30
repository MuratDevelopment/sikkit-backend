const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/User');

const bcrypt = require('bcrypt');

router.post('/register', (req, res) => {
    let {name, email, password} = req.body;
    
    if (name == '' || email == '' || password == '') {
        res.json({
            status: 'FAILED',
            message: 'Empty input fields!'
        });
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
        res.json({
            status: 'FAILED',
            message: 'Invalid name entered!'
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: 'FAILED',
            message: 'Invalid email entered!',
            enteredEmail: email
        });
    } else if (password.lenght < 8) {
        res.json({
            status: 'FAILED',
            message: 'Password is too short!'
        });
    } else {
        User.find({email}).then(result => {
            if (result.length) {
                res.json({
                    status: 'FAILED',
                    message: 'Email already exists!'
                });
            } else {
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {

                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: 'SUCCESS',
                            message: 'Registration successful!',
                            data: result
                        });
                    }
                    ).catch(err => {
                        res.json({
                            status: 'FAILED',
                            message: 'An error occured while saving user account!'
                        });
                    }
                    );

                }).catch(err => {
                    res.json({
                        status: 'FAILED',
                        message: 'An error occured while hashing password!'
                    });
                });
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: 'FAILED',
                message: 'An error occured while checking for existing user!'
            });
        });
    }
});

router.get('/get-id', (req, res) => {
    if (!req.user) {
        res.json({
            status: 'FAILED',
            message: 'User not logged in!'
        });
    } else {
        res.json({
            status: 'SUCCESS',
            message: 'User found!',
            data: req.user.id
        });
    }
});



router.post('/login', passport.authenticate('local', {failureRedirect: '/login-failure', successRedirect: '/login-success'}));

router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
            res.json({
                status: 'FAILED',
                message: 'An error occured while logging out!'
            });
        }
        res.json({
            status: 'SUCCESS',
            message: 'User logged out successfully!'
        });
});
})

router.post('/get-name', (req, res) => {
    if (!req.body.id) {
        res.json({
            status: 'FAILED',
            message: 'User ID is required!'
        });
    }
    User.findById(req.body.id).then(result => {
        res.json({
            status: 'SUCCESS',
            message: 'User found!',
            data: result
        });
    }).catch(err => {
        res.json({
            status: 'FAILED',
            message: 'An error occured while finding user!',
            error: err
        });
    });
});

router.post('/get-profile-photo', (req, res) => {
    if (!req.body.id) {
        res.json({
            status: 'FAILED',
            message: 'User ID is required!'
        });
    }
    User.findById(req.body.id).then(result => {
        res.json({
            status: 'SUCCESS',
            message: 'User found!',
            data: result.profilePicture
        });
    }).catch(err => {
        res.json({
            status: 'FAILED',
            message: 'An error occured while finding user!',
            error: err
        });
    });
});



module.exports = router;