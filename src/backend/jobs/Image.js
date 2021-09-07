import Api from 'src/Axios';
import { getUser } from 'src/backend/controllers/User';

import { getCVbyUserId } from 'src/backend/controllers/CV';

const generatePreview = async (candidatId, uploadedImg, oldImg) => {
  const cv = await getCVbyUserId(candidatId);
  const user = await getUser(candidatId);
  const {
    data: { previewUrl },
  } = await Api.post(`${process.env.AWS_LAMBA_URL}/preview`, {
    cv,
    user,
    uploadedImg,
    oldImg,
  });
  return previewUrl;
};

export { generatePreview };
