import { formatCompanyName } from 'src/utils/Salesforce';

import {
  createCompany,
  createContact,
  createOrUpdateOffer,
  createOrUpdateProcess,
  findBinomeByCandidateEmail,
  findContactByEmail,
  findOfferById,
  findOfferRelationsById,
  searchCompanyByName,
  RECORD_TYPE_IDS,
} from 'src/helpers/Salesforce';

async function findOrCreateCompany({
  name,
  address,
  department,
  businessLines,
}) {
  let companySfId = await searchCompanyByName(
    formatCompanyName(name, address, department)
  );

  if (!companySfId) {
    companySfId = await searchCompanyByName(`${name}`);
  }
  if (!companySfId) {
    companySfId = await createCompany({
      name,
      businessLines,
      address,
      department,
    });
  }
  return companySfId;
}

async function findOrCreateContact({
  contactMail,
  recruiterMail,
  department,
  mainCompanySfId,
  companySfId,
  recruiterFirstName,
  recruiterName,
  recruiterPhone,
  recruiterPosition,
}) {
  let contactSfId;
  if (contactMail || recruiterMail) {
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
  return contactSfId;
}

async function findOrCreateCompanyAndContactFromOffer(
  offer,
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
  } = offer;

  let { companySfId, contactSfId } = await findOfferRelationsById(offer.id);

  if (mainCompanySfId) {
    companySfId = await createCompany({
      name: company,
      businessLines,
      address,
      department,
      mainCompanySfId,
    });
  } else if (!companySfId) {
    companySfId = await findOrCreateCompany({
      name: company,
      businessLines,
      address,
      department,
    });
  }

  if (mainContactSfId) {
    contactSfId = mainContactSfId;
  } else if (!contactSfId) {
    contactSfId = await findOrCreateContact({
      recruiterFirstName,
      recruiterName,
      recruiterMail,
      recruiterPosition,
      recruiterPhone,
      contactMail,
      department,
      companySfId,
      mainCompanySfId,
    });
  }

  return { contactSfId, companySfId };
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

async function createOrUpdateSalesforceProcess(process, offerSfId) {
  let processToCreate;
  if (Array.isArray(process)) {
    processToCreate = await Promise.all(
      process.map(async (singleProcess) => {
        return getProcessToCreate(singleProcess, offerSfId);
      })
    );
  } else {
    processToCreate = await getProcessToCreate(process, offerSfId);
  }

  return createOrUpdateProcess(processToCreate);
}

export async function createOrUpdateSalesforceOffer(
  offerAndProcess,
  isSameOffer
) {
  if (Array.isArray(offerAndProcess)) {
    let mainCompanySfId;
    let mainContactSfId;
    if (isSameOffer) {
      const {
        recruiterFirstName,
        recruiterName,
        recruiterMail,
        recruiterPhone,
        recruiterPosition,
        company,
        businessLines,
      } = offerAndProcess[0].offer;

      ({ companySfId: mainCompanySfId, contactSfId: mainContactSfId } =
        await findOrCreateCompanyAndContactFromOffer({
          recruiterFirstName,
          recruiterName,
          recruiterMail,
          recruiterPhone,
          recruiterPosition,
          company,
          businessLines,
        }));
    }
    const offersAndProcessesToCreate = offerAndProcess.reduce(
      (acc, curr) => {
        return {
          offers: [...acc.offers, curr.offer],
          processes: [
            ...acc.processes,
            ...(Array.isArray(curr.process) ? curr.process : [curr.process]),
          ],
        };
      },
      { offers: [], processes: [] }
    );

    const offersToCreate = await Promise.all(
      offersAndProcessesToCreate.offers.map(async (offer) => {
        const { contactSfId, companySfId } =
          await findOrCreateCompanyAndContactFromOffer(
            offer,
            mainCompanySfId,
            mainContactSfId
          );

        return {
          ...offer,
          contactSfId,
          companySfId,
        };
      })
    );

    await createOrUpdateOffer(offersToCreate);

    await createOrUpdateSalesforceProcess(offersAndProcessesToCreate.processes);
  } else {
    const { offer, process } = offerAndProcess;
    const { contactSfId, companySfId } =
      await findOrCreateCompanyAndContactFromOffer(offer);

    let offerSfId = await createOrUpdateOffer({
      ...offer,
      contactSfId,
      companySfId,
    });

    await createOrUpdateSalesforceProcess(process, offerSfId);
  }
}
