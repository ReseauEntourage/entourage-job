/* global UIkit */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Api from 'src/Axios';
import _ from 'lodash';
import { usePrevious } from 'src/hooks/utils';
import { event } from 'src/lib/gtag';
import TAGS from 'src/constants/tags';
import { openModal } from 'src/components/modals/Modal';
import defaultSchema from 'src/components/forms/schema/formEditOpportunity';
import ModalEdit from 'src/components/modals/ModalEdit';

export function usePostOpportunity({
  modalTitle,
  modalDesc,
  isAdmin,
  callback,
  defaultValues = {},
  schema = defaultSchema,
}) {
  const [lastFilledForm, setLastFilledForm] = useState({});

  const prevLastFilledForm = usePrevious(lastFilledForm);

  const postOpportunity = useCallback(
    async (fields, closeModal, adminCallback) => {
      const { openNewForm, ...opportunity } = fields;
      const candidatesId = opportunity.candidatesId
        ? opportunity.candidatesId.map((id) => {
            return typeof id === 'object' ? id.value : id;
          })
        : [];

      if (opportunity.isPublic) {
        event(TAGS.POPUP_OFFRE_ENVOYER_OFFRE_GENERALE_CLIC);
      } else if (candidatesId.length > 1) {
        event(TAGS.POPUP_OFFRE_ENVOYER_OFFRE_MULTIPLE_CLIC);
      } else {
        event(TAGS.POPUP_OFFRE_ENVOYER_OFFRE_UNIQUE_CLIC);
      }

      try {
        await Api.post(`/api/v1/opportunity/`, {
          ...opportunity,
          startOfContract: opportunity.startOfContract || null,
          endOfContract: opportunity.endOfContract || null,
          candidatesId: opportunity.isPublic ? null : candidatesId,
          message: opportunity.isPublic ? null : opportunity.message,
          date: Date.now(),
        });
        closeModal();
        UIkit.notification(
          opportunity.isPublic
            ? 'Merci pour votre offre, nous reviendrons bientôt vers vous.'
            : `Merci pour votre offre, le(s) candidat(s) et coach(s) associés reviendront bientôt vers vous.`,
          'success'
        );
        if (adminCallback) adminCallback();
        if (openNewForm) {
          setLastFilledForm(fields);
        } else {
          setLastFilledForm({});
        }
      } catch (err) {
        UIkit.notification(`Une erreur est survenue.`, 'danger');
      }
    },
    []
  );

  const modal = useMemo(() => {
    const mutatedDefaultValue = { ...defaultValues };
    if (!mutatedDefaultValue.isPublic) {
      mutatedDefaultValue.candidatesId = _.isEmpty(lastFilledForm)
        ? [
            {
              label: `${mutatedDefaultValue.firstName} ${mutatedDefaultValue.lastName}`,
              value: mutatedDefaultValue.candidatId,
            },
          ]
        : lastFilledForm.candidatesId;
    }
    return (
      <ModalEdit
        title={modalTitle}
        description={modalDesc}
        submitText="Envoyer"
        defaultValues={{
          ...mutatedDefaultValue,
          ...lastFilledForm,
        }}
        formSchema={schema}
        onSubmit={async (fields, closeModal) => {
          await postOpportunity(
            isAdmin
              ? {
                  ...fields,
                  isAdmin: true,
                }
              : fields,
            closeModal,
            callback
          );
        }}
      />
    );
  }, [
    defaultValues,
    modalTitle,
    modalDesc,
    lastFilledForm,
    schema,
    postOpportunity,
    isAdmin,
    callback,
  ]);

  useEffect(() => {
    if (!_.isEmpty(lastFilledForm) && lastFilledForm !== prevLastFilledForm) {
      setTimeout(() => {
        openModal(modal);
      }, 1000);
    }
  }, [lastFilledForm, modal, prevLastFilledForm]);

  return {
    modal,
  };
}
