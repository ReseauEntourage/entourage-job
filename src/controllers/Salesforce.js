import jsforce from 'jsforce';
import { findConstantFromValue, getZoneFromDepartment } from '../utils/Finding';
import { ADMIN_ZONES } from '../constants/departements';
import _ from 'lodash';
import {
  BUSINESS_LINES,
  CONTRACTS,
  EXTERNAL_OFFERS_ORIGINS,
} from 'src/constants';

let salesforce;

const RECORD_TYPE_IDS = {
  COACH: '0127Q000000Ub9wQAC',
  CANDIDAT: '0127Q000000UbNVQA0',
  COMPANY: '0127Q000000Uhq0QAC',
};

const ERROR_CODES = {
  DUPLICATES_DETECTED: 'DUPLICATES_DETECTED',
};

function parseAddress(address) {
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
    const parsedStreet = address
      .replace(number[0], number[0].replace(',', ''))
      .split(',');
    return {
      street: parsedStreet[0]?.replace(',', '').trim(),
      city: parsedStreet[1]?.replace(',', '').trim(),
    };
  }
}

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

export async function createCompany({
  name,
  businessLine,
  address,
  department,
}) {
  const parsedAddress = parseAddress(address);

  //TODO Antenne generic

  return createRecord('Account', {
    Name: name,
    Industry: businessLine,
    BillingStreet: parsedAddress.street,
    BillingCity: parsedAddress.city,
    BillingPostalCode: parsedAddress.postalCode,
    Reseaux__c: 'LinkedOut',
    Antenne__c: _.capitalize(ADMIN_ZONES[getZoneFromDepartment(department)]),
  });
}

export async function createContact({
  firstName,
  lastName,
  mail,
  phone,
  position,
  department,
  companyId,
}) {
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

export async function createOffer({
  id,
  company,
  title,
  businessLines,
  contract,
  isPartTime,
  isPublic,
  isExternal,
  department,
  address,
  workingHours,
  salary,
  companyDescription,
  description,
  otherInfo,
  driversLicense,
  externalOrigin,
  recruiterFirstName,
  recruiterName,
  recruiterMail,
  recruiterPhone,
  recruiterPosition,
  contactMail,
  companyId,
  contactId,
}) {
  // TODO search for contactMail to associate real contact
  const externalOriginConstant = findConstantFromValue(
    externalOrigin,
    EXTERNAL_OFFERS_ORIGINS
  );

  console.log(
    _.uniq(
      businessLines.map(({ name }) => {
        return findConstantFromValue(name, BUSINESS_LINES).label;
      })
    )
  );

  return createRecord('Offre_d_emploi__c', {
    ID__c: id,
    Name: company + ' - ' + title,
    Titre__c: title,
    Entreprise_Recruteuse__c: companyId,
    Secteur_d_activite_de_l_offre__c: _.uniq(
      businessLines.map(({ name }) => {
        return findConstantFromValue(name, BUSINESS_LINES).label;
      })
    )
      .toString()
      .replace(',', ';'),
    Type_de_contrat__c: findConstantFromValue(contract, CONTRACTS).label,
    Temps_partiel__c: isPartTime,
    Offre_publique__c: isPublic,
    Offre_externe__c: isExternal,
    Lien_Offre_Backoffice__c:
      process.env.FRONT_URL + '/backoffice/admin/offres/' + id,
    Departement__c: department,
    Adresse_de_l_offre__c: address,
    Jours_et_horaires_de_travail__c: workingHours,
    Salaire_et_complement__c: salary,
    Presentation_de_l_entreprise__c: companyDescription,
    Descriptif_des_missions_proposees__c: description,
    Autre_precision_sur_votre_besoin__c: otherInfo,
    Permis_de_conduire_necessaire__c: driversLicense,
    Source_de_l_offre__c:
      externalOriginConstant.salesforceLabel || externalOriginConstant.label,
    Nom__c: recruiterName,
    Prenom__c: recruiterFirstName,
    Mail_du_recruteur__c: recruiterMail,
    Telephone_du_recruteur__c: recruiterPhone,
    Fonction_du_recruteur__c: recruiterPosition,
    Mail_de_contact__c: contactMail,
    Prenom_Nom_du_recruteur__c: contactId,
    Contact_cr_existant__c: true,
    Antenne__c: _.capitalize(ADMIN_ZONES[getZoneFromDepartment(department)]),
  });
}

export async function searchCompanyByName(search) {
  const salesforceInstance = await getInstance();
  const { searchRecords } = await salesforceInstance.search(
    `FIND {${search}} IN NAME FIELDS RETURNING Account(Id)`
  );
  return searchRecords[0]?.Id;
}

export async function findContactByEmail(email) {
  const salesforceInstance = await getInstance();
  const { records } = await salesforceInstance.query(
    `SELECT Id FROM Contact WHERE Email='${email}' AND RecordTypeId='${RECORD_TYPE_IDS.CANDIDAT}'`
  );
  return records[0]?.Id;
}

export async function findOfferById(id) {
  const salesforceInstance = await getInstance();
  const { records } = await salesforceInstance.query(
    `SELECT Id FROM Offre_d_emploi__c WHERE ID__c='${id}'`
  );
  return records[0]?.Id;
}
