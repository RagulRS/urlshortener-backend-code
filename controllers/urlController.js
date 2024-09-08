const URL = require('../models/URL');
const shortid = require('shortid');

exports.createShortUrl = async (req, res) => {
    const { originalUrl } = req.body;
    const userId = req.user.id;

    try {
        const shortUrl = shortid.generate();
        const url = await URL.create({
            originalUrl,
            shortUrl,
            userId,
        });

        res.status(201).json({
            success: true,
            data: url,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.redirectToOriginalUrl = async (req, res) => {
    try {
        const url = await URL.findOne({ shortUrl: req.params.shortUrl });

        if (!url) {
            return res.status(404).json({ success: false, error: 'URL not found' });
        }

        url.clickCount += 1;
        await url.save();

        res.redirect(url.originalUrl);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getUserUrls = async (req, res) => {
    try {
        const urls = await URL.find({ userId: req.user.id });

        res.status(200).json({
            success: true,
            data: urls,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
