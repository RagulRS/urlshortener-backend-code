const express = require('express');
const {
    createShortUrl,
    redirectToOriginalUrl,
    getUserUrls,
} = require('../controllers/urlController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route for creating a short URL
router.post('/create', protect, createShortUrl);

// Route for redirecting to the original URL
router.get('/:shortUrl', redirectToOriginalUrl);

// Route for fetching all URLs created by the logged-in user
router.get('/user/urls', protect, getUserUrls);

module.exports = router;
