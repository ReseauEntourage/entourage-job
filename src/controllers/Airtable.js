import Airtable from 'airtable';

const airtable = !process.env.NODE_ENV.includes('test')
  ? new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
      process.env.AIRTABLE_BASE_ID
    )
  : null;

export { Airtable, airtable };
