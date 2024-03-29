import { BitlyClient } from 'bitly';

const bitly = new BitlyClient(process.env.BITLY_TOKEN);

const getShortenedOfferURL = async (opportunityId, campaign) => {
  try {
    const offerUrl = `${process.env.FRONT_URL}/backoffice/candidat/offres/${opportunityId}`;
    const { link } = await bitly.shorten(
      `${offerUrl.replace('localhost', '127.0.0.1')}${
        campaign
          ? `?utm_source=SMS&utm_medium=SMS&utm_campaign=${campaign}`
          : ''
      }`
    );
    return link;
  } catch (err) {
    console.error(err);
    return `${process.env.FRONT_URL}/login`;
  }
};

export { getShortenedOfferURL };
