const { sendMail } = require('../controllers/Mail');

const sendMailBackground = async ({ toEmail, subject, text, html }) => {
  return sendMail({ toEmail, subject, text, html });
};

module.exports = {
  sendMailBackground,
};
