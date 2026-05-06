if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodoverride = require("method-override");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// 1. Models & Database Connection
const User = require('./models/User');

// Use the variable from your .env file
const MONGO_URL = process.env.MONGO_URI; 

main()
    .then(() => console.log("✅ Connected to DB"))
    .catch(err => console.log("❌ DB Error:", err));

async function main() { 
    // Mongoose connection using the env variable
    await mongoose.connect(MONGO_URL); 
}

// 2. View Engine & Static Files
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));

// 3. Session Configuration
const sessionConfig = {
    secret: process.env.SECRET || 'thisshouldbeabettersecret', 
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));

// 4. Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// 5. Passport Strategy Configuration
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 6. Routes
const authRoutes = require('./routes/authRoutes');
const creatorRoutes = require('./routes/creatorRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/auth', authRoutes); 
app.use('/creator', creatorRoutes);
app.use('/admin', adminRoutes);

app.get("/", (req, res) => {
    res.render("index.ejs");
});

// 7. Start Server
// Use PORT from .env or default to 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});