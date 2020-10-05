import React  from 'react';
import PropTypes from 'prop-types';
import Api from "../../../Axios";
import ButtonPost from "./ButtonPost";
import {event} from "../../../lib/gtag";

const ButtonDownload = ({ disabled, cvUrl, firstName, lastName, tag }) => {
  return (
    <ButtonPost
      disabled={disabled}
      style="default"
      text="Télécharger le CV"
      icon="download"
      action={() => {
        if(tag) event(tag);
        return Api.get(`${process.env.SERVER_URL}/api/v1/cv/pdf/${cvUrl}`, {
          responseType: 'arraybuffer',
          headers: {
            'Accept': 'application/pdf'
          }
        })
          .then(({data}) => {
            const blob = new Blob([data], {type: 'application/pdf'});
            const pdfLink = document.createElement('a');
            pdfLink.href = window.URL.createObjectURL(blob);
            pdfLink.download = `CV_${firstName}_${lastName}.pdf`;
            pdfLink.click()
          })
          .catch((err) => {
            console.log(err);
          });
      }}/>
  );
};
ButtonDownload.propTypes = {
  disabled: PropTypes.bool,
  cvUrl: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  tag: PropTypes.string
};
ButtonDownload.defaultProps = {
  disabled: false,
  tag: undefined
};
export default ButtonDownload;
