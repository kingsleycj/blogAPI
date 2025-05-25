const rateLimiter = require("express-rate-limit");

exports.loginLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5,
  message: {
    message: "Too many login attempts. Try again later after 15 mins",
  },
  standardHeaders: true, // Return rate limit info in the Ratelimit-* headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

exports.forgotPasswordLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    message: "Too many login attempts. Try again later after 15 mins",
  },
  standardHeaders: true, // Return rate limit info in the Ratelimit-* headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
