const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
};

// ---------- Base HTML Email Wrapper ----------
const wrapEmail = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kinghenry Writes</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f7fc; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f7fc;">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d6efd, #6610f2); border-radius: 12px 12px 0 0; padding: 30px; text-align: center;">
              <h1 style="color:#ffffff; margin:0; font-size:28px; font-weight:bold;">Kinghenry Writes</h1>
              <p style="color:#e0e7ff; margin:10px 0 0; font-size:16px;">Your trusted booking platform</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; text-align: center; color: #888888; font-size: 13px;">
              <p style="margin:0 0 5px;">© ${new Date().getFullYear()} Kinghenry Writes. All rights reserved.</p>
              <p style="margin:0;">123 Business Street, City, Country</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ---------- Formatting Helpers ----------
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ---------- Styled Templates ----------

// Customer Booking Confirmation
const bookingConfirmationCustomer = (booking) => {
  const content = `
    <h2 style="color:#0d6efd; margin-top:0;">Booking Confirmed ✅</h2>
    <p style="font-size:16px; line-height:1.6; color:#333333;">
      Your session has been successfully booked. Here are the details:
    </p>
    <table width="100%" cellpadding="10" cellspacing="0" border="0" style="background-color:#f8f9fa; border-radius:8px; margin: 20px 0;">
      <tr>
        <td style="font-weight:bold; color:#555555; width:130px;">Service</td>
        <td style="color:#333333;">${booking.service_name}</td>
      </tr>
      <tr>
        <td style="font-weight:bold; color:#555555;">Provider</td>
        <td style="color:#333333;">${booking.provider_name}</td>
      </tr>
      <tr>
        <td style="font-weight:bold; color:#555555;">Date</td>
        <td style="color:#333333;">${formatDate(booking.start_time)}</td>
      </tr>
      <tr>
        <td style="font-weight:bold; color:#555555;">Time</td>
        <td style="color:#333333;">${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}</td>
      </tr>
      <tr>
        <td style="font-weight:bold; color:#555555;">Status</td>
        <td style="color:#333333;"><span style="background-color:#28a745; color:#ffffff; padding:4px 12px; border-radius:12px; font-size:14px;">${booking.status}</span></td>
      </tr>
    </table>
    <p style="font-size:14px; color:#666666;">If you need to cancel or reschedule, please visit your <a href="${process.env.CLIENT_URL || '#'}/dashboard" style="color:#0d6efd;">dashboard</a>.</p>
  `;
  return wrapEmail(content);
};

// Provider New Booking Notification
const bookingConfirmationProvider = (booking) => {
  const content = `
    <h2 style="color:#0d6efd; margin-top:0;">New Booking 🔔</h2>
    <p style="font-size:16px; line-height:1.6; color:#333333;">
      A customer has just booked your service.
    </p>
    <table width="100%" cellpadding="10" cellspacing="0" border="0" style="background-color:#f8f9fa; border-radius:8px; margin: 20px 0;">
      <tr>
        <td style="font-weight:bold; color:#555555; width:130px;">Service</td>
        <td style="color:#333333;">${booking.service_name}</td>
      </tr>
      <tr>
        <td style="font-weight:bold; color:#555555;">Customer</td>
        <td style="color:#333333;">${booking.customer_name}</td>
      </tr>
      <tr>
        <td style="font-weight:bold; color:#555555;">Date</td>
        <td style="color:#333333;">${formatDate(booking.start_time)}</td>
      </tr>
      <tr>
        <td style="font-weight:bold; color:#555555;">Time</td>
        <td style="color:#333333;">${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}</td>
      </tr>
    </table>
    <p style="font-size:14px; color:#666666;">View all your bookings in your <a href="${process.env.CLIENT_URL || '#'}/provider/bookings" style="color:#0d6efd;">provider dashboard</a>.</p>
  `;
  return wrapEmail(content);
};

// Customer Cancellation
const bookingCancellationCustomer = (booking) => {
  const content = `
    <h2 style="color:#dc3545; margin-top:0;">Booking Cancelled ❌</h2>
    <p style="font-size:16px; line-height:1.6; color:#333333;">
      Your booking for <strong>${booking.service_name}</strong> on ${formatDate(booking.start_time)} has been cancelled.
    </p>
    <p style="font-size:14px; color:#666666;">If this was a mistake, please book again from our <a href="${process.env.CLIENT_URL || '#'}/services" style="color:#0d6efd;">services page</a>.</p>
  `;
  return wrapEmail(content);
};

// Provider Cancellation
const bookingCancellationProvider = (booking) => {
  const content = `
    <h2 style="color:#dc3545; margin-top:0;">Booking Cancelled ❌</h2>
    <p style="font-size:16px; line-height:1.6; color:#333333;">
      The booking for <strong>${booking.service_name}</strong> by ${booking.customer_name} on ${formatDate(booking.start_time)} has been cancelled.
    </p>
    <p style="font-size:14px; color:#666666;">Check your <a href="${process.env.CLIENT_URL || '#'}/provider/bookings" style="color:#0d6efd;">dashboard</a> for updated schedule.</p>
  `;
  return wrapEmail(content);
};

// Customer Completion
const bookingCompletedCustomer = (booking) => {
  const content = `
    <h2 style="color:#28a745; margin-top:0;">Session Completed 🎉</h2>
    <p style="font-size:16px; line-height:1.6; color:#333333;">
      Your session <strong>${booking.service_name}</strong> with ${booking.provider_name} has been marked as completed.
    </p>
    <p style="font-size:14px; color:#666666;">Thank you for trusting SwiftBook! We’d love to hear your feedback.</p>
  `;
  return wrapEmail(content);
};

module.exports = {
  sendEmail,
  bookingConfirmationCustomer,
  bookingConfirmationProvider,
  bookingCancellationCustomer,
  bookingCancellationProvider,
  bookingCompletedCustomer,
};