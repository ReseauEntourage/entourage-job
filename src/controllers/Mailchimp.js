const mailchimp = require('@mailchimp/mailchimp_marketing');

if (!process.env.NODE_ENV.includes('test')) {
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: 'us12',
  });
}

const sendToMailchimp = (email, zone, status) => {
  let tags = [];
  if (zone) {
    tags = [...tags, ...(Array.isArray(zone) ? zone : [zone])];
  }

  if (status) {
    tags = [...tags, ...(Array.isArray(status) ? status : [status])];
  }

  if (process.env.NODE_ENV.includes('test')) {
    return;
  }

  return mailchimp.lists.setListMember(
    process.env.MAILCHIMP_AUDIENCE_ID,
    email,
    {
      email_address: email,
      status_if_new: 'subscribed',
      tags,
    }
  );
};

export { sendToMailchimp };
