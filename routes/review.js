const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');
const { isAuthenticated, isEnrolled } = require('../middleware/auth');
const { validateReview } = require('../middleware/validation');

// Create review (only enrolled users can review)
router.post('/courses/:id/review', isAuthenticated, isEnrolled, validateReview, reviewController.createReview);

module.exports = router;
