import {
  insertAirtable,
  updateOpportunityAirtable,
} from 'src/controllers/Airtable';

const insertAirtableBackground = async (tableName, fields) => {
  return insertAirtable(tableName, fields);
};

const updateOpportunityAirtableBackground = async (tableName, fields) => {
  return updateOpportunityAirtable(tableName, fields);
};

export { insertAirtableBackground, updateOpportunityAirtableBackground };
