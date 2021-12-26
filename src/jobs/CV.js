import {
  createSearchString,
  generatePdfFromCV,
  getAndCacheAllCVs,
  getAndCacheCV,
} from 'src/controllers/CV';

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

export { generatePDF, cacheCV, cacheAllCVs, createCVSearchString };
