const express = require('express');
const router = express.Router();

const enrollmentController = require('../controllers/enrollmentController');
const { isAuthenticated } = require('../middleware/auth');

// Get user enrollments
router.get('/user/enrollments', isAuthenticated, enrollmentController.getUserEnrollments);

// Enroll in course
router.post('/user/:courseId/add', isAuthenticated, enrollmentController.enrollInCourse);

module.exports = router;
