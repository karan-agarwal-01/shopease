const express = require('express');
const { loginUser, registerUser, refreshAccessToken, logoutUser, verifyUser } = require('../controllers/auth.controllers');
const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);
router.get('/verify', verifyUser);

module.exports = router;