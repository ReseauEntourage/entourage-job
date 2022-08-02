import _ from 'lodash';
import jsforce from 'jsforce';

import {
  findConstantFromValue,
  getZoneFromDepartment,
} from 'src/utils/Finding';

import { BUSINESS_LINES } from 'src/constants';
import { ADMIN_ZONES } from 'src/constants/departements';

let salesforce;

const ERROR_CODES = {
  DUPLICATES_DETECTED: 'DUPLICATES_DETECTED',
};

export function formatBusinessLines(businessLines) {
  return _.uniq(
    businessLines.map(({ name }) => {
      return findConstantFromValue(name, BUSINESS_LINES).label;
    })
  )
    .toString()
    .replace(',', ';');
}

export function formatDepartment(department) {
  if (!department) {
    return 'National';
  }
  return _.capitalize(ADMIN_ZONES[getZoneFromDepartment(department)]);
}

export function formatCompanyName(name, address, department) {
  return `${name} - ${address} - ${department}`;
}

export function parseAddress(address) {
  if (address) {
    const parsedPostalCode = address.match(/\d{5}/gi);

    if (parsedPostalCode && parsedPostalCode.length > 0) {
      const postalCode = parsedPostalCode[0];
      const parsedAddress = address.split(postalCode);
      return {
        street: parsedAddress[0]?.replace(',', '').trim(),
        city: parsedAddress[1]?.replace(',', '').trim(),
        postalCode: parsedPostalCode[0],
      };
    } else {
      const number = address.match(/\d*,/gi);

      if (number) {
        const parsedStreet = address
          .replace(number[0], number[0].replace(',', ''))
          .split(',');

        return {
          street: parsedStreet[0]?.replace(',', '').trim(),
          city: parsedStreet[1]?.replace(',', '').trim(),
        };
      }
      return { street: address.replace(',', '').trim() };
    }
  }
  return {
    street: '',
    city: '',
    postalCode: '',
  };
}

export async function loginToSalesforce(salesforceInstance) {
  await salesforceInstance.login(
    process.env.SALESFORCE_USERNAME,
    process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN
  );
}

export async function getSalesforceInstance() {
  if (!salesforce) {
    salesforce = new jsforce.Connection({
      oauth2: {
        loginUrl: process.env.SALESFORCE_LOGIN_URL,
        clientId: process.env.SALESFORCE_CLIENT_ID,
        clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
        redirectUri: process.env.SALESFORCE_REDIRECT_URI,
      },
    });
    await loginToSalesforce(salesforce);
  } else {
    try {
      await salesforce.identity();
    } catch (err) {
      console.log(`Error after check if still logged in '${err.message}'`);
      await loginToSalesforce(salesforce);
    }
  }
  return salesforce;
}

export async function createRecord(name, params) {
  const salesforceInstance = await getSalesforceInstance();

  try {
    const result = await salesforceInstance.sobject(name).create(params);
    if (Array.isArray(result)) {
      return result.map(({ id, success, errors }) => {
        if (!success) {
          console.error(errors);
          return null;
        }
        return id;
      });
    }
    return result.id;
  } catch (err) {
    if (err.errorCode === ERROR_CODES.DUPLICATES_DETECTED) {
      return err.duplicateResut.matchResults[0].matchRecords[0].record.Id;
    }
    console.error(err);
    throw err;
  }
}

export async function upsertRecord(name, params, extIdField, findIdFunction) {
  const salesforceInstance = await getSalesforceInstance();

  try {
    const result = await salesforceInstance
      .sobject(name)
      .upsert(params, extIdField);

    if (Array.isArray(result)) {
      return Promise.all(
        result.map(async ({ id, success, errors }, index) => {
          if (!success) {
            console.error(errors);
            return null;
          }
          return id || (await findIdFunction(params[index][extIdField]));
        })
      );
    }
    return result.id || (await findIdFunction(params[extIdField]));
  } catch (err) {
    if (err.errorCode === ERROR_CODES.DUPLICATES_DETECTED) {
      return err.duplicateResut.matchResults[0].matchRecords[0].record.Id;
    }
    console.error(err);
    throw err;
  }
}
