const User = require('../models/User');
const passport = require('passport');
const { catchAsync } = require('../middleware/errorHandler');

// Register new user
// Creates a new user in DB and logs them in immediately
const register = catchAsync(async (req, res, next) => {
  const { email, password, username, role } = req.body;
  // Default role is 'student' if not provided
  const user = new User({ email, username, role: role || 'student' });
  const newUser = await User.register(user, password);

  // Auto-login after registration
  req.login(newUser, function (err) {
    if (err) return next(err);
    res.status(201).json({ success: true, message: 'Registered successfully', user: newUser });
  });
});

// Login user
// Uses Passport's 'local' strategy to authenticate username/password
const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // Return 401 Unauthorized if credentials match fails
      return res.status(401).json({ success: false, message: info ? info.message : 'Login failed' });
    }
    // Establish session
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ success: true, message: 'Login successful', user });
    });
  })(req, res, next);
};

// Logout user
// Destroys the session and clears the cookie
const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.json({ success: true, message: 'Logged out successfully' });
  });
};

// Get current user
// Helper endpoint for frontend to check if user is logged in
// Returns user object if session exists, else null
const getCurrentUser = (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser
};

