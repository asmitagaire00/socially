module.exports = {
  emailFrom: process.env.EMAIL_FROM,
  smtpOptions: {
    host: process.env.EMAIL_HOST,
    port: 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
};
