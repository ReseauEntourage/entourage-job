const Airtable = require('airtable');

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

module.exports = {
  Airtable,
  airtable,
};
