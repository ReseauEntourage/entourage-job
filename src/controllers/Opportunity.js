import {
  BUSINESS_LINES,
  CONTRACTS,
  JOBS,
  MAILJET_TEMPLATES,
  NEWSLETTER_TAGS,
  OFFER_ADMIN_FILTERS_DATA,
  OFFER_CANDIDATE_FILTERS_DATA,
} from 'src/constants';

import { addToWorkQueue } from 'src/jobs';

import { cleanOpportunity } from 'src/utils';
import {
  findConstantFromValue,
  getAdminMailsFromDepartment,
  getZoneFromDepartment,
} from 'src/utils/Finding';

import moment from 'moment';
import { Op } from 'sequelize';

import {
  filterAdminOffersByType,
  filterCandidateOffersByType,
  filterOffersByStatus,
  getOfferOptions,
} from 'src/utils/Filters';

import { models, sequelize } from 'src/db/models';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import _ from 'lodash';
import { getUser } from 'src/controllers/User';
import { getCVbyUserId } from 'src/controllers/CV';
import { sortOpportunities } from 'src/utils/Sorting';

import { sendToMailchimp } from 'src/controllers/Mailchimp';

import { isValidPhone } from 'src/utils/PhoneFormatting';
import {
  destructureOptionsAndParams,
  getAirtableOpportunityFields,
  opportunityAttributes,
  sendJobOfferMessages,
  updateOpportunityAirtable,
  updateTable,
} from 'src/helpers/Opportunity';

const {
  BusinessLine,
  Opportunity_User,
  Opportunity_BusinessLine,
  Opportunity,
} = models;

const refreshAirtableOpportunities = async () => {
  const opportunities = await Opportunity.findAll({
    attributes: ['id'],
  });

  await Promise.all(
    opportunities.map((opportunity) => {
      return updateOpportunityAirtable(opportunity.id);
    })
  );
};

const createExternalOpportunity = async (
  data,
  candidatId,
  isAdmin,
  createdById
) => {
  const modelOpportunity = await Opportunity.create({
    ...data,
    isExternal: true,
    isPublic: false,
    isArchived: false,
    isValidated: true,
    createdBy: createdById,
  });

  await Opportunity_User.create({
    OpportunityId: modelOpportunity.id,
    UserId: candidatId,
    status: 0,
  });

  if (data.businessLines) {
    const businessLines = await Promise.all(
      data.businessLines.map(({ name, order = -1 }) => {
        return BusinessLine.create({ name, order });
      })
    );
    await modelOpportunity.addBusinessLines(businessLines);
  }

  const finalOpportunity = await Opportunity.findByPk(modelOpportunity.id, {
    attributes: opportunityAttributes.ATTRIBUTES_OPPORTUNITY_CANDIDATES,
    include: opportunityAttributes.INCLUDE_OPPORTUNITY_COMPLETE,
  });

  const fields = getAirtableOpportunityFields(
    finalOpportunity,
    finalOpportunity.userOpportunity
  );

  await addToWorkQueue({
    type: JOBS.JOB_TYPES.INSERT_AIRTABLE,
    tableName: process.env.AIRTABLE_OFFERS,
    fields,
  });

  const cleanedOpportunity = cleanOpportunity(finalOpportunity);

  if (!isAdmin) {
    const adminMails = getAdminMailsFromDepartment(
      cleanedOpportunity.department
    );
    await addToWorkQueue({
      type: JOBS.JOB_TYPES.SEND_MAIL,
      toEmail: adminMails.companies,
      templateId: MAILJET_TEMPLATES.OFFER_EXTERNAL_RECEIVED,
      variables: {
        ..._.omitBy(
          {
            ...cleanedOpportunity,
            contract: findConstantFromValue(
              cleanedOpportunity.contract,
              CONTRACTS
            ).label,
          },
          _.isNil
        ),
        candidat: _.omitBy(cleanedOpportunity.userOpportunity[0].User, _.isNil),
      },
    });
  }

  return {
    ...cleanedOpportunity,
    userOpportunity: cleanedOpportunity.userOpportunity.find((uo) => {
      return uo.UserId === candidatId;
    }),
  };
};

const createOpportunity = async (data, isAdmin, createdById, disableMail) => {
  console.log(`createOpportunity - Création de l'opportunité`);

  console.log(`Etape 1 - Création de l'opportunité de base`);
  if (data.recruiterPhone && !isValidPhone(data.recruiterPhone)) {
    throw new Error('Invalid phone');
  }
  const modelOpportunity = await Opportunity.create({
    ...data,
    isValidated: !!isAdmin,
    createdBy: createdById,
  });

  if (data.businessLines) {
    console.log(`Etape 2 - BusinessLine`);
    const businessLines = await Promise.all(
      data.businessLines.map(({ name, order = -1 }) => {
        return BusinessLine.create({ name, order });
      })
    );
    await modelOpportunity.addBusinessLines(businessLines);
  }

  let candidates = [];
  if (data.candidatesId && data.candidatesId.length > 0) {
    console.log(
      `Etape 4 - Détermine le(s) User(s) à qui l'opportunité s'adresse`
    );
    await Promise.all(
      data.candidatesId.map((candidatId) => {
        return Opportunity_User.create({
          OpportunityId: modelOpportunity.id,
          UserId: candidatId, // to rename in userId,
          recommended: modelOpportunity.isPublic,
        }).then((model) => {
          return model[0];
        });
      })
    );

    candidates = await Opportunity_User.findAll({
      where: {
        UserId: data.candidatesId,
        OpportunityId: modelOpportunity.id,
      },
      include: opportunityAttributes.INCLUDE_OPPORTUNITY_CANDIDATE,
    });
  }

  console.log(`Etape finale - Reprendre l'opportunité complète à retourner`);

  const finalOpportunity = await getOpportunity(modelOpportunity.id, true);

  const cleanedOpportunity = cleanOpportunity(modelOpportunity);

  const fields = getAirtableOpportunityFields(finalOpportunity, candidates);

  await addToWorkQueue({
    type: JOBS.JOB_TYPES.INSERT_AIRTABLE,
    tableName: process.env.AIRTABLE_OFFERS,
    fields,
  });

  if (!isAdmin) {
    const adminMails = getAdminMailsFromDepartment(finalOpportunity.department);
    await addToWorkQueue({
      type: JOBS.JOB_TYPES.SEND_MAIL,
      toEmail: adminMails.companies,
      templateId: MAILJET_TEMPLATES.OFFER_TO_VALIDATE,
      variables: {
        ..._.omitBy(
          {
            ...cleanedOpportunity,
            contract: findConstantFromValue(
              cleanedOpportunity.contract,
              CONTRACTS
            ).label,
          },
          _.isNil
        ),
      },
    });

    const candidatesString =
      !finalOpportunity.isPublic && candidates && candidates.length > 0
        ? candidates
            .map((candidate) => {
              return `${candidate.User.firstName} ${candidate.User.lastName}`;
            })
            .join(',')
        : '';

    const businessLinesString = data.businessLines
      ? data.businessLines
          .map(({ name }) => {
            return findConstantFromValue(name, BUSINESS_LINES).label;
          })
          .join(', ')
      : '';

    await addToWorkQueue({
      type: JOBS.JOB_TYPES.SEND_MAIL,
      toEmail: finalOpportunity.recruiterMail,
      templateId: MAILJET_TEMPLATES.OFFER_SENT,
      variables: {
        ..._.omitBy(
          {
            ...cleanedOpportunity,
            contract: findConstantFromValue(
              cleanedOpportunity.contract,
              CONTRACTS
            ).label,
          },
          _.isNil
        ),
        candidates: candidatesString,
        businessLines: businessLinesString,
      },
    });
  } else if (!disableMail) {
    await sendJobOfferMessages(candidates, finalOpportunity);
  }

  try {
    await sendToMailchimp(
      finalOpportunity.recruiterMail,
      getZoneFromDepartment(finalOpportunity.department),
      NEWSLETTER_TAGS.ENTREPRISE
    );
  } catch (err) {
    console.error(err);
    console.log('Error while sending to Mailchimp');
  }

  return cleanedOpportunity;
};

const deleteOpportunity = (id) => {
  console.log(
    `deleteOpportunity - Suppression d'une opportunité à partir de son id`
  );
  return Opportunity.destroy({
    where: { id },
  });
};

const getOpportunities = async (params) => {
  const {
    typeParams,
    statusParams,
    searchOptions,
    businessLinesOptions,
    filterOptions,
  } = destructureOptionsAndParams(params);

  const options = {
    include: [
      ...opportunityAttributes.INCLUDE_OPPORTUNITY_COMPLETE_ADMIN_WITHOUT_BUSINESS_LINES,
      businessLinesOptions,
    ],
  };

  if (typeParams && typeParams === OFFER_ADMIN_FILTERS_DATA[2].tag) {
    delete filterOptions.isPublic;
  }

  const opportunities = await Opportunity.findAll({
    ...options,
    where: {
      ...searchOptions,
      ...filterOptions,
    },
  });

  const cleanedOpportunites = opportunities.map((model) => {
    return cleanOpportunity(model);
  });

  const filteredTypeOpportunites = filterAdminOffersByType(
    cleanedOpportunites,
    typeParams
  );

  return {
    offers: filterOffersByStatus(filteredTypeOpportunites, statusParams),
  };
};

const countPendingOpportunitiesCount = async (zone) => {
  const locationFilters = DEPARTMENTS_FILTERS.filter((dept) => {
    return zone === dept.zone;
  });
  const filterOptions =
    locationFilters.length > 0
      ? getOfferOptions({ department: locationFilters })
      : {};

  const pendingOpportunitiesCount = await Opportunity.count({
    where: {
      ...filterOptions,
      isValidated: false,
      isArchived: false,
    },
  });

  return {
    pendingOpportunities: pendingOpportunitiesCount,
  };
};

const getLatestOpportunities = async () => {
  const options = {
    include: opportunityAttributes.INCLUDE_OPPORTUNITY_COMPLETE_ADMIN,
  };

  const lastWeek = moment().subtract(7, 'd');

  const opportunities = await Opportunity.findAll({
    ...options,
    where: {
      isPublic: true,
      isValidated: true,
      createdAt: {
        [Op.gt]: lastWeek.toDate(),
      },
    },
  });

  return opportunities.map((model) => {
    return cleanOpportunity(model);
  });
};

const getPublicOpportunities = async () => {
  const opportunities = await Opportunity.findAll({
    include: opportunityAttributes.INCLUDE_OPPORTUNITY_COMPLETE,
    where: {
      isPublic: true,
      isValidated: true,
    },
  });

  return {
    offers: opportunities.map((model) => {
      return cleanOpportunity(model);
    }),
  };
};

const getPrivateUserOpportunities = async (userId, params) => {
  const { statusParams, searchOptions, businessLinesOptions, filterOptions } =
    destructureOptionsAndParams(params);

  console.log(`getOpportunities - Récupérer les opportunités`);
  const opportunityUsers = await Opportunity_User.findAll({
    where: { UserId: userId },
    attributes: ['OpportunityId'],
  });

  const options = {
    include: [
      ...opportunityAttributes.INCLUDE_OPPORTUNITY_COMPLETE_ADMIN_WITHOUT_BUSINESS_LINES,
      businessLinesOptions,
    ],
  };

  const opportunities = await Opportunity.findAll({
    ...options,
    where: {
      id: opportunityUsers.map((model) => {
        return model.OpportunityId;
      }),
      ...searchOptions,
      ...filterOptions,
    },
  });

  const cleanedOpportunities = opportunities.map((model) => {
    return cleanOpportunity(model);
  });

  const filterOpportunitiesByStatus = filterOffersByStatus(
    cleanedOpportunities,
    statusParams,
    userId
  );

  const sortedOpportunities = sortOpportunities(
    filterOpportunitiesByStatus,
    undefined,
    userId
  );

  return {
    offers: sortedOpportunities,
  };
};

const getAllUserOpportunities = async (userId, params = {}) => {
  const {
    typeParams,
    statusParams,
    searchOptions,
    businessLinesOptions,
    filterOptions,
  } = destructureOptionsAndParams(params);

  const opportunityUsers = await Opportunity_User.findAll({
    where: { UserId: userId },
    attributes: ['OpportunityId'],
  });

  const options = {
    attributes: opportunityAttributes.ATTRIBUTES_OPPORTUNITY_CANDIDATES,
    include: [
      ...opportunityAttributes.INCLUDE_OPPORTUNITY_COMPLETE_WITHOUT_BUSINESS_LINES,
      businessLinesOptions,
    ],
  };

  const opportunities = await Opportunity.findAll({
    ...options,
    where: {
      [Op.or]: [
        { isPublic: true, isValidated: true },
        {
          id: opportunityUsers.map((model) => {
            return model.OpportunityId;
          }),
          isPublic: false,
          isValidated: true,
        },
      ],
      ...searchOptions,
      ...filterOptions,
    },
  });

  const finalOpportunities = opportunities.map((model) => {
    const opportunity = cleanOpportunity(model);
    if (
      opportunityUsers.userOpportunity &&
      opportunityUsers.userOpportunity.length > 0
    ) {
      opportunityUsers.userOpportunity.sort((a, b) => {
        return b.updatedAt - a.updatedAt;
      });
    }
    opportunity.userOpportunity = opportunity.userOpportunity.find((uo) => {
      return uo.UserId === userId;
    });
    if (!opportunity.userOpportunity) {
      delete opportunity.userOpportunity;
    }
    return opportunity;
  });

  const sortedOpportunities = sortOpportunities(
    finalOpportunities,
    typeParams === OFFER_CANDIDATE_FILTERS_DATA[0].tag
  );

  const filteredTypeOpportunities = filterCandidateOffersByType(
    sortedOpportunities,
    typeParams
  );

  return filterOffersByStatus(filteredTypeOpportunities, statusParams, userId);
};

const getUnseenUserOpportunitiesCount = async (candidatId) => {
  const user = await getUser(candidatId);
  const cv = await getCVbyUserId(candidatId);

  const locationFilters = DEPARTMENTS_FILTERS.filter((dept) => {
    return cv.locations && cv.locations.length > 0
      ? cv.locations.includes(dept.value)
      : user.zone === dept.zone;
  });

  /*  const businessLinesFilters = BUSINESS_LINES.filter((businessLine) => {
    return (
      cv.businessLines &&
      cv.businessLines.length > 0 &&
      cv.businessLines
        .map(({ name }) => {
          return name;
        })
        .includes(businessLine.value)
    );
  });*/

  const filters = {};
  if (locationFilters.length > 0) {
    filters.department = locationFilters;
  }
  /* if (businessLinesFilters.length > 0) {
    filters.businessLines = businessLinesFilters;
  }*/

  const filterOptions =
    Object.keys(filters).length > 0 ? getOfferOptions(filters) : {};

  const { businessLines: businessLinesOptions, ...restFilterOptions } =
    filterOptions;

  const opportunityUsers = await Opportunity_User.findAll({
    where: { UserId: candidatId },
    attributes: ['OpportunityId'],
  });

  const opportunities = await Opportunity.findAll({
    include: [
      ...opportunityAttributes.INCLUDE_OPPORTUNITY_COMPLETE_WITHOUT_BUSINESS_LINES,
      {
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
    ],
    where: {
      [Op.or]: [
        { isPublic: true, isValidated: true },
        {
          id: opportunityUsers.map((model) => {
            return model.OpportunityId;
          }),
          isPublic: false,
          isValidated: true,
        },
      ],
      ...restFilterOptions,
    },
  });

  const filteredOpportunities = opportunities
    .map((model) => {
      return cleanOpportunity(model);
    })
    .filter((opportunity) => {
      return (
        !opportunity.userOpportunity ||
        opportunity.userOpportunity.length === 0 ||
        !opportunity.userOpportunity.find((opp) => {
          return opp.UserId === candidatId;
        }) ||
        opportunity.userOpportunity.find((opp) => {
          return opp.UserId === candidatId;
        }).seen === false
      );
    });

  return {
    unseenOpportunities: filteredOpportunities.length,
  };
};

const getExternalOpportunitiesCreatedByUserCount = async (userId) => {
  const { count } = await Opportunity.findAndCountAll({
    where: {
      createdBy: userId,
      isExternal: true,
    },
  });
  return count;
};

const getOpportunity = async (opportunityId, isAdmin, candidateId) => {
  if (isAdmin) {
    const model = await Opportunity.findByPk(opportunityId, {
      include: opportunityAttributes.INCLUDE_OPPORTUNITY_COMPLETE,
    });

    return cleanOpportunity(model);
  }

  const userOpportunities = await getAllUserOpportunities(candidateId);
  return userOpportunities.find((opportunity) => {
    return opportunity.id === opportunityId;
  });
};

const addUserToOpportunity = async (opportunityId, userId, seen) => {
  let modelOpportunityUser = await Opportunity_User.findOne({
    where: {
      OpportunityId: opportunityId,
      UserId: userId,
    },
  });

  if (modelOpportunityUser) {
    modelOpportunityUser = await Opportunity_User.update(
      {
        seen: !!seen,
      },
      {
        where: {
          OpportunityId: opportunityId,
          UserId: userId,
        },
        individualHooks: true,
        attributes: [
          'id',
          'UserId',
          'OpportunityId',
          'status',
          'bookmarked',
          'archived',
          'note',
          'seen',
          'recommended',
        ],
      }
    ).then((model) => {
      return model && model.length > 1 && model[1][0];
    });
  } else {
    modelOpportunityUser = await Opportunity_User.create({
      OpportunityId: opportunityId,
      UserId: userId,
      seen: !!seen,
    });
  }

  await updateOpportunityAirtable(opportunityId);
  return modelOpportunityUser;
};

const updateOpportunityUser = async (opportunityUser) => {
  const modelOpportunityUser = await Opportunity_User.update(opportunityUser, {
    where: { id: opportunityUser.id },
    individualHooks: true,
    attributes: [
      'id',
      'UserId',
      'OpportunityId',
      'status',
      'bookmarked',
      'archived',
      'note',
      'seen',
      'recommended',
    ],
  }).then((model) => {
    return model && model.length > 1 && model[1][0];
  });

  await updateOpportunityAirtable(modelOpportunityUser.OpportunityId);

  return modelOpportunityUser;
};

const updateOpportunity = async (opportunity) => {
  const oldOpportunity = await getOpportunity(opportunity.id, true);

  if (opportunity.recruiterPhone && !isValidPhone(opportunity.recruiterPhone)) {
    throw new Error('Invalid phone');
  }
  const modelOpportunity = await Opportunity.update(opportunity, {
    where: { id: opportunity.id },
    include: opportunityAttributes.INCLUDE_OPPORTUNITY_COMPLETE,
    individualHooks: true,
  }).then((model) => {
    return model && model.length > 1 && model[1][0];
  });

  if (opportunity.businessLines) {
    const businessLines = await Promise.all(
      opportunity.businessLines.map(({ name, order = -1 }) => {
        return BusinessLine.create({ name, order });
      })
    );
    await modelOpportunity.addBusinessLines(businessLines);
    await Opportunity_BusinessLine.destroy({
      where: {
        OpportunityId: opportunity.id,
        BusinessLineId: {
          [Op.not]: businessLines.map((bl) => {
            return bl.id;
          }),
        },
      },
    });
  }

  const t = await sequelize.transaction();
  try {
    if (opportunity.candidatesId) {
      const opportunitiesUser = await Promise.all(
        opportunity.candidatesId.map((candidatId) => {
          return Opportunity_User.findOrCreate({
            where: {
              OpportunityId: modelOpportunity.id,
              UserId: candidatId, // to rename in userId
            },
            transaction: t,
          }).then((model) => {
            return model[0];
          });
        })
      );

      if (opportunity.isPublic) {
        await Opportunity_User.update(
          {
            recommended: true,
          },
          {
            where: {
              id: opportunitiesUser.map((opportunityUser) => {
                return opportunityUser.id;
              }),
            },
            transaction: t,
          }
        );
        await Opportunity_User.update(
          {
            recommended: false,
          },
          {
            where: {
              OpportunityId: modelOpportunity.id,
              UserId: {
                [Op.not]: opportunitiesUser.map((opportunityUser) => {
                  return opportunityUser.UserId;
                }),
              },
            },
            transaction: t,
          }
        );
      } else {
        await Opportunity_User.destroy({
          where: {
            OpportunityId: modelOpportunity.id,
            UserId: {
              [Op.not]: opportunitiesUser.map((opportunityUser) => {
                return opportunityUser.UserId;
              }),
            },
          },
          transaction: t,
        });
      }
    }

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }

  let newCandidatesIdsToSendMailTo;

  // Check case where the opportunity has become private and has candidates, to see if there are any new candidates to send mail to
  const newCandidates =
    opportunity.candidatesId &&
    opportunity.candidatesId.length > 0 &&
    opportunity.candidatesId.filter((candidateId) => {
      return !oldOpportunity.userOpportunity.some((oldUserOpp) => {
        return candidateId === oldUserOpp.User.id;
      });
    });

  if (
    newCandidates &&
    newCandidates.length > 0 &&
    modelOpportunity.isValidated
  ) {
    newCandidatesIdsToSendMailTo = newCandidates;
  }

  const finalOpportunity = await getOpportunity(opportunity.id, true);

  let candidatesToSendMailTo = null;

  if (
    oldOpportunity &&
    finalOpportunity.userOpportunity &&
    finalOpportunity.userOpportunity.length > 0
  ) {
    // Case where the opportunity was not validated and has been validated, we send the mail to everybody
    if (!oldOpportunity.isValidated && finalOpportunity.isValidated) {
      candidatesToSendMailTo = finalOpportunity.isPublic
        ? finalOpportunity.userOpportunity.filter((userOpp) => {
            return userOpp.recommended;
          })
        : finalOpportunity.userOpportunity;
    } else if (newCandidatesIdsToSendMailTo) {
      // Case where the opportunity was already validated, and we just added new candidates to whom we have to send the mail
      candidatesToSendMailTo = (
        finalOpportunity.isPublic
          ? finalOpportunity.userOpportunity.filter((userOpp) => {
              return userOpp.recommended;
            })
          : finalOpportunity.userOpportunity
      ).filter((userOpp) => {
        return newCandidatesIdsToSendMailTo.includes(userOpp.User.id);
      });
    }
  }

  try {
    await updateTable(finalOpportunity, finalOpportunity.userOpportunity);
    console.log('Updated table with modified offer.');
  } catch (err) {
    console.error(err);
    console.log('Failed to update table with modified offer.');
  }

  if (candidatesToSendMailTo && candidatesToSendMailTo.length > 0) {
    await sendJobOfferMessages(candidatesToSendMailTo, finalOpportunity);
  }

  if (!oldOpportunity.isValidated && finalOpportunity.isValidated) {
    const listOfNames = finalOpportunity.userOpportunity.map((candidate) => {
      return candidate.User.firstName;
    });

    let stringOfNames = '';
    if (listOfNames.length === 0) {
      stringOfNames = 'Le candidat';
    } else {
      stringOfNames =
        listOfNames.length > 1
          ? `${listOfNames.slice(0, -1).join(', ')} et ${listOfNames.slice(-1)}`
          : listOfNames[0];
    }

    const mailjetVariables = {
      ..._.omitBy(
        {
          ...finalOpportunity,
          contract: findConstantFromValue(finalOpportunity.contract, CONTRACTS)
            .label,
        },
        _.isNil
      ),
      candidates: stringOfNames,
      isPublicString: finalOpportunity.isPublic.toString(),
      candidatesLength: finalOpportunity.userOpportunity.length,
      businessLines: finalOpportunity.businessLines
        .map(({ name }) => {
          return findConstantFromValue(name, BUSINESS_LINES).label;
        })
        .join(', '),
    };

    await addToWorkQueue({
      type: JOBS.JOB_TYPES.SEND_MAIL,
      toEmail: finalOpportunity.recruiterMail,
      templateId: MAILJET_TEMPLATES.OFFER_VALIDATED,
      variables: mailjetVariables,
    });

    const adminMails = getAdminMailsFromDepartment(finalOpportunity.department);

    await addToWorkQueue({
      type: JOBS.JOB_TYPES.SEND_MAIL,
      toEmail: adminMails.candidates,
      templateId: MAILJET_TEMPLATES.OFFER_VALIDATED_ADMIN,
      variables: mailjetVariables,
    });
  }

  return finalOpportunity;
};

const updateBulkOpportunity = async (attributes, opportunitiesId = []) => {
  const [nbUpdated, updatedOpportunities] = await Opportunity.update(
    attributes,
    {
      where: { id: opportunitiesId },
      returning: true,
      individualHooks: true,
    }
  );

  const completeUpdatedOpportunities = await Opportunity.findAll({
    where: {
      id: updatedOpportunities.map(({ id }) => {
        return id;
      }),
    },
    include: opportunityAttributes.INCLUDE_OPPORTUNITY_COMPLETE,
  });

  try {
    await Promise.all(
      completeUpdatedOpportunities.map((updatedOpportunity) => {
        return updateTable(updatedOpportunity.toJSON());
      })
    );
    console.log('Updated table with bulk modified offers.');
  } catch (err) {
    console.error(err);
    console.log('Failed to update table with bulk modified offer.');
  }

  return {
    nbUpdated,
    updatedIds: updatedOpportunities.map((opp) => {
      return opp.id;
    }),
  };
};

const updateExternalOpportunity = async (opportunity, candidatId, isAdmin) => {
  const oldOpportunity = await getOpportunity(
    opportunity.id,
    isAdmin,
    candidatId
  );

  if (oldOpportunity && oldOpportunity.isExternal) {
    const modelOpportunity = await Opportunity.update(opportunity, {
      where: { id: opportunity.id },
      individualHooks: true,
    }).then((model) => {
      return model && model.length > 1 && model[1][0];
    });

    if (opportunity.businessLines) {
      const businessLines = await Promise.all(
        opportunity.businessLines.map(({ name, order = -1 }) => {
          return BusinessLine.create({ name, order });
        })
      );
      await modelOpportunity.addBusinessLines(businessLines);
      await Opportunity_BusinessLine.destroy({
        where: {
          OpportunityId: opportunity.id,
          BusinessLineId: {
            [Op.not]: businessLines.map((bl) => {
              return bl.id;
            }),
          },
        },
      });
    }

    const finalOpportunity = await Opportunity.findByPk(modelOpportunity.id, {
      attributes: opportunityAttributes.ATTRIBUTES_OPPORTUNITY_CANDIDATES,
      include: opportunityAttributes.INCLUDE_OPPORTUNITY_COMPLETE,
    });

    try {
      await updateTable(finalOpportunity, finalOpportunity.userOpportunity);
      console.log('Updated table with modified offer.');
    } catch (err) {
      console.error(err);
      console.log('Failed to update table with modified offer.');
    }

    const cleanedOpportunity = cleanOpportunity(finalOpportunity);

    return {
      ...cleanedOpportunity,
      userOpportunity: cleanedOpportunity.userOpportunity.find((uo) => {
        return uo.UserId === candidatId;
      }),
    };
  }

  return null;
};

export {
  createOpportunity,
  createExternalOpportunity,
  deleteOpportunity,
  getOpportunity,
  getOpportunities,
  getPublicOpportunities,
  getPrivateUserOpportunities,
  getAllUserOpportunities,
  updateOpportunityUser,
  updateOpportunity,
  updateExternalOpportunity,
  updateBulkOpportunity,
  addUserToOpportunity,
  getLatestOpportunities,
  getUnseenUserOpportunitiesCount,
  countPendingOpportunitiesCount,
  getExternalOpportunitiesCreatedByUserCount,
  refreshAirtableOpportunities,
};
