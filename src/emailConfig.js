const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const transport = nodemailer.createTransport({
  service: 'Hotmail', // e.g., 'Gmail'
  auth: {
    user: 'yoyo_ah360@hotmail.com',
    pass: '13EBDAEE47',
  },
});

const generateOTP = () => otpGenerator.generate(6, { upperCase: false, specialChars: false });

module.exports = { transport, generateOTP };
