const mongoose = require('mongoose');

/**
 * Payout Schema
 * Satisfies: "Transparency dashboard showing payout breakdown and anomaly flags"
 */
const payoutSchema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    poolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RevenuePool',
        required: true
    },
    // The "Transparency" breakdown
    calculationDetails: {
        totalEngagementPoints: { type: Number, default: 0 },
        flaggedPointsDeducted: { type: Number, default: 0 }, // Transparency on bot detection
        finalEligiblePoints: { type: Number, default: 0 }
    },
    // The Financial Results
    grossEarnings: {
        type: Number,
        required: true // Amount before fairness caps/deductions
    },
    netEarnings: {
        type: Number,
        required: true // The actual "take-home" pay
    },
    // For the UI dashboard status
    status: {
        type: String,
        enum: ['pending', 'processed', 'paid', 'rejected'],
        default: 'pending'
    },
    // Audit log for the creator to see why they were paid this amount
    transparencyReport: {
        type: String,
        default: "Your payout was calculated using normalized engagement weights."
    },
    processedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure a creator only gets one payout per pool
payoutSchema.index({ creatorId: 1, poolId: 1 }, { unique: true });

const Payout = mongoose.model('Payout', payoutSchema);

module.exports = Payout;