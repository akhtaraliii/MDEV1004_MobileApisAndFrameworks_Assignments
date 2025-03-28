const Analytics = require('../model/analyticsModel');
const ButtonAnalytics = require('../model/buttonAnalyticsModel');

// Middleware to track endpoint hits
const trackAnalytics = async(req, res, next) => {
    const endpoint = req.path;
    const timestamp = new Date();

    try {
        // Find the document for the current endpoint or create a new one
        let analytics = await Analytics.findOne({endpoint});
        if(!analytics) {
            analytics = new Analytics({endpoint});
        }
        // Update hit count and timestamps
        analytics.hits += 1;
        analytics.timestamps.push(timestamp);

        // Save the updates to the database
        await analytics.save();
        console.log(`Endpoint ${endpoint} was hit at ${timestamp}`);
        next();
    } catch(error) {
        console.error('Error tracking analytics: ', error);
        res.status(500).send('Server error');
    }
};

// Controller to get analytics data
const getAnalytics = async(req, res) => {
    try {
        const analyticsData = await Analytics.find();
        res.json(analyticsData);
    } catch(error) {
        console.error('Error fetching analytics data: ', error);
        res.status(500).send('Server error');
    }
};

// Track button clicks
const trackButtonClick = async(req, res) => {
    try {
        const { buttonId, username, timestamp } = req.body;
        const buttonClick = new ButtonAnalytics({
            buttonId,
            username: username || 'Anonymous',
            timestamp
        });
        await buttonClick.save();
        res.status(200).json({ message: 'Button click tracked successfully' });
    } catch(error) {
        console.error('Error tracking button click: ', error);
        res.status(500).send('Server error');
    }
};

// Get button analytics
const getButtonAnalytics = async(req, res) => {
    try {
        const buttonData = await ButtonAnalytics.find()
            .sort('-timestamp')
            .limit(10); // Get last 10 clicks
        res.json(buttonData);
    } catch(error) {
        console.error('Error fetching button analytics: ', error);
        res.status(500).send('Server error');
    }
};

module.exports = {
    trackAnalytics,
    getAnalytics,
    trackButtonClick,
    getButtonAnalytics
};