const express = require('express');
const router = express.Router();

const enrollmentController = require('../controllers/enrollmentController');
const { isAuthenticated } = require('../middleware/auth');



// Enroll in course
router.post('/courses/:courseId/enroll', isAuthenticated, enrollmentController.enrollInCourse);

module.exports = router;
