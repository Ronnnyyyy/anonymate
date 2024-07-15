const express = require("express");
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser.js');

const JWT_SIGN = process.env.JWT_SIGN;

// Router 1 (Creating user) - No login required

router.post('/createuser',[
    body('name','Name is required').not().isEmpty(),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be at least 6 characters long').isLength({min: 6})
], async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});

    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user){
            return res.status(400).json({ error: 'A user with this email already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        await user.save();

        const data = {
            user: {
                id: user.id
            }
        };

        const authtoken = jwt.sign(data, JWT_SIGN);

        res.status(201).json({authtoken});
    } catch(error){
        console.error('Error creating user:', error.message);
        res.status(500).json({error: 'Inter Server Error'})
    }
});

// Router 2 (Loggin user in) - No login required

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password','Password cannot be blanl').exists()
], async (req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    try{
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ error: 'Please enter correct credentials'});
        }

        const passwordCompare = await bcrypt.compare(password,user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials"});
        }

        const data = {
            user: {
                id: user.id
            }
        };

        const authtoken = jwt.sign(data, JWT_SIGN);
        res.json({ authtoken });
    } catch(error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Router 3 (Getting user info)

router.post('/getuser', fetchuser, async (req,res) =>{
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({error: "Internal Server Error"});
    }
});

module.exports = router;



