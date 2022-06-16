import { addToWorkQueue } from 'src/jobs';
import {
  BUSINESS_LINES,
  CONTRACTS,
  EXTERNAL_OFFERS_ORIGINS,
  JOBS,
} from 'src/constants';
import { getOpportunity } from 'src/controllers/Opportunity';
import _ from 'lodash';
import { findConstantFromValue, findOfferStatus } from 'src/utils/Finding';

const getAirtableOpportunityFields = (opportunity, candidates) => {
  const commonFields = {
    OpportunityId: opportunity.id,
    Entreprise: opportunity.company,
    Titre: opportunity.title,
    Nom: opportunity.recruiterName,
    Prénom: opportunity.recruiterFirstName,
    Mail: opportunity.recruiterMail,
    'Contact mail': opportunity.contactMail,
    Téléphone: opportunity.recruiterPhone,
    Fonction: opportunity.recruiterPosition,
    'Description poste': opportunity.description,
    'Description entreprise': opportunity.companyDescription,
    'Compétences requises': opportunity.skills,
    'Pré-requis': opportunity.prerequisites,
    "Secteur d'activité": _.uniq(
      opportunity.businessLines.map(({ name }) => {
        return findConstantFromValue(name, BUSINESS_LINES).label;
      })
    ),
    Publique: opportunity.isPublic,
    Externe: opportunity.isExternal,
    'Lien externe': opportunity.link,
    'Origine externe': findConstantFromValue(
      opportunity.externalOrigin,
      EXTERNAL_OFFERS_ORIGINS
    ).label,
    Validé: opportunity.isValidated,
    Archivé: opportunity.isArchived,
    'Date de création': opportunity.createdAt,
    Département: opportunity.department,
    Adresse: opportunity.address,
    Contrat: findConstantFromValue(opportunity.contract, CONTRACTS).label,
    'Début de contrat': opportunity.startOfContract,
    'Fin de contrat': opportunity.endOfContract,
    'Temps partiel ?': opportunity.isPartTime,
    'Nombre de postes': opportunity.numberOfPositions,
    'Souhaite être recontacté': opportunity.beContacted,
    'Message personnalisé': opportunity.message,
    'Permis de conduire': opportunity.driversLicense,
    'Jours et horaires': opportunity.workingHours,
    Salaire: opportunity.salary,
    'Autres précisions': opportunity.otherInfo,
  };

  return candidates && candidates.length > 0
    ? [
        ...candidates.map((candidate) => {
          const offerStatus = findOfferStatus(
            candidate.status,
            opportunity.isPublic,
            candidate.recommended
          );

          return {
            ...commonFields,
            OpportunityUserId: candidate.id,
            Candidat: `${candidate.User.firstName} ${candidate.User.lastName}`,
            Statut: offerStatus.label,
            Commentaire: candidate.note,
            'Recommandée ?': candidate.recommended,
          };
        }),
        commonFields,
      ]
    : commonFields;
};

// TODO remove after removing Airtable
const createAirtableJob = async (opportunityId, type) => {
  const { userOpportunity: candidates, ...opportunity } = await getOpportunity(
    opportunityId,
    true
  );

  const airtableFields = getAirtableOpportunityFields(opportunity, candidates);

  return addToWorkQueue({
    type: type,
    tableName: process.env.AIRTABLE_OFFERS,
    fields: airtableFields,
  });
};

const updateExternalDBOpportunity = async (
  opportunityId,
  isSameOpportunity
) => {
  try {
    // TODO remove after removing Airtable
    if (Array.isArray(opportunityId)) {
      await Promise.all([
        opportunityId.map(async (singleOpportunityId) => {
          return createAirtableJob(
            singleOpportunityId,
            JOBS.JOB_TYPES.UPDATE_AIRTABLE
          );
        }),
      ]);
    } else {
      await createAirtableJob(opportunityId, JOBS.JOB_TYPES.UPDATE_AIRTABLE);
    }

    await addToWorkQueue({
      type: JOBS.JOB_TYPES.CREATE_OR_UPDATE_SALESFORCE_OPPORTUNITY,
      opportunityId,
      isSameOpportunity,
    });
    console.log('Updated table in external database');
  } catch (err) {
    console.error(err);
    console.log('Failed to update offer in external database');
  }
};

const createExternalDBOpportunity = async (
  opportunityId,
  isSameOpportunity = false
) => {
  try {
    // TODO remove after removing Airtable
    if (Array.isArray(opportunityId)) {
      await Promise.all([
        opportunityId.map(async (singleOpportunityId) => {
          return createAirtableJob(
            singleOpportunityId,
            JOBS.JOB_TYPES.INSERT_AIRTABLE
          );
        }),
      ]);
    } else {
      await createAirtableJob(opportunityId, JOBS.JOB_TYPES.INSERT_AIRTABLE);
    }

    await addToWorkQueue({
      type: JOBS.JOB_TYPES.CREATE_OR_UPDATE_SALESFORCE_OPPORTUNITY,
      opportunityId,
      isSameOpportunity,
    });
    console.log('Created table in external database');
  } catch (err) {
    console.error(err);
    console.log('Failed to create offer in external database');
  }
};

export { createExternalDBOpportunity, updateExternalDBOpportunity };
