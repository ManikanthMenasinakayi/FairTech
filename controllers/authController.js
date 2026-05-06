const User = require('../models/User');

// Display the signup form[cite: 7]
module.exports.renderSignup = (req, res) => {
    res.render('auth/creator-signup');
};

// Display the login form
module.exports.renderLogin = (req, res) => {
    res.render('auth/creator-login');
};

// Logic to save user to Database[cite: 7]
module.exports.signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        // Create user instance with role and trustScore[cite: 6, 7]
        const user = new User({ 
            name, 
            email, 
            role: 'creator', 
            trustScore: 100 
        });

        // Passport's register method hashes the password and saves the user[cite: 6, 7]
        const registeredUser = await User.register(user, password);

        // Automatically log the user in after signup[cite: 3, 7]
        req.login(registeredUser, err => {
            if (err) return next(err);
            console.log("✅ New Creator Registered:", registeredUser.email);
            res.redirect('/creator/dashboard'); // Redirect directly to dashboard[cite: 3]
        });

    } catch (e) {
        console.log("❌ Signup Error:", e.message);
        res.redirect('/auth/creator/signup');
    }
};

// Passport.authenticate middleware in the route handles the check; 
// this function only runs if login is successful[cite: 3]
module.exports.login = (req, res) => {
    console.log("✅ Login Successful:", req.user.email);
    res.redirect('/creator/dashboard');
};

// Render the Admin Login Page[cite: 3]
module.exports.renderAdminLogin = (req, res) => {
    res.render('auth/admin-login');
};

// Admin Login Logic[cite: 3]
module.exports.adminLogin = (req, res) => {
    // Check if the authenticated user is actually an admin[cite: 3]
    if (req.user.role === 'admin') {
        console.log("👑 Admin Access Granted:", req.user.email);
        res.redirect('/admin/dashboard');
    } else {
        // If a creator tries to login through the admin portal, log them out and redirect[cite: 3]
        req.logout((err) => {
            if (err) return next(err);
            res.redirect('/auth/admin/login'); 
        });
    }
};