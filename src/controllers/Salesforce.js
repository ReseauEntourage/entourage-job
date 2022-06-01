import jsforce from 'jsforce';
import { getZoneFromDepartment } from '../utils/Finding';
import { ADMIN_ZONES } from '../constants/departements';
import _ from 'lodash';

let salesforce;

const RECORD_TYPE_IDS = {
  COACH: '0127Q000000Ub9wQAC',
  CANDIDAT: '0127Q000000UbNVQA0',
  COMPANY: '0127Q000000Uhq0QAC',
};

const ERROR_CODES = {
  DUPLICATES_DETECTED: 'DUPLICATES_DETECTED',
};

async function loginToSalesforce(salesforceInstance) {
  await salesforceInstance.login(
    process.env.SALESFORCE_USERNAME,
    process.env.SALESFORCE_PASSWORD
  );
}

async function getInstance() {
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
      await loginToSalesforce(salesforce);
    }
  }
  return salesforce;
}

async function createRecord(name, params) {
  const salesforceInstance = await getInstance();

  try {
    const createdRecord = await salesforceInstance.sobject(name).create(params);
    return createdRecord.id;
  } catch (err) {
    if (err.errorCode === ERROR_CODES.DUPLICATES_DETECTED) {
      return err.duplicateResut.matchResults[0].matchRecords[0].record.Id;
    }
    console.error(err);
    return err;
  }
}

export async function createCompany(name, businessLine, address, department) {
  let street = '';
  let city = '';
  let postalCode = '';

  const parsedPostalCode = address.match(/\d{5}/gi);

  if (parsedPostalCode && parsedPostalCode.length > 0) {
    postalCode = parsedPostalCode[0];

    const parsedAddress = address.split(postalCode);
    street = parsedAddress[0]?.replace(',', '').trim();
    city = parsedAddress[1]?.replace(',', '').trim();
  } else {
    const number = address.match(/\d*,/gi);
    const parsedStreet = address
      .replace(number[0], number[0].replace(',', ''))
      .split(',');
    street = parsedStreet[0]?.trim();
    city = parsedStreet[1]?.trim();
  }

  //TODO Antenne generic

  return createRecord('Account', {
    Name: name,
    Industry: businessLine,
    BillingStreet: street,
    BillingCity: city,
    BillingPostalCode: postalCode,
    Reseaux__c: 'LinkedOut',
    Antenne__c: _.capitalize(ADMIN_ZONES[getZoneFromDepartment(department)]),
  });
}

export async function createContact(
  firstName,
  lastName,
  mail,
  phone,
  position,
  department,
  companyId
) {
  return createRecord('Contact', {
    LastName: lastName,
    FirstName: firstName,
    Email: mail,
    Phone: phone,
    Title: position,
    AccountId: companyId,
    Type_de_contact__c: 'Entreprise',
    Reseaux__c: 'LinkedOut',
    RecordTypeId: RECORD_TYPE_IDS.COMPANY,
    Antenne__c: _.capitalize(ADMIN_ZONES[getZoneFromDepartment(department)]),
  });
}

export async function searchCompanyByName(search) {
  const salesforceInstance = await getInstance();
  const { searchRecords } = await salesforceInstance.search(
    `FIND {${search}} IN ALL FIELDS RETURNING Account`
  );
  return searchRecords[0];
}

export async function searchUserByEmail(email) {
  const salesforceInstance = await getInstance();
  const { searchRecords } = await salesforceInstance.search(
    `FIND {${email}} IN EMAIL FIELDS RETURNING Contact(Id, FirstName, Name, Email, RecordTypeId where RecordTypeId='${RECORD_TYPE_IDS.CANDIDAT}')`
  );
  return searchRecords[0];
}
