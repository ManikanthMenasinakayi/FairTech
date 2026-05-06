const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport'); // Required for authentication check[cite: 3]

// --- Signup Routes ---[cite: 8]
router.get('/creator/signup', authController.renderSignup);
router.post('/creator/signup', authController.signup);

// --- Login Routes ---[cite: 3, 4]
// Displays the login form
router.get('/creator/login', authController.renderLogin);

// Handles credential check. If account exists/password is correct, it proceeds to controller.[cite: 3]
// If it fails (Account not found/wrong password), it redirects back to login.[cite: 3]
router.post('/creator/login', 
    passport.authenticate('local', { 
        failureRedirect: '/auth/creator/login', 
        // Note: failureFlash: true can be added if using connect-flash for errors
    }), 
    authController.login
);

// GET /auth/admin/login[cite: 4]
router.get('/admin/login', authController.renderAdminLogin);

// POST /auth/admin/login[cite: 3, 4]
router.post('/admin/login', 
    passport.authenticate('local', { 
        failureRedirect: '/auth/admin/login', 
    }), 
    authController.adminLogin
);

// GET /auth/admin/login[cite: 4]
router.get('/admin/login', authController.renderAdminLogin);

// POST /auth/admin/login[cite: 3, 4]
router.post('/admin/login', 
    passport.authenticate('local', { 
        failureRedirect: '/auth/admin/login', 
    }), 
    authController.adminLogin
);

module.exports = router;