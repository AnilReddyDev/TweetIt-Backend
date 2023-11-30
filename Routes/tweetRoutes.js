const express = require('express');
const router = express.Router();
const {getAllTweets, createTweet, deleteTweet, getSelfTweets} = require('../Controllers/tweetController')

router.route('/').get(getAllTweets).post(createTweet)
router.route("/:id").delete(deleteTweet).get(getSelfTweets)

module.exports = router;