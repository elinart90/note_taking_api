const nodemailer = require('nodemailer');

const sendEmail = async ({ emailTo, subject, code, content }) => {
  try {
    // Create a transporter with secure connection for Gmail
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use TLS for Gmail (recommended for security)
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates for development (if needed)
      }, 
    });

    // Construct the email message with improved formatting
    const message = {
      from: process.env.SENDER_EMAIL,
      to: emailTo,
      subject: subject,
      html: `
        <div>
          <h3>Use this code below to ${content}:</h3>
          <p><strong>Code:</strong> ${code}</p>
        </div>
      `,
    };  

    // Send the email with error handling
    await transporter.sendMail(message);
    console.log('Email sent successfully!'); // Log success message

  } catch (error) {
    console.error('Error sending email:', error.message); // Log error message
  }
};

module.exports = sendEmail;