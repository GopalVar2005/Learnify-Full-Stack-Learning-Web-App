const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');


// Register new user
router.post('/register', validateRegistration, authController.register);


// Login user
router.post('/login', validateLogin, authController.login);

// Logout user
router.get('/logout', authController.logout);

// Get current user
router.get('/current_user', authController.getCurrentUser);

module.exports = router;
