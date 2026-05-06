module.exports.isLoggedIn = (req, res, next) => {
    // Passport adds the isAuthenticated() method to the request object
    if (!req.isAuthenticated()) {
        // If not logged in, save the URL they were trying to access 
        // and redirect to login
        return res.redirect('/auth/creator/login');
    }
    next(); // Move to the next function (the Controller)
};

module.exports.isCreator = (req, res, next) => {
    if (req.user.role !== 'creator') {
        return res.redirect('/');
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.redirect('/');
    }
    next();
};