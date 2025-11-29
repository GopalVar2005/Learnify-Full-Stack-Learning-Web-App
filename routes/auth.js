const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');

// Show registration form
router.get('/register', authController.showRegisterForm);

// Register new user
router.post('/register', validateRegistration, authController.register);

// Show login form
router.get('/login', authController.showLoginForm);

// Login user
router.post('/login', validateLogin, authController.login);

// Logout user
router.get('/logout', authController.logout);

module.exports = router;
