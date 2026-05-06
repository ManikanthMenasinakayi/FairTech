const mongoose = require('mongoose');

/**
 * Engagement Schema
 * Satisfies: "Engagement tracking system with metric normalization"
 * and "Manipulation detection: flag anomalous engagement spikes"
 */
const engagementSchema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Metric Normalization: Distinguish between different types of interaction
    metricType: {
        type: String,
        enum: ['view', 'like', 'share', 'comment'],
        required: true
    },
    // The "weight" assigned based on the platform's rules (e.g., share > view)
    normalizedValue: {
        type: Number,
        default: 1
    },
    // Metadata for Manipulation Resistance
    metadata: {
        ipAddress: {
            type: String,
            required: true
        },
        userAgent: {
            type: String, // Helps identify if the user is a bot/script
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    // The "Kill Switch" for fraudulent data
    isFlagged: {
        type: Boolean,
        default: false // Set to true by the controller if an anomaly is detected
    },
    flagReason: {
        type: String,
        enum: ['none', 'rapid_click', 'duplicate_ip', 'bot_behavior'],
        default: 'none'
    }
});

// Indexing for faster fraud detection queries during the hackathon
engagementSchema.index({ 'metadata.ipAddress': 1, 'metadata.timestamp': -1 });
engagementSchema.index({ creatorId: 1, isFlagged: 1 });

const Engagement = mongoose.model('Engagement', engagementSchema);

module.exports = Engagement;