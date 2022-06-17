import {
  createRecord,
  formatBusinessLines,
  formatCompanyName,
  formatDepartment,
  getSalesforceInstance,
  parseAddress,
  upsertRecord,
} from 'src/utils/Salesforce';

import {
  findConstantFromValue,
  findOfferStatus,
  getZoneFromDepartment,
} from 'src/utils/Finding';

import { CONTRACTS, EXTERNAL_OFFERS_ORIGINS } from 'src/constants';

import _ from 'lodash';

import { ADMIN_ZONES } from 'src/constants/departements';

const OBJECT_NAMES = {
  COMPANY: 'Account',
  PROCESS: 'Processus_d_offres__c',
  OFFER: 'Offre_d_emploi__c',
  CONTACT: 'Contact',
  BINOME: 'Binome__c',
};

export const RECORD_TYPE_IDS = {
  COACH: '0127Q000000Ub9wQAC',
  CANDIDATE: '0127Q000000UbNVQA0',
  COMPANY: '0127Q000000Uhq0QAC',
};

export async function createCompany({
  name,
  businessLines,
  address,
  department,
  mainCompanySfId,
}) {
  const parsedAddress = parseAddress(address);

  return createRecord(OBJECT_NAMES.COMPANY, {
    Name: mainCompanySfId ? formatCompanyName(name, address, department) : name,
    Industry: formatBusinessLines(businessLines),
    BillingStreet: parsedAddress.street,
    BillingCity: parsedAddress.city,
    BillingPostalCode: parsedAddress.postalCode,
    Reseaux__c: 'LinkedOut',
    Antenne__c: formatDepartment(department),
    ParentId: mainCompanySfId,
  });
}

export async function createContact({
  firstName,
  lastName,
  email,
  phone,
  position,
  department,
  companySfId,
}) {
  return createRecord(OBJECT_NAMES.CONTACT, {
    LastName: lastName,
    FirstName: firstName,
    Email: email,
    Phone: phone,
    Title: position,
    AccountId: companySfId,
    Type_de_contact__c: 'Entreprise',
    Reseaux__c: 'LinkedOut',
    RecordTypeId: RECORD_TYPE_IDS.COMPANY,
    Antenne__c: formatDepartment(department),
  });
}

function mapSalesforceOfferFields({
  id,
  company,
  title,
  businessLines,
  contract,
  isPartTime,
  isPublic,
  isExternal,
  link,
  isValidated,
  isArchived,
  department,
  address,
  workingHours,
  salary,
  message,
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
  companySfId,
  contactSfId,
}) {
  const externalOriginConstant = findConstantFromValue(
    externalOrigin,
    EXTERNAL_OFFERS_ORIGINS
  );

  return {
    ID__c: id,
    Name: `${title} - ${formatCompanyName(company, address, department)}`,
    Titre__c: title,
    Entreprise_Recruteuse__c: companySfId,
    Secteur_d_activite_de_l_offre__c: formatBusinessLines(businessLines),
    Type_de_contrat__c: findConstantFromValue(contract, CONTRACTS).label,
    Temps_partiel__c: isPartTime,
    Offre_publique__c: isPublic,
    Offre_externe__c: isExternal,
    Offre_archiv_e__c: isArchived,
    Offre_valid_e__c: isValidated,
    Lien_externe__c: link,
    Lien_Offre_Backoffice__c:
      process.env.FRONT_URL + '/backoffice/admin/offres/' + id,
    Departement__c: department,
    Adresse_de_l_offre__c: address,
    Jours_et_horaires_de_travail__c: workingHours,
    Salaire_et_complement__c: salary,
    Message_au_candidat__c: message,
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
    Prenom_Nom_du_recruteur__c: contactSfId,
    Contact_cr_existant__c: true,
    Antenne__c: _.capitalize(ADMIN_ZONES[getZoneFromDepartment(department)]),
  };
}

function mapSalesforceProcessFields({
  id,
  firstName,
  lastName,
  company,
  isPublic,
  status,
  seen,
  bookmarked,
  archived,
  recommended,
  note,
  candidateId,
  offerId,
  offerTitle,
  binomeSfId,
  offerSfId,
}) {
  console.log(candidateId, offerTitle, offerId);
  return {
    ID__c: id,
    Name: `${firstName} ${lastName} - ${offerTitle} - ${company}`,
    Statut__c: findOfferStatus(status, isPublic, recommended).label,
    Vue__c: seen,
    Favoris__c: bookmarked,
    Archiv_e__c: archived,
    Recommandee__c: recommended,
    Commentaire__c: note,
    Binome__c: binomeSfId,
    Offre_d_emploi__c: offerSfId,
    Lien_Offre_Backoffice__c: `${process.env.FRONT_URL}/backoffice/admin/membres/${candidateId}/offres/${offerId}`,
  };
}

export async function createOrUpdateProcess(params) {
  let records;
  if (Array.isArray(params)) {
    records = params.map((singleParams) => {
      return mapSalesforceProcessFields(singleParams);
    });
  } else {
    records = mapSalesforceProcessFields(params);
  }
  return upsertRecord(OBJECT_NAMES.PROCESS, records, 'ID__c', findProcessById);
}

export async function createOrUpdateOffer(params) {
  let records;
  if (Array.isArray(params)) {
    records = params.map((singleParams) => {
      return mapSalesforceOfferFields(singleParams);
    });
  } else {
    records = mapSalesforceOfferFields(params);
  }

  return upsertRecord(OBJECT_NAMES.OFFER, records, 'ID__c', findOfferById);
}

export async function searchCompanyByName(search) {
  const escapedSearch = search.replace(/[?&|!{}[\]()^~*:\\"'+-]/gi, '\\$&');
  const salesforceInstance = await getSalesforceInstance();
  const { searchRecords } = await salesforceInstance.search(
    `FIND {${escapedSearch}} IN NAME FIELDS RETURNING ${OBJECT_NAMES.COMPANY}(Id) LIMIT 1`
  );

  return searchRecords[0]?.Id;
}

export async function findBinomeByCandidateEmail(email) {
  const candidateSfId = await findContactByEmail(
    email,
    RECORD_TYPE_IDS.CANDIDATE
  );
  if (!candidateSfId) {
    return null;
  }
  return findBinomeByCandidateSfId(candidateSfId);
}

export async function findContactByEmail(email, recordType) {
  const salesforceInstance = await getSalesforceInstance();
  const { records } = await salesforceInstance.query(
    `SELECT Id FROM ${OBJECT_NAMES.CONTACT} WHERE (Email_Id__c='${email}' OR Email='${email}') AND RecordTypeId='${recordType}' LIMIT 1`
  );
  return records[0]?.Id;
}

export async function findBinomeByCandidateSfId(id) {
  const salesforceInstance = await getSalesforceInstance();
  const { records } = await salesforceInstance.query(
    `SELECT Id FROM ${OBJECT_NAMES.BINOME} WHERE Candidat_LinkedOut__c='${id}' LIMIT 1`
  );
  return records[0]?.Id;
}

export async function findOfferById(id) {
  const salesforceInstance = await getSalesforceInstance();
  const { records } = await salesforceInstance.query(
    `SELECT Id FROM ${OBJECT_NAMES.OFFER} WHERE ID__c='${id}' LIMIT 1`
  );
  return records[0]?.Id;
}

export async function findOfferRelationsById(id) {
  const salesforceInstance = await getSalesforceInstance();
  const { records } = await salesforceInstance.query(
    `SELECT Entreprise_Recruteuse__c, Prenom_Nom_du_recruteur__c FROM ${OBJECT_NAMES.OFFER} WHERE ID__c='${id}' LIMIT 1`
  );
  return {
    companySfId: records[0]?.Entreprise_Recruteuse__c,
    contactSfId: records[0]?.Prenom_Nom_du_recruteur__c,
  };
}

export async function findProcessById(id) {
  const salesforceInstance = await getSalesforceInstance();
  const { records } = await salesforceInstance.query(
    `SELECT Id FROM ${OBJECT_NAMES.PROCESS} WHERE ID__c='${id}' LIMIT 1`
  );
  return records[0]?.Id;
}
