import fetch from 'node-fetch';

import { getUser } from 'src/controllers/User';

import { getCVbyUserId } from 'src/controllers/CV';
import { findConstantFromValue } from 'src/utils/Finding';
import { BUSINESS_LINES } from 'src/constants';
import _ from 'lodash';

const addSpaceToPrefixIfNeeded = (prefix) => {
  if (!prefix) {
    return '';
  }
  return prefix.includes("'") ? prefix : `${prefix} `;
};

const buildBusinessLineForSentence = ({ label, prefix }) => {
  const separator = 'et ';
  if (Array.isArray(prefix)) {
    let mutatedLabel = '';
    const splittedLabel = label.split(separator);
    for (let i = 1; i < splittedLabel.length; i += 1) {
      mutatedLabel +=
        separator + addSpaceToPrefixIfNeeded(prefix[i]) + splittedLabel[i];
    }
    return (
      addSpaceToPrefixIfNeeded(prefix[0]) + splittedLabel[0] + mutatedLabel
    );
  }
  return addSpaceToPrefixIfNeeded(prefix) + label;
};

const generatePreview = async (candidatId, uploadedImg, oldImg) => {
  const cv = await getCVbyUserId(candidatId);
  const user = await getUser(candidatId);

  const isNewCareerPath = cv.businessLines?.every(({ order }) => {
    return order > -1;
  });

  const response = await fetch(`${process.env.AWS_LAMBA_URL}/preview`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      cv: {
        ...cv,
        ambitions: isNewCareerPath
          ? _.uniqWith(cv.businessLines, (a, b) => {
              return a.name === b.name;
            }).map((businessLine) => {
              return {
                ...businessLine,
                name: buildBusinessLineForSentence(
                  findConstantFromValue(businessLine.name, BUSINESS_LINES)
                ),
              };
            })
          : cv.ambitions,
      },
      user,
      uploadedImg,
      oldImg,
    }),
  });

  const { previewUrl } = await response.json();

  return previewUrl;
};

export { generatePreview };
