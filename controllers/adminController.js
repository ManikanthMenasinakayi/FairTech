// controllers/adminController.js
const User = require('../models/User');
const Project = require('../models/Project');

module.exports.getDashboard = async (req, res) => {
    // You might want to fetch all users later to show them on the dashboard
    const allUsers = await User.find({});
    res.render('admin/dashboard', { user: req.user, allUsers });
};

module.exports.getDashboard = async (req, res) => {
    // 1. Fetch all "Channels" (Projects) and their Owners
    const allChannels = await Project.find({}).populate('owner');
    
    // 2. Add the Malicious Score calculation for the view
    const channelsWithScores = allChannels.map(channel => {
        let maliciousScore = 0;
        
        // Ratio Check: If likes > views, increase score
        if (channel.likes > channel.views) maliciousScore += 5;
        
        // Ratio Check: If comments > views (very suspicious)
        if (channel.comments > channel.views) maliciousScore += 5;
        
        // Limit max score to 10
        maliciousScore = Math.min(10, maliciousScore);
        
        return { ...channel._doc, maliciousScore };
    });

    res.render('admin/dashboard', { user: req.user, channels: channelsWithScores });
};

// Logic to Flag a Channel
module.exports.flagChannel = async (req, res) => {
    const { id } = req.params;
    const channel = await Project.findById(id);
    channel.status = 'flagged';
    await channel.save();
    res.redirect('/admin/dashboard');
};