const mailchimp = require('@mailchimp/mailchimp_marketing');

if (!process.env.NODE_ENV.includes('test')) {
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: 'us12',
  });
}

export default mailchimp;
