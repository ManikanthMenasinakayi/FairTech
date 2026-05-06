const mongoose = require('mongoose');

/**
 * Revenue Pool Schema
 * Satisfies: "Revenue pool management with configurable distribution rules"
 */
const revenuePoolSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // e.g., "May 2026 Distribution Pool"
        trim: true
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total revenue amount is required'],
        min: 0
    },
    // Configurable Distribution Rules (Metric Normalization Weights)
    config: {
        viewWeight: { type: Number, default: 1 },
        likeWeight: { type: Number, default: 2 },
        shareWeight: { type: Number, default: 5 },
        commentWeight: { type: Number, default: 3 }
    },
    // Fair Distribution settings for handling skewed traffic
    fairnessCap: {
        type: Number, 
        default: 0.1, // Max % of the pool one creator can take (e.g., 10%)
        helpText: "Prevents one creator from taking the entire pool under skewed traffic"
    },
    status: {
        type: String,
        enum: ['open', 'calculating', 'completed'],
        default: 'open'
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

const RevenuePool = mongoose.model('RevenuePool', revenuePoolSchema);

module.exports = RevenuePool;