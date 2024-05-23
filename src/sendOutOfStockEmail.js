const nodemailer = require('nodemailer');

module.exports = async (pharmacistEmail, medicineName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Hotmail',
      auth: {
        user: 'yoyo_ah360@hotmail.com',
        pass: 'password',
      },
    });

    const mailOptions = {
      from: 'yoyo_ah360@hotmail.com',
      to: pharmacistEmail,
      subject: 'Medicine Out of Stock Notification',
      text: `The medicine "${medicineName}" is out of stock.`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent: Medicine Out of Stock Notification');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
