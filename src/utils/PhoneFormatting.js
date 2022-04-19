import { phone } from 'phone';

const isValidPhone = (phoneNumber) => {
  if (!phoneNumber) {
    return false;
  }
  const { isValid } = phone(phoneNumber);
  return phoneNumber.includes('+') && isValid;
};

export { isValidPhone };
