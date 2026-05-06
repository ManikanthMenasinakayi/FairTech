const express = require('express');
const router = express.Router();
const creatorController = require('../controllers/creatorController');
const { isLoggedIn, isCreator } = require('../middleware/middleware');

// Protecting the dashboard: 
// 1. Check if logged in 
// 2. Check if role is 'creator'
// 3. Then run the controller logic
router.get('/dashboard', isLoggedIn, isCreator, creatorController.getDashboard);
router.post('/project/:id/simulate', isLoggedIn, isCreator, creatorController.simulateEngagement);
// routes/creatorRoutes.js
router.post('/project/new', isLoggedIn, isCreator, creatorController.createProject);

module.exports = router;