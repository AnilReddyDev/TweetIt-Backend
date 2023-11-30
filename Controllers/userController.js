const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { json } = require('express');
require('dotenv').config();

const createUser = asyncHandler(async (req,res)=>{
    const {username, email, password, userimg} = req.body;
    var userImgUpdate = "";
    if (!userimg){
      var userImgUpdate = "https://upload.wikimedia.org/wikipedia/commons/3/38/Stranger_Things_logo.png";
    }else{
      var userImgUpdate = userimg;
    }
    if(!username && !email && !password){
        res.status(400);
        throw new Error("All fields are mandatory !")
    }
    const userFound = await User.findOne({email});
    if (userFound) {
        res.status(400);
        throw new Error("User already registered");
      }
    
    const hasedPassword = await bcrypt.hash(password, 11)

    const user = await User.create({
        username,
        email,
        password:hasedPassword,
        userimg:userImgUpdate,
      
    })

    if (user) {
        res.status(201);
        res.json({ _id: user.id, email: user.email });
      } else {
        res.status(400);
        throw new Error("User data not valid");
      }

    })

const loginUser = asyncHandler(async (req,res)=>{
    const {email, password} = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All Filed are Mandatory");
      }

    const userExist = await User.findOne({email});

    if (userExist && await bcrypt.compare(password, userExist.password)){
        jwt.sign({
          username:userExist.username,
          email:userExist.email,
          id:userExist._id
        },
        process.env.SECRET_KEY,
        {},(err,token)=>{
          if (err) throw err;
          res.cookie('token',token).status(200).json(userExist);
        })
    }else{
        res.status(401);
        throw new Error("Email or Password not valid");
    }
})

const userProfile = asyncHandler(async (req,res)=>{
  const {token} = req.cookies;
  if (token){
    jwt.verify(token, process.env.SECRET_KEY,{},async (err,userData)=>{
      if (err) throw err;
      const profileData = await User.findById(userData.id);
      res.json(profileData);
    })
  }else{
    res.json(null);
  }
})

const currentUser = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.params.id)
    res.json(user)
})

module.exports = {createUser, loginUser, currentUser, userProfile}