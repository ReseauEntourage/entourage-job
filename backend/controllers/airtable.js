const Airtable = require('airtable');

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  'appKrheVKNVp9Oc5n'
);

module.exports = {
  Airtable,
  airtable,
};
