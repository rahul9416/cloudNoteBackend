const express = require('express');
let router = express.Router();
const user = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../midlleware/fetchuser');
let success="false";

const JWtSecret = 'Hey User!!';

// Route1: Create a user using Post /api/auth/createUser
router.post('/createUser', [
    body('name', 'Enter a valid Name').isLength({min:5}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({min:3})
] , async (req, res)=>{
    // return if there is error
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        success=false
        return res.status(400).json({success,errors: errors.array()});
    }
    // check whether user is already registered or not
    try {
        let User = await user.findOne({email:req.body.email});
        if (User){
            success=false
            return res.status(400).json({success,error: "User is already registered"})
        }
        // create a new user
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt);
        User = await user.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })

        const data = {
            user:{
                id:user.id
            }
        }

        const jwtData = jwt.sign(data, JWtSecret);
        success=true
        res.json({success,jwtData});
    }
    catch (error) {
        console.log("error"+error)
        res.status(500).send("Error")}
})

// Route2: Authenticate a User using : POST "/api/auth/login". No Login Required
router.post('/login',[
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req,res) => {

    // If there are errors return the error with bad request
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {email,password} = req.body;
    try {
        let User = await user.findOne({email});
        if(!User){
            success=false;
            return res.status(400).json({success,error:'Please try to login with correct credentials'});
        }
        
        const passCompare = await bcrypt.compare(password, User.password);
        if(!passCompare){
            success=false;
            return res.status(400).json({success,errors: "Please try to login with correct credentials "})}

        const data = {
            User:{
                id:User.id
            }
        }
        const authToken = jwt.sign(data, JWtSecret);
        success=true;
        res.json({success,authToken});

    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Some error occured");
    }

})

// Route 3: Get data of logged in User using "/api/auth/getdata". Login Required
router.post('/getdata',fetchuser, async (req,res) => {
    try {
        const userId = req.user.id;
        const User = await user.findById(userId);
        res.send(User);
    } catch (error) {
        console.log(error.message);
            return res.status(500).send("Some error occured");
    }
})

module.exports = router