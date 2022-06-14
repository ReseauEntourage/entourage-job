import jsforce from 'jsforce';
import {
  findConstantFromValue,
  findOfferStatus,
  getZoneFromDepartment,
} from 'src/utils/Finding';
import { ADMIN_ZONES } from 'src/constants/departements';
import _ from 'lodash';
import {
  BUSINESS_LINES,
  CONTRACTS,
  EXTERNAL_OFFERS_ORIGINS,
} from 'src/constants';

let salesforce;

const OBJECT_NAMES = {
  COMPANY: 'Account',
  PROCESS: 'Processus_d_offres__c',
  OFFER: 'Offre_d_emploi__c',
  CONTACT: 'Contact',
  BINOME: 'Binome__c',
};

const RECORD_TYPE_IDS = {
  COACH: '0127Q000000Ub9wQAC',
  CANDIDATE: '0127Q000000UbNVQA0',
  COMPANY: '0127Q000000Uhq0QAC',
};

const ERROR_CODES = {
  DUPLICATES_DETECTED: 'DUPLICATES_DETECTED',
};

function formatBusinessLines(businessLines) {
  return _.uniq(
    businessLines.map(({ name }) => {
      return findConstantFromValue(name, BUSINESS_LINES).label;
    })
  )
    .toString()
    .replace(',', ';');
}

function formatDepartment(department) {
  if (!department) {
    return 'National';
  }
  return _.capitalize(ADMIN_ZONES[getZoneFromDepartment(department)]);
}

function parseAddress(address) {
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

async function loginToSalesforce(salesforceInstance) {
  await salesforceInstance.login(
    process.env.SALESFORCE_USERNAME,
    process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN
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
    const result = await salesforceInstance.sobject(name).create(params);
    if (Array.isArray(result)) {
      return result.map(({ id }) => {
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

async function upsertRecord(name, params, extIdField, findIdFunction) {
  const salesforceInstance = await getInstance();

  try {
    const result = await salesforceInstance
      .sobject(name)
      .upsert(params, extIdField);

    if (Array.isArray(result)) {
      return Promise.all(
        result.map(async ({ id }, index) => {
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

async function createCompany({
  name,
  businessLines,
  address,
  department,
  mainCompanySfId,
}) {
  const parsedAddress = parseAddress(address);

  return createRecord(OBJECT_NAMES.COMPANY, {
    Name: mainCompanySfId ? `${name} - ${address} - ${department}` : name,
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
    Name: company + ' - ' + title,
    Titre__c: title,
    Entreprise_Recruteuse__c: companySfId,
    Secteur_d_activite_de_l_offre__c: formatBusinessLines(businessLines),
    Type_de_contrat__c: findConstantFromValue(contract, CONTRACTS).label,
    Temps_partiel__c: isPartTime,
    Offre_publique__c: isPublic,
    Offre_externe__c: isExternal,
    Offre_archiv_e__c: isArchived,
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

async function createOrUpdateOffer(params) {
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
  binomeId,
  offerId,
}) {
  return {
    ID__c: id,
    Name: firstName + ' ' + lastName + ' - ' + company,
    Statut__c: findOfferStatus(status, isPublic, recommended).label,
    Vue__c: seen,
    Favoris__c: bookmarked,
    Archiv_e__c: archived,
    Recommandee__c: recommended,
    Commentaire__c: note,
    Binome__c: binomeId,
    Offre_d_emploi__c: offerId,
  };
}

async function createOrUpdateProcess(params) {
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

async function searchCompanyByName(search) {
  const salesforceInstance = await getInstance();
  const { searchRecords } = await salesforceInstance.search(
    `FIND {${search}} IN NAME FIELDS RETURNING ${OBJECT_NAMES.COMPANY}(Id)`
  );
  return searchRecords[0]?.Id;
}

async function findBinomeByCandidateEmail(email) {
  const candidateSfId = await findContactByEmail(
    email,
    RECORD_TYPE_IDS.CANDIDATE
  );
  return findBinomeByCandidateSfId(candidateSfId);
}

async function findContactByEmail(email, recordType) {
  const salesforceInstance = await getInstance();
  const { records } = await salesforceInstance.query(
    `SELECT Id FROM ${OBJECT_NAMES.CONTACT} WHERE Email='${email}' AND RecordTypeId='${recordType}'`
  );
  return records[0]?.Id;
}

async function findBinomeByCandidateSfId(id) {
  const salesforceInstance = await getInstance();
  const { records } = await salesforceInstance.query(
    `SELECT Id FROM ${OBJECT_NAMES.BINOME} WHERE Candidat_LinkedOut__c='${id}'`
  );
  return records[0]?.Id;
}

async function findOfferById(id) {
  const salesforceInstance = await getInstance();
  const { records } = await salesforceInstance.query(
    `SELECT Id FROM ${OBJECT_NAMES.OFFER} WHERE ID__c='${id}'`
  );
  return records[0]?.Id;
}

async function findOfferRelationsById(id) {
  const salesforceInstance = await getInstance();
  const { records } = await salesforceInstance.query(
    `SELECT Id, Entreprise_Recruteuse__c, Prenom_Nom_du_recruteur__c FROM ${OBJECT_NAMES.OFFER} WHERE ID__c='${id}'`
  );
  return {
    companySfId: records[0]?.Entreprise_Recruteuse__c,
    contactSfId: records[0]?.Prenom_Nom_du_recruteur__c,
  };
}

async function findProcessById(id) {
  const salesforceInstance = await getInstance();
  const { records } = await salesforceInstance.query(
    `SELECT Id FROM ${OBJECT_NAMES.PROCESS} WHERE ID__c='${id}'`
  );
  return records[0]?.Id;
}

async function getProcessToCreate(process, offerSfId) {
  const { candidateEmail, offerId, ...restProcess } = process;
  const binomeSfId = await findBinomeByCandidateEmail(candidateEmail);

  return {
    ...restProcess,
    binomeId: binomeSfId,
    offerId: offerSfId || (await findOfferById(offerId)),
  };
}

async function createOrUpdateSalesforceOpportunityUser(
  opportunityUser,
  offerSfId
) {
  let processToCreate;
  if (Array.isArray(opportunityUser)) {
    processToCreate = await Promise.all(
      opportunityUser.map(async (singleProcess) => {
        return getProcessToCreate(singleProcess, offerSfId);
      })
    );
  } else {
    processToCreate = await getProcessToCreate(opportunityUser, offerSfId);
  }

  return createOrUpdateProcess(processToCreate);
}

async function createCompanyAndContactFromOpportunity(
  opportunity,
  mainCompanySfId,
  mainContactSfId
) {
  const {
    recruiterMail,
    contactMail,
    recruiterFirstName,
    recruiterName,
    department,
    recruiterPhone,
    recruiterPosition,
    company,
    businessLines,
    address,
  } = opportunity;

  let { companySfId, contactSfId } = await findOfferRelationsById(
    opportunity.id
  );

  if (mainCompanySfId) {
    companySfId = await createCompany({
      name: company,
      businessLines,
      address,
      department,
      mainCompanySfId,
    });
  } else {
    if (!companySfId) {
      companySfId = await searchCompanyByName(company);
    }
    if (!companySfId) {
      companySfId = await createCompany({
        name: company,
        businessLines,
        address,
        department,
      });
    }
  }

  if (mainContactSfId) {
    contactSfId = mainContactSfId;
  } else {
    if (!contactSfId && (contactMail || recruiterMail)) {
      contactSfId = await findContactByEmail(
        contactMail || recruiterMail,
        RECORD_TYPE_IDS.COMPANY
      );
    }
    if (!contactSfId) {
      contactSfId = await createContact(
        contactMail
          ? {
              lastName: 'Inconnu',
              email: contactMail,
              department,
              companySfId: mainCompanySfId || companySfId,
            }
          : {
              firstName: recruiterFirstName,
              lastName: recruiterName,
              email: recruiterMail,
              phone: recruiterPhone,
              position: recruiterPosition,
              department,
              companySfId: mainCompanySfId || companySfId,
            }
      );
    }
  }

  return { contactSfId, companySfId };
}

export async function createOrUpdateSalesforceOpportunity(
  opportunityAndOpportunityUser,
  isSameOpportunity
) {
  if (Array.isArray(opportunityAndOpportunityUser)) {
    let opportunityUsersToCreate = [];
    let mainCompanySfId;
    let mainContactSfId;
    if (isSameOpportunity) {
      const {
        recruiterFirstName,
        recruiterName,
        recruiterMail,
        recruiterPhone,
        recruiterPosition,
        company,
        businessLines,
      } = opportunityAndOpportunityUser[0].opportunity;
      ({ companySfId: mainCompanySfId, contactSfId: mainContactSfId } =
        await createCompanyAndContactFromOpportunity({
          recruiterFirstName,
          recruiterName,
          recruiterMail,
          recruiterPhone,
          recruiterPosition,
          company,
          businessLines,
        }));
    }
    const opportunitiesToCreate = await Promise.all(
      opportunityAndOpportunityUser.map(
        async ({ opportunity, opportunityUser }) => {
          const { contactSfId, companySfId } =
            await createCompanyAndContactFromOpportunity(
              opportunity,
              mainCompanySfId,
              mainContactSfId
            );

          opportunityUsersToCreate = [
            ...opportunityUsersToCreate,
            ...(Array.isArray(opportunityUser)
              ? opportunityUser
              : [opportunityUser]),
          ];

          return {
            ...opportunity,
            contactSfId,
            companySfId,
          };
        }
      )
    );

    await createOrUpdateOffer(opportunitiesToCreate);

    await createOrUpdateSalesforceOpportunityUser(opportunityUsersToCreate);
  } else {
    const { opportunity, opportunityUser } = opportunityAndOpportunityUser;
    const { contactSfId, companySfId } =
      await createCompanyAndContactFromOpportunity(opportunity);

    let offerSfId = await createOrUpdateOffer({
      ...opportunity,
      contactSfId,
      companySfId,
    });

    await createOrUpdateSalesforceOpportunityUser(opportunityUser, offerSfId);
  }
}
