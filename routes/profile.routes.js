const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { createProfile, fetchProfile } = require('../controllers/profile.controllers');
const router = express.Router();

router.post('/create', auth, createProfile);
router.get('/fetch', auth, fetchProfile);

module.exports = router;