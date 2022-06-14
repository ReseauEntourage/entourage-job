import { getOpportunity } from 'src/controllers/Opportunity';
import { createOrUpdateSalesforceOpportunity } from 'src/controllers/Salesforce';

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
    opportunity,
    opportunityUser: getProcessFromOpportunityUser(
      candidates,
      opportunity.company
    ),
  };
};

const updateOrCreateSalesforceOpportunityBackground = async (
  opportunityId,
  isSameOpportunity
) => {
  if (Array.isArray(opportunityId)) {
    const opportunitiesToCreate = await Promise.all(
      opportunityId.map(async (singleOpportunityId) => {
        return getOfferFromOpportunityId(singleOpportunityId);
      })
    );

    return createOrUpdateSalesforceOpportunity(
      opportunitiesToCreate,
      isSameOpportunity
    );
  } else {
    const opportunityToCreate = await getOfferFromOpportunityId(opportunityId);
    return createOrUpdateSalesforceOpportunity(opportunityToCreate);
  }
};

export { updateOrCreateSalesforceOpportunityBackground };
