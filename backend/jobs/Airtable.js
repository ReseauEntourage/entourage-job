const { airtable } = require('../controllers/Airtable');

const manageResponse = (tableName, error, records, res, rej) => {
  if (error) {
    console.error(error);
    return rej(`An error has occured while filling Airtable table '${tableName}'`);
  }
  records.forEach((rec) => {
    console.log('Airtable record id : ', rec.getId());
  });
  return res(records);
};

const insertAirtable = async (tableName, fields) => {
  return new Promise((res, rej) =>
    airtable(tableName).create(
      [
        {
          fields,
        },
      ],
      (error, records) => manageResponse(tableName, error, records, res, rej)
    )
  );
};

const updateAirtable = async (tableName, idToUpdate, fields) => {
  return new Promise((res, rej) => {
    airtable(tableName)
      .select({
        filterByFormula: `{Id}='${idToUpdate}'`,
      })
      .firstPage((err, results) => {
        if (err) {
          return rej(err);
        }

        if (results.length === 0) {
          airtable(tableName).create(
            [
              {
                fields,
              },
            ],
            (error, records) =>
              manageResponse(tableName, error, records, res, rej)
          );
        } else {
          const record = results[0];

          // grab the record id
          // and then push an update to this record
          const recordId = record.id;
          airtable(tableName).update(
            [
              {
                id: recordId,
                fields,
              },
            ],
            (error, records) =>
              manageResponse(tableName, error, records, res, rej)
          );
        }
      });
  });
};

module.exports = {
  insertAirtable,
  updateAirtable,
};
