// middleware/rateLimiter.js
// Prevents spam / brute-force by limiting how often a single IP
// can call the contact endpoint.

const rateLimit = require('express-rate-limit');

// General limiter - applied to ALL routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // Max 100 requests per 15 min per IP
  standardHeaders: true,     // Returns rate-limit info in `RateLimit-*` headers
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// Strict limiter - applied ONLY to the contact form endpoint
// Prevents someone from spamming the form
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5,                    // Max 5 contact submissions per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many contact requests. You can submit the form 5 times per hour. Please try again later.',
  },
});

module.exports = { generalLimiter, contactLimiter };
