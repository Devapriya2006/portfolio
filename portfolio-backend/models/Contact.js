// models/Contact.js
// Defines the shape of a contact message stored in MongoDB

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    // Sender's full name
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    // Sender's email address
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },

    // Subject line (optional - defaults to "Portfolio Contact")
    subject: {
      type: String,
      trim: true,
      default: 'Portfolio Contact',
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },

    // The actual message
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },

    // IP address of the sender (stored for abuse prevention)
    ipAddress: {
      type: String,
    },

    // Whether the email notification was sent successfully
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

module.exports = mongoose.model('Contact', contactSchema);
