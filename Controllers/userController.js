const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { json } = require("express");
require("dotenv").config();

const Token = require("../models/Token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, userimg } = req.body;
  var userImgUpdate = "";
  if (!userimg) {
    var userImgUpdate =
      "https://upload.wikimedia.org/wikipedia/commons/3/38/Stranger_Things_logo.png";
  } else {
    var userImgUpdate = userimg;
  }
  if (!username || !email || !password) {
    res.status(400).send({ message:"except image all fields are mandatory !"});
   
  }
  const userFound = await User.findOne({ email });
  if (userFound) {
    res.status(400).send({ message:"Email already exists"});
    
  }

  const hasedPassword = await bcrypt.hash(password, 11);

  const userdata = await User.create({
    username,
    email,
    password: hasedPassword,
    userimg: userImgUpdate,
  });

  if (userdata) {
    const tokendata = await Token.create({
      userId: userdata._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    if (tokendata) {
      const url = `${process.env.BASE_URL}/${userdata._id}/verify/${tokendata.token}`;
      if (url) {
        await sendEmail(userdata.email, "Verify Email", url);
      }
    } else {
      res.status(400).send({message: "try again later"});
      
    }
    res.status(201).send({message: "An email sent to your account. Please verify"});
  } else {
    res.status(400).send({ message:"user data not stored!Please try again later"});
    
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);

  if (!email || !password) {
    res.status(400);
    throw new Error("All Fields are Mandatory");
  }

  const userExisted = await User.findOne({ email });

  if (userExisted && (await bcrypt.compare(password, userExisted.password))) {
    jwt.sign(
      {
        username: userExisted.username,
        email: userExisted.email,
        id: userExisted._id,
      },
      process.env.SECRET_KEY,
      {},
      async (err, tokens) => {
        if (err) throw err;

        if (!userExisted.verified) {
          let tokendatas = await Token.findOne({ userId: userExisted._id });
          if (!tokendatas) {
             tokendatas = await Token.create({
              userId: userExisted._id,
              token: crypto.randomBytes(32).toString("hex"),
            });
          }

          if (tokendatas) {
            const url = `${process.env.BASE_URL}/${userExisted._id}/verify/${tokendatas.token}`;
            if (url) {
              await sendEmail(userExisted.email, "Verify Email", url);
            }
          } else {
            res.status(400).send({ message:"Something went wrong! try again later" });
            throw new Error("Token not created");
          }

          res
            .status(400)
            .send({ message: "An email sent to your account please verify" });
        } else {
          res.status(200).send(tokens);
        }
      }
    );
  } else {
    res.status(401).send({ message: "Invaild userid or password" });
    
  }
});

const userProfile = asyncHandler(async (req, res) => {
  const token = req.headers.authorization;
  // console.log("userprofile token :",token)
  if (token) {
    // Proceed with token verification and user profile retrieval
    jwt.verify(token, process.env.SECRET_KEY, {}, async (err, userData) => {
      if (err) {
        // Handle verification errors
        res.status(401).json({ error: "Unauthorized" });
      } else {
        // Token is valid, retrieve user profile data
        const profileData = await User.findById(userData.id);
        res.json(profileData);
      }
    });
  } else {
    // If no token is provided
    res.status(401).json({ error: "Unauthorized" });
  }
});

const tokenVerification = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid user" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid token" });

    const userUpdated = await User.findOneAndUpdate(
      { _id: user._id },
      { verified: true },
      { new: true }
    );
    if (userUpdated) {
      await Token.findByIdAndDelete(token._id);
      res.status(200).send({ message: "Email verified successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "internal server error", errdetail: error });
  }
});

const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

module.exports = {
  createUser,
  loginUser,
  currentUser,
  userProfile,
  tokenVerification,
};
