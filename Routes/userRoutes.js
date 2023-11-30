const express = require('express');
const router = express.Router();
const {createUser, loginUser, currentUser, userProfile} = require('../Controllers/userController');

router.post("/signup",createUser)
router.post("/login", loginUser)
router.get('/currentuser/:id', currentUser)
router.get('/profile', userProfile)


module.exports = router;