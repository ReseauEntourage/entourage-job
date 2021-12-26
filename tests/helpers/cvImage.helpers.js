import path from 'path';

/**
 * Get path to test image
 */
const getTestImagePath = () => {
  const fileName = path.join(process.cwd(), '/tests/testData/imageTest.jpg');

  return fileName;
};

export { getTestImagePath };
