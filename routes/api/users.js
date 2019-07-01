const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

//User model
const User = require('../../models/User');

// @route   POST /api/users
// @desc    Register a new user
// @access  Public
router.post('/', (req, res, next) => {
    const { name, email, password } = req.body;
    
    //Simple validation
    if(!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields!' });
    }

    //Check for existing user
    User.findOne({email}).then(user => {
        //If such user exists (searching by email ^)
        if(user) return res.status(400).json({ msg: 'User already exists!' });
    
        //Otherwise (param user will be null)
        const newUser = User({
            name,
            email,
            password
        });

        //Generating salt & hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save().then(user => { //Saving into db
                    res.json({
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }
                    });
                })
            });
        });
    })
});

module.exports = router;