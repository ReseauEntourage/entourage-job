import fetch from 'node-fetch';

import { getUser } from 'src/controllers/User';

import { getCVbyUserId } from 'src/controllers/CV';

const generatePreview = async (candidatId, uploadedImg, oldImg) => {
  const cv = await getCVbyUserId(candidatId);
  const user = await getUser(candidatId);

  const response = await fetch(`${process.env.AWS_LAMBA_URL}/preview`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      cv,
      user,
      uploadedImg,
      oldImg,
    }),
  });

  const { previewUrl } = await response.json();

  return previewUrl;
};

export { generatePreview };
