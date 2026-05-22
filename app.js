require('dotenv').config()
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const seedDB = require("./seed.js");
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/User.js')
const cors = require('cors'); // Added for React frontend

const courseRoutes = require("./routes/course.js")
const reviewRoutes = require("./routes/review.js")
const authRoutes = require("./routes/auth.js")
const enrollmentsRoutes = require("./routes/enrollments.js")
const dashboardRoutes = require("./routes/dashboard.js")
const { errorHandler } = require('./middleware/errorHandler')

// Database Connection
// Connects to MongoDB using the URI from environment variables
// Handles connection errors gracefully
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("DB connected successfully")
    })
    .catch((error) => {
        console.log("DB error:", error)
    });

// Session Configuration
// Defines how user sessions are stored and managed
// Uses HTTP-only cookies for security
let configSession = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}

// Middleware Setup
app.use(express.urlencoded({ extended: true }))    // Parses URL-encoded form data
app.use(express.json()); // Parses JSON bodies (Required for React API calls)

// CORS Configuration
// Allows requests from the React frontend running on localhost:5173
// Credentials: true allows cookies (session ID) to be sent across origins
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(session(configSession)) // Initializes session middleware

// Authentication Middleware Setup
app.use(passport.initialize())
app.use(passport.session()) // Persistent login sessions (restore user from session)

// Global Variables Middleware
// Makes 'currentUser' available in all routes (mostly for EJS, but 'req.user' is used in API)
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next()
})

// Passport Configuration
// Configures Local Strategy with User model for authentication
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser()) // Stores user ID in session
passport.deserializeUser(User.deserializeUser()) // Retrieves user from session

// Seed Database (Optional)
// Uncomment to repopulate database with dummy data on startup
seedDB();

// Route Handlers
// Mounts different route files to specific paths
// Note: Some routes are mounted at root '/' because they defined their own prefixes internally
app.use(courseRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(enrollmentsRoutes);
app.use(dashboardRoutes);

// Global Error Handler
// Catches any errors thrown in routes and sends a proper response
app.use(errorHandler);

// Start Server
app.listen(8080, () => {
    console.log(`Server is listening at 8080`)
});

// module.exports=app;  app ko export nhi kr skte