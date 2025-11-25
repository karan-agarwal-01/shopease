const express = require('express');
const upload = require('../middleware/upload.middleware');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');

router.post('/', auth, admin, upload.single("image"), (req, res) => {
    res.json({ message: "Image uploaded Successfully", imageUrl: req.file.path })
})

module.exports = router;