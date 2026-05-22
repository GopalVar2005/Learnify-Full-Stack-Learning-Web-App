const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const { isAuthenticated, isInstructor } = require('../middleware/auth');

// Student dashboard
router.get('/student/dashboard', isAuthenticated, dashboardController.studentDashboard);

// Instructor dashboard
router.get('/instructor/dashboard', isAuthenticated, isInstructor, dashboardController.instructorDashboard);

module.exports = router;

