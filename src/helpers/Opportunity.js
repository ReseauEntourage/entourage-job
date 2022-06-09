import { Op } from 'sequelize';
import { searchInColumnWhereOption } from 'src/utils/DatabaseQueries';
import {
  getFiltersObjectsFromQueryParams,
  getOfferOptions,
} from 'src/utils/Filters';
import {
  BUSINESS_LINES,
  CONTRACTS,
  EXTERNAL_OFFERS_ORIGINS,
  JOBS,
  MAILJET_TEMPLATES,
  OPPORTUNITY_FILTERS_DATA,
} from 'src/constants';
import _ from 'lodash';
import {
  findConstantFromValue,
  findOfferStatus,
  getAdminMailsFromDepartment,
  getAdminMailsFromZone,
  getRelatedUser,
} from 'src/utils/Finding';
import { addToWorkQueue } from 'src/jobs';
import { getOpportunity } from 'src/controllers/Opportunity';
import { isValidPhone } from 'src/utils/PhoneFormatting';
import { getShortenedOfferURL } from 'src/utils/Mutating';
import { models } from 'src/db/models';
import { getMailjetVariablesForPrivateOrPublicOffer } from 'src/utils/Mailjet';

const { BusinessLine, User, User_Candidat, Opportunity_User } = models;

const ATTRIBUTES_OPPORTUNITY_CANDIDATES = [
  'id',
  'updatedAt',
  'createdAt',
  'title',
  'company',
  'description',
  'companyDescription',
  'numberOfPositions',
  'prerequisites',
  'skills',
  'contract',
  'endOfContract',
  'startOfContract',
  'isPartTime',
  'recruiterName',
  'recruiterFirstName',
  'recruiterPosition',
  'isPublic',
  'isValidated',
  'isExternal',
  'link',
  'externalOrigin',
  'recruiterMail',
  'date',
  'department',
  'message',
  'address',
  'driversLicense',
  'workingHours',
  'salary',
  'otherInfo',
  'createdBy',
];

const INCLUDE_OPPORTUNITY_CANDIDATE = [
  {
    model: User,
    attributes: [
      'id',
      'email',
      'firstName',
      'lastName',
      'gender',
      'zone',
      'phone',
    ],
    include: [
      {
        model: User_Candidat,
        as: 'candidat',
        attributes: ['employed', 'hidden', 'note', 'url'],
        include: [
          {
            model: User,
            as: 'coach',
            attributes: ['id', 'email', 'firstName', 'lastName', 'zone'],
          },
        ],
      },
    ],
  },
];

const INCLUDE_OPPORTUNITY_COMPLETE_WITHOUT_BUSINESS_LINES = [
  {
    model: Opportunity_User,
    as: 'userOpportunity',
    attributes: [
      'id',
      'UserId',
      'status',
      'seen',
      'bookmarked',
      'archived',
      'note',
      'updatedAt',
      'recommended',
    ],
    include: INCLUDE_OPPORTUNITY_CANDIDATE,
  },
];

const INCLUDE_OPPORTUNITY_COMPLETE = [
  ...INCLUDE_OPPORTUNITY_COMPLETE_WITHOUT_BUSINESS_LINES,
  {
    model: BusinessLine,
    as: 'businessLines',
    attributes: ['name', 'order'],
    through: { attributes: [] },
  },
];

const INCLUDE_OPPORTUNITY_COMPLETE_ADMIN_WITHOUT_BUSINESS_LINES = [
  {
    model: Opportunity_User,
    as: 'userOpportunity',
    include: [
      {
        model: User,
        attributes: [
          'id',
          'email',
          'firstName',
          'lastName',
          'gender',
          'email',
          'zone',
        ],
        paranoid: false,
      },
    ],
    attributes: [
      'id',
      'UserId',
      'status',
      'bookmarked',
      'archived',
      'note',
      'seen',
      'recommended',
    ],
  },
];

const INCLUDE_OPPORTUNITY_COMPLETE_ADMIN = [
  ...INCLUDE_OPPORTUNITY_COMPLETE_ADMIN_WITHOUT_BUSINESS_LINES,
  {
    model: BusinessLine,
    as: 'businessLines',
    attributes: ['name', 'order'],
    through: { attributes: [] },
  },
];

const opportunityAttributes = {
  ATTRIBUTES_OPPORTUNITY_CANDIDATES,
  INCLUDE_OPPORTUNITY_CANDIDATE,
  INCLUDE_OPPORTUNITY_COMPLETE_WITHOUT_BUSINESS_LINES,
  INCLUDE_OPPORTUNITY_COMPLETE,
  INCLUDE_OPPORTUNITY_COMPLETE_ADMIN_WITHOUT_BUSINESS_LINES,
  INCLUDE_OPPORTUNITY_COMPLETE_ADMIN,
};

const getOfferSearchOptions = (search) => {
  if (search) {
    return {
      [Op.or]: [
        searchInColumnWhereOption('Opportunity.title', search),
        searchInColumnWhereOption('Opportunity.company', search),
        searchInColumnWhereOption('Opportunity.recruiterName', search),
        searchInColumnWhereOption('Opportunity.recruiterFirstName', search),
        searchInColumnWhereOption('Opportunity.recruiterMail', search),
        searchInColumnWhereOption('Opportunity.recruiterPosition', search),
        searchInColumnWhereOption('Opportunity.recruiterPhone', search),
        searchInColumnWhereOption('Opportunity.description', search),
        searchInColumnWhereOption('Opportunity.companyDescription', search),
        searchInColumnWhereOption('Opportunity.skills', search),
        searchInColumnWhereOption('Opportunity.prerequisites', search),
        searchInColumnWhereOption('Opportunity.department', search),
        searchInColumnWhereOption('Opportunity.contract', search),
        searchInColumnWhereOption('Opportunity.message', search),
        searchInColumnWhereOption('Opportunity.address', search),
        searchInColumnWhereOption('Opportunity.department', search),
        searchInColumnWhereOption('Opportunity.workingHours', search),
        searchInColumnWhereOption('Opportunity.salary', search),
        searchInColumnWhereOption('Opportunity.otherInfo', search),
      ],
    };
  }
  return {};
};

const destructureOptionsAndParams = (params) => {
  const { search, type: typeParams, ...restParams } = params;

  const filtersObj = getFiltersObjectsFromQueryParams(
    restParams,
    OPPORTUNITY_FILTERS_DATA
  );

  const { status: statusParams, ...restFiltersObj } = filtersObj;

  const searchOptions = getOfferSearchOptions(search);
  const filterOptions = getOfferOptions(restFiltersObj);

  const { businessLines: businessLinesOptions, ...restFilterOptions } =
    filterOptions;

  return {
    typeParams,
    statusParams,
    searchOptions,
    businessLinesOptions: {
      model: BusinessLine,
      as: 'businessLines',
      attributes: ['name', 'order'],
      through: { attributes: [] },
      ...(businessLinesOptions
        ? {
            where: {
              name: businessLinesOptions,
            },
          }
        : {}),
    },
    filterOptions: restFilterOptions,
  };
};

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
    'Origine externe': EXTERNAL_OFFERS_ORIGINS.find((origin) => {
      return opportunity.externalOrigin === origin.value;
    })?.label,
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

const updateTable = async (opportunity, candidates) => {
  const fields = getAirtableOpportunityFields(opportunity, candidates);

  return addToWorkQueue({
    type: JOBS.JOB_TYPES.UPDATE_AIRTABLE,
    tableName: process.env.AIRTABLE_OFFERS,
    fields,
  });
};

const updateOpportunityAirtable = async (opportunityId) => {
  const finalOpportunity = await getOpportunity(opportunityId, true);

  try {
    await updateTable(finalOpportunity, finalOpportunity.userOpportunity);
  } catch (err) {
    console.error(err);
    console.log('Failed to update table with modified offer.');
  }
};

const sendCandidateOfferMessages = (candidates, opportunity) => {
  return Promise.all(
    candidates.map(async (candidat) => {
      const coach = candidat.User ? getRelatedUser(candidat.User) : null;

      const { candidatesAdminMail } = getAdminMailsFromZone(candidat.User.zone);

      await addToWorkQueue({
        type: JOBS.JOB_TYPES.SEND_MAIL,
        toEmail: coach
          ? { to: candidat.User.email, cc: coach.email }
          : candidat.User.email,
        templateId: opportunity.isPublic
          ? MAILJET_TEMPLATES.OFFER_RECOMMENDED
          : MAILJET_TEMPLATES.OFFER_RECEIVED,
        replyTo: candidatesAdminMail,
        variables: {
          offer: getMailjetVariablesForPrivateOrPublicOffer(opportunity, false),
          candidat,
        },
      });

      try {
        const candidatPhone = candidat?.User?.phone;
        if (candidatPhone && isValidPhone(candidatPhone)) {
          await addToWorkQueue({
            type: JOBS.JOB_TYPES.SEND_SMS,
            toPhone: candidatPhone,
            text: `Bonjour,\nUn recruteur vous a personnellement adressé une offre sur LinkedOut. Consultez-la ici et traitez-la avec votre coach: ${await getShortenedOfferURL(
              opportunity.id,
              _.findKey(MAILJET_TEMPLATES, (id) => {
                return id === MAILJET_TEMPLATES.OFFER_RECEIVED;
              })
            )}`,
          });
        }
      } catch (err) {
        console.error(err);
      }

      if (!opportunity.isPublic) {
        await addToWorkQueue(
          {
            type: JOBS.JOB_TYPES.REMINDER_OFFER,
            opportunityId: opportunity.id,
            candidatId: candidat.User.id,
          },
          {
            delay:
              (process.env.OFFER_REMINDER_DELAY
                ? parseFloat(process.env.OFFER_REMINDER_DELAY, 10)
                : 5) *
              3600000 *
              24,
          }
        );
      }
    })
  );
};

const sendOnValidatedOfferMessages = async (opportunity) => {
  const { companiesAdminMail, candidatesAdminMail } =
    getAdminMailsFromDepartment(opportunity.department);

  const variables = getMailjetVariablesForPrivateOrPublicOffer(opportunity);

  await addToWorkQueue({
    type: JOBS.JOB_TYPES.SEND_MAIL,
    toEmail: opportunity.contactMail || opportunity.recruiterMail,
    replyTo: companiesAdminMail,
    templateId: opportunity.isPublic
      ? MAILJET_TEMPLATES.OFFER_VALIDATED_PUBLIC
      : MAILJET_TEMPLATES.OFFER_VALIDATED_PRIVATE,
    variables,
  });

  await addToWorkQueue({
    type: JOBS.JOB_TYPES.SEND_MAIL,
    toEmail: candidatesAdminMail,
    templateId: MAILJET_TEMPLATES.OFFER_VALIDATED_ADMIN,
    variables,
  });

  await addToWorkQueue(
    {
      type: JOBS.JOB_TYPES.NO_RESPONSE_OFFER,
      opportunityId: opportunity.id,
    },
    {
      delay:
        (process.env.OFFER_NO_RESPONSE_DELAY
          ? parseFloat(process.env.OFFER_NO_RESPONSE_DELAY, 10)
          : 15) *
        3600000 *
        24,
    }
  );
};

const sendOnCreatedOfferMessages = async (candidates, opportunity) => {
  const { companiesAdminMail } = getAdminMailsFromDepartment(
    opportunity.department
  );

  const variables = getMailjetVariablesForPrivateOrPublicOffer(opportunity);

  await addToWorkQueue({
    type: JOBS.JOB_TYPES.SEND_MAIL,
    toEmail: companiesAdminMail,
    templateId: MAILJET_TEMPLATES.OFFER_TO_VALIDATE,
    variables,
  });

  await addToWorkQueue({
    type: JOBS.JOB_TYPES.SEND_MAIL,
    toEmail: opportunity.recruiterMail,
    replyTo: companiesAdminMail,
    templateId: MAILJET_TEMPLATES.OFFER_SENT,
    variables,
  });
};

export {
  getOfferOptions,
  getOfferSearchOptions,
  destructureOptionsAndParams,
  getAirtableOpportunityFields,
  updateTable,
  updateOpportunityAirtable,
  sendCandidateOfferMessages,
  sendOnValidatedOfferMessages,
  sendOnCreatedOfferMessages,
  opportunityAttributes,
};
