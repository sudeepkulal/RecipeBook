const nodemailer = require('nodemailer');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Submit feedback and email it
// @route   POST /api/feedback
// @access  Public
exports.submitFeedback = asyncHandler(async (req, res, next) => {
  const { email, subject, message } = req.body;

  if (!email || !message) {
    return next(new ErrorResponse('Please provide email and feedback message', 400));
  }

  // Setup transporter using SMTP details stored in .env
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, // Send feedback to self
    subject: `Feedback: ${subject || 'General RecipeBook Feedback'}`,
    text: `Feedback from: ${email}\n\nMessage:\n${message}`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Feedback sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    // If SMTP fails, still respond with error but return graceful structured details
    return next(
      new ErrorResponse(
        'Feedback received on server, but email SMTP delivery failed. Please check server credentials.',
        500
      )
    );
  }
});
