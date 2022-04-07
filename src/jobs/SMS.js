import { sendSMS } from 'src/controllers/Mailjet';

const sendSMSBackground = async (params) => {
  return sendSMS(params);
};

export { sendSMSBackground };
