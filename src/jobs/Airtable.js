import { airtable } from 'src/controllers/Airtable';

const manageResponse = (tableName, error, records, res, rej) => {
  if (error) {
    console.error(error);
    return rej(
      `An error has occured while filling Airtable table '${tableName}'`
    );
  }
  records.forEach((rec) => {
    if (Array.isArray(rec)) {
      rec.forEach((r) => {
        console.log('Airtable record id : ', r.getId());
      });
    } else {
      console.log('Airtable record id : ', rec.getId());
    }
  });
  return res(records);
};

const insertAirtable = async (tableName, fields) => {
  const valuesToInsert = Array.isArray(fields)
    ? fields.map((fieldSet) => {
        return {
          fields: fieldSet,
        };
      })
    : [{ fields }];

  return Promise.all(
    valuesToInsert.map((values) => {
      return new Promise((res, rej) => {
        return airtable(tableName).create(
          [values],
          { typecast: true },
          (error, records) => {
            return manageResponse(tableName, error, records, res, rej);
          }
        );
      });
    })
  );
};

const updateOpportunityAirtable = async (tableName, fields) => {
  const valuesToInsert = Array.isArray(fields)
    ? fields.map((fieldSet) => {
        return {
          fields: fieldSet,
        };
      })
    : [{ fields }];

  let isSingleValue = false;

  if (valuesToInsert.length === 1) {
    isSingleValue = true;
  }

  return Promise.all(
    valuesToInsert.map((values) => {
      const opportunityUserId = values.fields.OpportunityUserId
        ? values.fields.OpportunityUserId
        : '';
      const formula = isSingleValue
        ? `{OpportunityId}='${values.fields.OpportunityId}'`
        : `AND({OpportunityUserId}='${opportunityUserId}', {OpportunityId}='${values.fields.OpportunityId}')`;

      return new Promise((res, rej) => {
        return airtable(tableName)
          .select({
            filterByFormula: formula,
          })
          .firstPage((err, results) => {
            if (err) {
              return rej(err);
            }

            if (results.length === 0) {
              airtable(tableName).create(
                [values],
                { typecast: true },
                (error, records) => {
                  return manageResponse(tableName, error, records, res, rej);
                }
              );
            } else {
              Promise.all(
                results.map((record) => {
                  return new Promise((resolve, reject) => {
                    airtable(tableName).update(
                      [
                        {
                          id: record.id,
                          ...values,
                        },
                      ],
                      { typecast: true },
                      (error, records) => {
                        return manageResponse(
                          tableName,
                          error,
                          records,
                          resolve,
                          reject
                        );
                      }
                    );
                  });
                })
              )
                .then((records) => {
                  return manageResponse(tableName, null, records, res, rej);
                })
                .catch((error) => {
                  return manageResponse(tableName, error, null, res, rej);
                });
            }
          });
      });
    })
  );
};

export { insertAirtable, updateOpportunityAirtable };
