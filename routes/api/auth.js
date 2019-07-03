const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

//User model
const User = require('../../models/User');

// @route   POST /api/auth
// @desc    Authenticate an existing user
// @access  Public
router.post('/', (req, res, next) => {
    const { email, password } = req.body;
    
    //Simple validation
    if(!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields!' });
    }

    //Check for existing user
    User.findOne({email}).then(user => {
        //If such user exists (searching by email ^)
        if(!user) return res.status(400).json({ msg: 'User does not exist!' });
    
        //Validating the password
        bcrypt.compare(password, user.password).then((isMatch) => {
            if(!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials!' });
            }
            
            jwt.sign({ id: user.id }, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => { //Token expires in one hour
                if(err) throw err;
                res.json({
                    token, //Including the generated token in the response
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });
            });
        });
    })
});

// @route   GET /api/auth/user
// @desc    Get user data (based on the token)
// @access  Private (protected with token)
router.get('/user', auth, (req, res, next) => {
    User.findById(req.user.id).select('-password').then((user) => { //select('-password') - Do not return the password
        res.json(user);
    });
});

module.exports = router;