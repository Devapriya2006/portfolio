const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { markEmailSent, saveContact } = require('../services/contactStore');

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[char];
  });

const hasEmailConfig = () => Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const buildEmailHTML = ({ name, email, subject, message }) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);
  const sentAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">New Portfolio Message</h1>
      </div>
      <div style="padding: 30px; background: #fff;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555; width: 100px;">Name:</td>
            <td style="padding: 10px; color: #333;">${safeName}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; font-weight: bold; color: #555;">Email:</td>
            <td style="padding: 10px;"><a href="mailto:${safeEmail}" style="color: #667eea;">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555;">Subject:</td>
            <td style="padding: 10px; color: #333;">${safeSubject}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 20px; background: #f0f0f5; border-left: 4px solid #667eea; border-radius: 4px;">
          <p style="font-weight: bold; color: #555; margin: 0 0 10px;">Message:</p>
          <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${safeMessage}</p>
        </div>
      </div>
      <div style="padding: 15px; text-align: center; background: #f0f0f5; color: #888; font-size: 12px;">
        Sent via your Portfolio Contact Form - ${sentAt} IST
      </div>
    </div>
  `;
};

const buildThankYouHTML = (name) => {
  const safeName = escapeHtml(name);

  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0;">Thanks, ${safeName}!</h1>
      </div>
      <div style="padding: 30px; background: #fff; border-radius: 0 0 8px 8px; border: 1px solid #eee;">
        <p style="color: #333; line-height: 1.6;">
          I have received your message and will get back to you as soon as possible, usually within 24-48 hours.
        </p>
        <p style="color: #333; line-height: 1.6;">
          In the meantime, feel free to check out my projects on my portfolio.
        </p>
        <p style="color: #555; margin-top: 30px;">
          - Devapriya Paul Kundu<br>
          <small style="color: #888;">Computer Science & Technology Student | Web Developer</small>
        </p>
      </div>
    </div>
  `;
};

const submitContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please fix the errors below.',
        errors: errors.array().map((error) => ({ field: error.path, message: error.msg })),
      });
    }

    const { name, email, subject = 'Portfolio Contact', message } = req.body;

    const { contact, storage } = await saveContact({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
    });

    let emailSent = false;

    if (hasEmailConfig()) {
      try {
        const transporter = createTransporter();

        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_TO || process.env.EMAIL_USER,
          replyTo: email,
          subject: `[Portfolio] ${subject}`,
          html: buildEmailHTML({ name, email, subject, message }),
        });

        await transporter.sendMail({
          from: `"Devapriya Paul Kundu" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Thanks for reaching out!',
          html: buildThankYouHTML(name),
        });

        emailSent = true;
        await markEmailSent(contact, storage);
      } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
      }
    } else {
      console.warn('Email credentials are not configured. Contact was saved without sending email.');
    }

    return res.status(201).json({
      success: true,
      message: emailSent
        ? "Message received! I've also sent a confirmation to your email. I'll get back to you soon."
        : "Message received! I'll get back to you soon.",
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt,
        storage,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContact };
