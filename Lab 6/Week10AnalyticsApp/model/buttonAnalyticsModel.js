const mongoose = require('mongoose');

const ButtonAnalyticsSchema = new mongoose.Schema({
    buttonId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        default: 'Anonymous'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ButtonAnalytics = mongoose.model('ButtonAnalytics', ButtonAnalyticsSchema);
module.exports = ButtonAnalytics;
