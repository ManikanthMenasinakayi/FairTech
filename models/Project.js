const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true }, // This will be the Channel Name
    description: String,
    link: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Engagement Stats
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'flagged'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);