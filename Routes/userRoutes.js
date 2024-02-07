const express = require('express');
const router = express.Router();
const {createUser, loginUser, currentUser, userProfile, tokenVerification} = require('../Controllers/userController');

router.post("/signup",createUser)
router.post("/login", loginUser)
router.get('/currentuser/:id', currentUser)
router.get('/profile', userProfile)
router.get('/:id/verify/:token', tokenVerification)


module.exports = router;