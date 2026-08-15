const { validationResult } = require('express-validator');
const { Resend } = require('resend');

const {
  markEmailSent,
  saveContact,
} = require('../services/contactStore');

const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(process.env.RESEND_API_KEY);
};

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

const hasEmailConfig = () =>
  Boolean(
    process.env.RESEND_API_KEY &&
    process.env.EMAIL_TO &&
    process.env.EMAIL_FROM
  );

// ==========================================
// NOTIFICATION EMAIL
// ==========================================

const buildEmailHTML = ({
  name,
  email,
  subject,
  message,
}) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  const sentAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
  });

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#f9f9f9;border-radius:8px;overflow:hidden;">

      <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:30px;text-align:center;">
        <h1 style="color:white;margin:0;">
          New Portfolio Message
        </h1>
      </div>

      <div style="padding:30px;background:white;">

        <table style="width:100%;border-collapse:collapse;">

          <tr>
            <td style="padding:10px;font-weight:bold;color:#555;">
              Name:
            </td>
            <td style="padding:10px;color:#333;">
              ${safeName}
            </td>
          </tr>

          <tr style="background:#f5f5f5;">
            <td style="padding:10px;font-weight:bold;color:#555;">
              Email:
            </td>
            <td style="padding:10px;">
              <a href="mailto:${safeEmail}">
                ${safeEmail}
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:10px;font-weight:bold;color:#555;">
              Subject:
            </td>
            <td style="padding:10px;color:#333;">
              ${safeSubject}
            </td>
          </tr>

        </table>

        <div style="margin-top:20px;padding:20px;background:#f0f0f5;border-left:4px solid #667eea;">
          <p style="font-weight:bold;color:#555;">
            Message:
          </p>

          <p style="color:#333;line-height:1.6;white-space:pre-wrap;">
            ${safeMessage}
          </p>
        </div>

      </div>

      <div style="padding:15px;text-align:center;background:#f0f0f5;color:#888;font-size:12px;">
        Sent via Portfolio Contact Form - ${sentAt} IST
      </div>

    </div>
  `;
};

// ==========================================
// THANK-YOU EMAIL
// ==========================================

const buildThankYouHTML = (name) => {
  const safeName = escapeHtml(name);

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">

      <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:30px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:white;margin:0;">
          Thanks, ${safeName}! 👋
        </h1>
      </div>

      <div style="padding:30px;background:white;border:1px solid #eee;">

        <p style="color:#333;line-height:1.6;">
          Thank you for reaching out through my portfolio.
          I have successfully received your message.
        </p>

        <p style="color:#333;line-height:1.6;">
          I'll review your message and get back to you as soon as possible,
          usually within 24–48 hours.
        </p>

        <p style="color:#555;margin-top:30px;">
          Best regards,<br>
          <strong>Devapriya Paul Kundu</strong><br>
          <small style="color:#888;">
            Computer Science & Technology Student | Web Developer
          </small>
        </p>

      </div>

    </div>
  `;
};

// ==========================================
// SUBMIT CONTACT
// ==========================================

const submitContact = async (req, res, next) => {
  try {
    // --------------------------------------
    // VALIDATION
    // --------------------------------------

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: errors.array().map((error) => ({
          field: error.path,
          message: error.msg,
        })),
      });
    }

    const {
      name,
      email,
      subject = 'Portfolio Contact',
      message,
    } = req.body;

    // --------------------------------------
    // SAVE CONTACT
    // --------------------------------------

    const { contact, storage } = await saveContact({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
    });

    // --------------------------------------
    // CHECK RESEND CONFIG
    // --------------------------------------

    if (!hasEmailConfig()) {
      console.warn(
        'Missing RESEND_API_KEY, EMAIL_TO or EMAIL_FROM.'
      );

      return res.status(201).json({
        success: true,
        message: "Message received! I'll get back to you soon.",
        data: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          createdAt: contact.createdAt,
          storage,
        },
      });
    }

    const resend = getResend();

    let notificationSent = false;
    let thankYouSent = false;

    // ==========================================
    // 1. SEND MESSAGE TO YOU
    // ==========================================

    try {
      const result = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,

        // When you click Reply, it replies directly to visitor
        replyTo: email,

        subject: `[Portfolio] ${subject}`,

        html: buildEmailHTML({
          name,
          email,
          subject,
          message,
        }),
      });

      console.log(
        'Notification email sent successfully:',
        result
      );

      notificationSent = true;

      await markEmailSent(contact, storage);

    } catch (error) {
      console.error(
        'Notification email failed:',
        error
      );
    }

    // ==========================================
    // 2. SEND THANK-YOU TO VISITOR
    // ==========================================

    try {
      const result = await resend.emails.send({
        from: process.env.EMAIL_FROM,

        // IMPORTANT:
        // This is the visitor's email
        to: email,

        subject: 'Thank you for contacting me!',

        html: buildThankYouHTML(name),
      });

      console.log(
        'Thank-you email sent successfully:',
        result
      );

      thankYouSent = true;

    } catch (error) {
      console.error(
        'Thank-you email failed:',
        error
      );
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    let responseMessage =
      "Message received! I'll get back to you soon.";

    if (notificationSent && thankYouSent) {
      responseMessage =
        "Message received! A confirmation email has also been sent to you.";
    } else if (notificationSent) {
      responseMessage =
        "Message received! I'll get back to you soon.";
    }

    return res.status(201).json({
      success: true,
      message: responseMessage,

      emailStatus: {
        notificationSent,
        thankYouSent,
      },

      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt,
        storage,
      },
    });

  } catch (error) {
    console.error(
      'Contact submission error:',
      error
    );

    next(error);
  }
};

module.exports = {
  submitContact,
};