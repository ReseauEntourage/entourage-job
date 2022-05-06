import _ from 'lodash';
import {
  findConstantFromValue,
  findOfferStatus,
  getZoneFromDepartment,
} from './Finding';
import { BUSINESS_LINES, CONTRACTS } from '../constants';

const getMailjetVariablesForPrivateOrPublicOffer = (
  opportunity,
  getCandidates = true
) => {
  const commonMailjetVariables = _.omitBy(
    {
      ...opportunity,
      zone: getZoneFromDepartment(opportunity.department),
      contract: findConstantFromValue(opportunity.contract, CONTRACTS).label,
      status: findOfferStatus(opportunity.status).label,
      businessLines: opportunity.businessLines
        ?.map(({ name }) => {
          return findConstantFromValue(name, BUSINESS_LINES).label;
        })
        .join(', '),
    },
    _.isNil
  );

  if (!opportunity.isPublic && getCandidates) {
    const listOfNames = opportunity.userOpportunity.map((candidate) => {
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

    return {
      ...commonMailjetVariables,
      candidates: stringOfNames,
      candidatesLength: opportunity.userOpportunity.length,
    };
  }
  return commonMailjetVariables;
};

export { getMailjetVariablesForPrivateOrPublicOffer };
