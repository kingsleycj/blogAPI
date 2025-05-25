const express = require("express")
const router = express.Router();
const authController = require("../controllers/auth.controller")
const profile = require("../controllers/profile.controller")
const protect = require("../middlewares/auth.middleware")
const { loginLimiter, forgotPasswordLimiter } = require("../middlewares/rateLimiter")


// Register route
router.post("/register", authController.register)

// Login route
router.post("/login", loginLimiter, authController.login)

// Protected route: fetch own profile
router.get("/me", protect, profile.viewProfile)

// Refresh Token route
router.post('/refresh-token', authController.refreshToken)

// Logout a user route
router.post("/logout", protect, authController.logout)

// Forgot Password route
router.post("/forgot-password", forgotPasswordLimiter, authController.forgotPassword)

// Reset password route
router.post("/reset-password/:token", authController.resetPassword)

module.exports = router;