const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const { isAuthenticated, isInstructor } = require('../middleware/auth');

// Student dashboard
router.get('/dashboard/student', isAuthenticated, dashboardController.studentDashboard);

// Instructor dashboard
router.get('/dashboard/instructor', isAuthenticated, isInstructor, dashboardController.instructorDashboard);

module.exports = router;

