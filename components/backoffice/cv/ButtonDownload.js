import React from 'react';
import PropTypes from 'prop-types';
import Api from '../../../Axios';
import ButtonPost from './ButtonPost';
import { event } from '../../../lib/gtag';

const ButtonDownload = ({ disabled, candidatId, firstName, lastName, tag }) => {
  return (
    <ButtonPost
      disabled={disabled}
      style="default"
      text="Télécharger le CV"
      icon="download"
      action={() => {
        if (tag) event(tag);
        return Api.get(
          `${process.env.SERVER_URL}/api/v1/cv/pdf/${candidatId}`,
          {
            params: {
              fileName: `${firstName}_${lastName}`,
            },
          }
        )
          .then(({ data }) => {
            console.log(data);
            const pdfLink = document.createElement('a');
            pdfLink.href = data.pdfUrl;
            pdfLink.click();
          })
          .catch((err) => {
            console.log(err);
          });
      }}
    />
  );
};
ButtonDownload.propTypes = {
  disabled: PropTypes.bool,
  candidatId: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  tag: PropTypes.string,
};
ButtonDownload.defaultProps = {
  disabled: false,
  tag: undefined,
};
export default ButtonDownload;
