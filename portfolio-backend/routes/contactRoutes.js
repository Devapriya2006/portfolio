// routes/contactRoutes.js
// Defines the /api/contact route and attaches:
//   - express-validator rules
//   - rate limiter
//   - the controller

const express = require('express');
const { body } = require('express-validator');
const { contactLimiter } = require('../middleware/rateLimiter');
const { submitContact } = require('../controllers/contactController');

const router = express.Router();

// ---------------------------------------------
// Validation rules (using express-validator)
// ---------------------------------------------
const contactValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Subject cannot exceed 200 characters.'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required.')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters.'),
];

// ---------------------------------------------
// POST /api/contact
// ---------------------------------------------
router.post(
  '/',
  contactLimiter,           // Rate limit: max 5 submissions/hour per IP
  contactValidationRules,   // Validate and sanitize inputs
  submitContact             // Business logic
);

module.exports = router;
