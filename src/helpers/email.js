const accessEnv = require('./accessEnv');

const NODE_ENV = accessEnv('NODE_ENV');
const EMAIL_USER = accessEnv('EMAIL_USER');
const EMAIL_PASS = accessEnv('EMAIL_PASS');

// use mailtrap smtp for dev purposes only
const devConfig = {
  emailFrom: 'socially@socially.com',
  smtpOptions: {
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  },
};

// use gmail smtp
const prodConfig = {
  emailFrom: 'email.socially.app@gmail.com',
  smtpOptions: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  },
};

module.exports = NODE_ENV === 'production' ? prodConfig : devConfig;
