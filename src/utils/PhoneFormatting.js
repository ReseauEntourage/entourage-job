import { phone } from 'phone';
import { EUROPE, WORLD } from 'src/constants/countries';

const isFrenchPhone = (phoneNumber) => {
  const { isValid } = phone(phoneNumber, { country: 'FRA' });
  return isValid;
};

const isEuropeanPhone = (phoneNumber) => {
  return EUROPE.some(({ code }) => {
    const { isValid } = phone(phoneNumber, { country: code });
    return isValid;
  });
};

const isWorldPhone = (phoneNumber) => {
  return WORLD.some(({ code }) => {
    const { isValid } = phone(phoneNumber, { country: code });
    return isValid;
  });
};

const getFormattedPhone = (phoneNumber) => {
  const { isValid: isFrenchPhone, phoneNumber: formattedFrenchPhoneNumber } =
    phone(phoneNumber, {
      country: 'FRA',
    });

  if (isFrenchPhone) {
    return formattedFrenchPhoneNumber;
  }

  for (let i = 0; i < EUROPE.length; i += 1) {
    const {
      isValid: isEuropeanPhone,
      phoneNumber: formattedEuropeanPhoneNumber,
    } = phone(phoneNumber, {
      country: EUROPE[i].code,
    });
    if (isEuropeanPhone) {
      return formattedEuropeanPhoneNumber;
    }
  }

  for (let i = 0; i < WORLD.length; i += 1) {
    const { isValid: isWorldPhone, phoneNumber: formattedWorldPhoneNumber } =
      phone(phoneNumber, {
        country: WORLD[i].code,
      });
    if (isWorldPhone) {
      return formattedWorldPhoneNumber;
    }
  }

  return null;
};

const isValidPhone = (phoneNumber) => {
  return (
    isFrenchPhone(phoneNumber) ||
    isEuropeanPhone(phoneNumber) ||
    isWorldPhone(phoneNumber)
  );
};

export {
  isValidPhone,
  isFrenchPhone,
  isEuropeanPhone,
  isWorldPhone,
  getFormattedPhone,
};
