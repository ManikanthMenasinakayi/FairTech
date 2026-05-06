const Project = require('../models/Project');
const User = require('../models/User');

// 1. Unified Dashboard View
module.exports.getDashboard = async (req, res) => {
    try {
        // Fetch only projects belonging to the logged-in creator[cite: 5]
        const projects = await Project.find({ owner: req.user._id }); 
        res.render('creator/dashboard', { user: req.user, projects });
    } catch (err) {
        console.error("Dashboard Error:", err);
        res.redirect('/');
    }
};

// 2. Project Submission
module.exports.createProject = async (req, res) => {
    try {
        const { title, description, link } = req.body;
        const newProject = new Project({ 
            title, 
            description, 
            link, 
            owner: req.user._id //[cite: 5]
        });
        await newProject.save();
        res.redirect('/creator/dashboard');
    } catch (err) {
        console.error("Project Creation Error:", err);
        res.redirect('/creator/dashboard');
    }
};

// 3. MVP Simulation: Anomalous Spike Detection
module.exports.simulateEngagement = async (req, res) => {
    try {
        const { id } = req.params;
        const { newViews, newLikes } = req.body;

        const project = await Project.findById(id);
        const user = await User.findById(req.user._id);

        const v = parseInt(newViews || 0);
        const l = parseInt(newLikes || 0);

        // --- MANIPULATION DETECTION LOGIC ---
        // Check for "Anomalous Spikes": Likes should not exceed views in a single batch.
        let isAnomalous = l > v; 

        if (isAnomalous) {
            // Drop Trust Score for suspicious activity
            user.trustScore = Math.max(0, user.trustScore - 25); 
            // Mark project as flagged for manipulation[cite: 6]
            project.status = 'flagged'; 
            console.log(`⚠️ Anomaly detected: Spike in engagement for ${project.title}`);
        } else {
            // Slight recovery for natural-looking engagement
            user.trustScore = Math.min(100, user.trustScore + 1);
        }

        // Update Project Totals
        project.views += v;
        project.likes += l;

        // --- REVENUE CALCULATION ---[cite: 6]
        // Base revenue is ₹1 per view, adjusted by current Trust Score[cite: 6]
        const rawRevenue = project.views * 1; 
        user.walletBalance = rawRevenue * (user.trustScore / 100);

        await project.save();
        await user.save();

        res.redirect('/creator/dashboard');
    } catch (err) {
        console.error("Simulation Error:", err);
        res.redirect('/creator/dashboard');
    }
};