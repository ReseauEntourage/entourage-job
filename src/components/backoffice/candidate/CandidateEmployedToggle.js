/* global UIkit */

import React from 'react';
import { CONTRACTS } from 'src/constants';
import schemaEditEmployed from 'src/components/forms/schema/formEditEmployed';
import Api from 'src/Axios';
import PropTypes from 'prop-types';
import ToggleWithConfirmationModal from 'src/components/backoffice/ToggleWithConfirmationModal';

const CandidateEmployedToggle = ({
  id,
  candidatId,
  title,
  subtitle,
  modalTitle,
  modalConfirmation,
  notificationMessage,
  defaultValue,
  setData,
}) => {
  return (
    <ToggleWithConfirmationModal
      id={id}
      title={title}
      modalTitle={modalTitle}
      modalConfirmation={modalConfirmation}
      defaultValue={defaultValue}
      formSchema={schemaEditEmployed}
      subtitle={subtitle}
      onToggle={(employed, fields = {}) => {
        const contract = CONTRACTS.find((contractConst) => {
          return contractConst.value === fields.contract;
        });
        const hasEnd = contract && contract.end;

        const mutatedFields = {
          ...fields,
          contract: employed ? fields.contract : null,
          endOfContract:
            fields.endOfContract && hasEnd ? fields.endOfContract : null,
        };

        return Api.put(`/api/v1/user/candidat/${candidatId}`, {
          employed,
          ...mutatedFields,
        })
          .then(() => {
            setData({
              employed,
              ...mutatedFields,
            });
            UIkit.notification(notificationMessage, 'success');
          })
          .catch(() => {
            return UIkit.notification('Une erreur est survenue', 'danger');
          });
      }}
    />
  );
};

CandidateEmployedToggle.propTypes = {
  id: PropTypes.string.isRequired,
  candidatId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  modalTitle: PropTypes.string.isRequired,
  modalConfirmation: PropTypes.string.isRequired,
  notificationMessage: PropTypes.string.isRequired,
  defaultValue: PropTypes.bool.isRequired,
  setData: PropTypes.func.isRequired,
};

CandidateEmployedToggle.defaultProps = {
  subtitle: undefined,
};

export default CandidateEmployedToggle;
