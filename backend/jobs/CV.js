const {
  generatePdfFromCV,
  getAndCacheCV,
  getAndCacheAllCVs,
  createSearchString,
} = require('../controllers/CV');

const generatePDF = async (candidatId, token, paths) => {
  return generatePdfFromCV(candidatId, token, paths);
};

const cacheCV = async (url, candidatId) => {
  return getAndCacheCV(url, candidatId);
};

const cacheAllCVs = async () => {
  return getAndCacheAllCVs(undefined, true);
};

const createCVSearchString = async (candidatId) => {
  return createSearchString(candidatId);
};

module.exports = {
  generatePDF,
  cacheCV,
  cacheAllCVs,
  createCVSearchString,
};
