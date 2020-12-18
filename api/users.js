require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JWT_SECRET = process.env.JWT_SECRET

// Models
const db = require('../models');
const User = require('../models/User');


// GET api/users/test (Public)
router.get('/test', (req, res) => {
    res.json({ msg: "User endpoint OK!"})
});

// POST api/users/register (Public)
router.post('/register', (req, res) => {
    // Find  user by email
    User.findOne({
        email: req.body.email
    })
    .then(user => {
        // If email already exist, send a 400 response
        if (user) {
            return res.status(400).json({ msg: 'Email already exists' });
        } else {
            // Create a new user
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            // Salt and has the password, then save the user
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw Error;

                bcrypt.hash(newUser.password, salt, (error, hash) => {
                    if (error) throw Error;
                    // Change the password in newUser to the hash
                    newUser.password = hash;
                    newUser.save()
                    .then(createdUser => res.json(createdUser))
                    .catch(err => console.log(err));
                })
            })
        }
    })
})

// POST api/users/loging(public)
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Find user via email
    User.findOne({ email })
    .then(user => {
        // If there is not a user
        if (!user) {
            res.status(400).json({ msg: 'User not found' })
        } else {
            // A user is found inn the database
            bcrypt.compare(password, user.password)
            .then(isMatch => {
                // Check password for a match
                if (isMatch) {
                    // User match, send a JSON web Token
                    // Create a token payload
                    const payload = {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    };
                    // Sign token
                    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (error, token) =>{
                        res.json({
                            success: true,
                            token: `Bearer ${token}`
                        })
                    })
                } else {
                    return res.status(400).json({ msg: 'Email or Password is incorrect'})
                }
            })
        }
    })
})

// Get api/users/current (Private)
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
})

module.exports = router;
