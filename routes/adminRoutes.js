// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isLoggedIn, isAdmin } = require('../middleware/middleware');

// GET /admin/dashboard
// 1. Check if logged in
// 2. Check if role is 'admin'
// 3. Render the dashboard
router.get('/dashboard', isLoggedIn, isAdmin, adminController.getDashboard);
router.post('/project/:id/flag', isLoggedIn, isAdmin, adminController.flagChannel);

module.exports = router;




