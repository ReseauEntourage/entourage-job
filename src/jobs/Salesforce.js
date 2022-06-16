import { getOpportunity } from 'src/controllers/Opportunity';
import { createOrUpdateSalesforceOffer } from 'src/controllers/Salesforce';

const getProcessFromOpportunityUser = (opportunityUser, company) => {
  return opportunityUser.map(
    ({ UserId, User: { email, firstName, lastName }, ...restProps }) => {
      return {
        candidateEmail: email,
        firstName,
        lastName,
        company,
        ...restProps,
      };
    }
  );
};

const getOfferFromOpportunityId = async (opportunityId) => {
  const { userOpportunity: candidates, ...opportunity } = await getOpportunity(
    opportunityId,
    true
  );

  return {
    offer: opportunity,
    process: getProcessFromOpportunityUser(candidates, opportunity.company),
  };
};

const updateOrCreateSalesforceOpportunityBackground = async (
  opportunityId,
  isSameOpportunity
) => {
  if (Array.isArray(opportunityId)) {
    const offersToCreate = await Promise.all(
      opportunityId.map(async (singleOpportunityId) => {
        return getOfferFromOpportunityId(singleOpportunityId);
      })
    );
    return createOrUpdateSalesforceOffer(offersToCreate, isSameOpportunity);
  } else {
    const offerToCreate = await getOfferFromOpportunityId(opportunityId);
    return createOrUpdateSalesforceOffer(offerToCreate);
  }
};

export { updateOrCreateSalesforceOpportunityBackground };
