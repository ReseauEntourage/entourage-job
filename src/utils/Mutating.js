import { BitlyClient } from 'bitly';

const bitly = new BitlyClient(process.env.BITLY_TOKEN);

const getShortenedOfferURL = async (opportunityId) => {
  const offerUrl = `${process.env.FRONT_URL}/backoffice/candidat/offres/${opportunityId}`;
  const { link } = await bitly.shorten(
    offerUrl.replace('localhost', '127.0.0.1')
  );
  return link;
};

export { getShortenedOfferURL };
