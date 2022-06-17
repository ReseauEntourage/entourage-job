import { getOpportunity } from 'src/controllers/Opportunity';
import { createOrUpdateSalesforceOffer } from 'src/controllers/Salesforce';
import { models } from 'src/db/models';

const { Opportunity } = models;

const refreshSalesforceData = async () => {
  const opportunities = await Opportunity.findAll({
    attributes: ['id'],
  });

  await Promise.all(
    opportunities.map((opportunity) => {
      return updateOrCreateSalesforceOpportunityBackground(opportunity.id);
    })
  );
};

const getProcessFromOpportunityUser = (opportunityUser, id, title, company) => {
  return opportunityUser.map(
    ({ UserId, User: { email, firstName, lastName }, ...restProps }) => {
      return {
        offerId: id,
        offerTitle: title,
        candidateId: UserId,
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
  const { userOpportunity, ...opportunity } = await getOpportunity(
    opportunityId,
    true
  );

  return {
    offer: opportunity,
    process: getProcessFromOpportunityUser(
      userOpportunity,
      opportunity.id,
      opportunity.title,
      opportunity.company
    ),
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

export { updateOrCreateSalesforceOpportunityBackground, refreshSalesforceData };
