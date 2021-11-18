/* global UIkit */

import { useCallback, useEffect, useState } from 'react';
import Api from 'src/Axios';
import _ from 'lodash';
import { usePrevious } from 'src/hooks/utils';
import { event } from 'src/lib/gtag';
import TAGS from 'src/constants/tags';

export function usePostOpportunity(modalId) {
  const [lastFilledForm, setLastFilledForm] = useState({});

  const prevLastFilledForm = usePrevious(lastFilledForm);

  const postOpportunity = useCallback(
    async (fields, closeModal, adminCallback) => {
      const { openNewForm, ...opportunity } = fields;
      const candidatesId = opportunity.candidatesId
        ? opportunity.candidatesId.map((candidateId) => {
            return typeof candidateId === 'object'
              ? candidateId.value
              : candidateId;
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

  useEffect(() => {
    if (!_.isEmpty(lastFilledForm) && lastFilledForm !== prevLastFilledForm) {
      setTimeout(() => {
        UIkit.modal(`#${modalId}`).show();
        const modals = document.querySelectorAll(`#${modalId}`);
        modals[0].scrollTo(0, 0);
      }, 1000);
    }
  }, [lastFilledForm, modalId, prevLastFilledForm]);

  return {
    lastFilledForm,
    setLastFilledForm,
    prevLastFilledForm,
    postOpportunity,
  };
}