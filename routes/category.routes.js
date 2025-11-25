const express = require('express');
const { createCategory, fetchCategories, updateCategory, deleteCategory } = require('../controllers/category.controllers');
const { auth } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');
const upload = require('../middleware/upload.middleware');
const router = express.Router();

router.post('/create', auth, admin, createCategory);
router.get('/', fetchCategories);
router.put('/update/:id', auth, admin, updateCategory);
router.delete('/delete/:id', auth, admin, deleteCategory);

module.exports = router;