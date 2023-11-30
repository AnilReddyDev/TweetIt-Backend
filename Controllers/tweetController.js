const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');

const Tweet = require("../models/tweetModel");

const getAllTweets = asyncHandler(async (req, res) => {
  const allTweets = await Tweet.find();
  console.log(allTweets);
  res.status(200).json(allTweets);
});

const getSelfTweets = asyncHandler(async (req, res) => {
  const selfTweets = await Tweet.find({ ownerid: req.params.id });
  console.log(selfTweets); //task now to get onlt the tweetpost content
  res.status(200).json(selfTweets);
});

const createTweet = asyncHandler(async (req, res) => {
  const { tweetpost, tweetimg } = req.body;
  const { token } = req.cookies;
  var ownerid = '';
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, {}, (err, userData) => {
      if (err) throw err;
      ownerid = userData.id;
      res.status(200);
    });
  } else {
    res.status(401);
  }
 
  const newTweet = await Tweet.create({
    ownerid,
    tweetpost,
    tweetimg,
  });
  if (newTweet) {
    res.status(201);
    res.json(newTweet);
  } else {
    res.status(400);
    throw new Error("Unable to post tweet. try again later");
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  res.json({ message: "deleteTweet controller succesfull", id: req.params.id });
});

module.exports = { getAllTweets, createTweet, deleteTweet, getSelfTweets };
