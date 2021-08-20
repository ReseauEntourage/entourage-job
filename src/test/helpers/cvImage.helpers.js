import path from 'path';

/**
 * Get path to test image
 */
const getTestImagePath = () => {
  const fileName = path.join(process.cwd(), '/src/test/testData/imageTest.jpg');

  return fileName;
};

export { getTestImagePath };
