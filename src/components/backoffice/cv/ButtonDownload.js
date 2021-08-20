import React from 'react';
import PropTypes from 'prop-types';
import Api from 'src/Axios';
import ButtonPost from 'src/components/backoffice/cv/ButtonPost';
import { event } from 'src/lib/gtag';

const ButtonDownload = ({
  disabled,
  candidatId,
  firstName,
  lastName,
  tag,
  pdfGenerating,
}) => {
  return (
    <ButtonPost
      disabled={disabled || pdfGenerating}
      style="default"
      text={
        pdfGenerating ? 'Génération du fichier PDF ...' : 'Télécharger le CV'
      }
      icon={pdfGenerating ? null : 'download'}
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
  pdfGenerating: PropTypes.bool,
};
ButtonDownload.defaultProps = {
  disabled: false,
  tag: undefined,
  pdfGenerating: false,
};
export default ButtonDownload;
