import { phone } from 'phone';

const isValidPhone = (phoneNumber) => {
  const { isValid } = phone(phoneNumber);
  return phoneNumber.includes('+') && isValid;
};

export { isValidPhone };
