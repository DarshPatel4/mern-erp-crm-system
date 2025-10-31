const nodemailer = require('nodemailer');

// Create transporter (using Gmail as default, can be configured via environment variables)
const createTransporter = () => {
  // If SMTP config is in env, use it
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  } 
  
  // Use Gmail if credentials are provided
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const gmailUser = process.env.GMAIL_USER.trim();
    const gmailPass = process.env.GMAIL_APP_PASSWORD.trim();
    
    // Debug: Log configuration (without exposing password)
    console.log(`📧 Gmail Config: User=${gmailUser}, Password length=${gmailPass.length}`);
    
    if (gmailPass.length !== 16) {
      console.warn(`⚠️  Warning: App Password should be 16 characters. Current length: ${gmailPass.length}`);
    }
    
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass // Must be an App Password, not regular password
      },
      // Add additional options for better error handling
      secure: false,
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  
  // No email configured
  throw new Error('Email service not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env file');
};

// Send contact form email
exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Create email content
    // Use the form submitter's email as the "from" address
    // Note: Some SMTP servers may require the from email to match authenticated email
    // If that fails, it will fall back in the error handling
    const mailOptions = {
      from: `"${name}" <${email}>`, // Use form submitter's email and name
      replyTo: email, // Replies will go to the form submitter
      to: 'darshpatel2531@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Message:</h3>
            <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>This email was sent from the NexusERP Contact Form.</p>
            <p>Submitted at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This email was sent from the NexusERP Contact Form.
Submitted at: ${new Date().toLocaleString()}
      `
    };

    // Try to send email
    let transporter;
    try {
      transporter = createTransporter();
      await transporter.verify(); // Verify transporter configuration
      console.log('✓ Email service configured and verified successfully');
    } catch (error) {
      console.error('\n❌ Email Configuration Error:', error.message);
      
      // Log the submission to console so admin can see it even if email isn't configured
      console.log('\n========== CONTACT FORM SUBMISSION (EMAIL NOT SENT) ==========');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Subject:', subject);
      console.log('Message:', message);
      console.log('Timestamp:', new Date().toISOString());
      console.log('==========================================\n');
      
      // Provide helpful error message
      if (error.code === 'EAUTH' || error.message.includes('Invalid login') || error.message.includes('not accepted')) {
        console.error('\n⚠️  Gmail Authentication Failed!');
        console.error('Please ensure:');
        console.error('1. You have enabled 2-Step Verification on your Google Account');
        console.error('2. You have generated an App Password (not your regular password)');
        console.error('3. In your .env file, set:');
        console.error('   GMAIL_USER=your-email@gmail.com');
        console.error('   GMAIL_APP_PASSWORD=your-16-character-app-password');
        console.error('\nSee server/EMAIL_SETUP.md for detailed instructions.\n');
      }
      
      // Still return success to user, but log that email wasn't sent
      return res.json({ 
        message: 'Thank you for your message! We will get back to you soon.',
        note: 'Note: Email service not configured. Submission logged to server console.'
      });
    }

    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✓ Contact form email sent successfully to darshpatel2531@gmail.com from ${email}`);
    } catch (sendError) {
      console.error('Error sending email:', sendError.message);
      
      // If sending fails due to "from" address mismatch, try with authenticated email
      if (sendError.message && sendError.message.includes('from')) {
        console.warn('⚠️  From address rejected, trying with authenticated email...');
        const authenticatedEmail = process.env.FROM_EMAIL || process.env.GMAIL_USER;
        if (authenticatedEmail) {
          mailOptions.from = `"${name}" <${authenticatedEmail}>`;
          mailOptions.replyTo = email; // Keep replyTo as the form submitter
          await transporter.sendMail(mailOptions);
          console.log(`✓ Contact form email sent successfully (using authenticated from address)`);
        } else {
          throw sendError;
        }
      } else {
        throw sendError; // Re-throw if it's a different error
      }
    }

    res.json({ 
      message: 'Thank you for your message! We will get back to you within 24 hours.'
    });
  } catch (error) {
    console.error('Error sending contact email:', error);
    
    // Log the submission even if email fails
    console.log('Contact form submission (email failed):', {
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      timestamp: new Date(),
      error: error.message
    });
    
    res.status(500).json({ 
      error: 'Failed to send message. Please try again later or contact us directly at support@nexuserp.com'
    });
  }
};

// Test email connection endpoint
exports.testEmailConnection = async (req, res) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    
    res.json({ 
      success: true,
      message: 'Email service is configured correctly!',
      user: process.env.GMAIL_USER,
      passwordLength: process.env.GMAIL_APP_PASSWORD?.length || 0
    });
  } catch (error) {
    console.error('Email connection test failed:', error.message);
    
    let errorDetails = {
      success: false,
      error: error.message,
      code: error.code
    };
    
    if (error.code === 'EAUTH') {
      errorDetails.troubleshooting = [
        '1. Verify 2-Step Verification is ENABLED on your Google Account',
        '2. Generate a NEW App Password from https://myaccount.google.com/apppasswords',
        '3. Make sure you\'re using the App Password (16 characters), not your regular password',
        '4. Copy the App Password exactly (remove any spaces)',
        '5. Update .env file and restart the server'
      ];
    }
    
    res.status(500).json(errorDetails);
  }
};


