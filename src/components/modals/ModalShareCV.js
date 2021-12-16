/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';

import StepperModal from 'src/components/modals/StepperModal';
import FormWithValidation from 'src/components/forms/FormWithValidation';
import schemaGetEmail from 'src/components/forms/schema/formGetEmail.json';
import Api from 'src/Axios';
import { Button, Img } from 'src/components/utils';
import { useResetForm } from 'src/hooks/utils';
import { EXTERNAL_LINKS } from 'src/constants';
import { event } from 'src/lib/gtag';
import TAGS from 'src/constants/tags';
import { IconNoSSR } from 'src/components/utils/Icon';

const ModalShareCV = ({ firstName }) => {
  return (
    <StepperModal
      title="Merci pour votre partage."
      composers={[
        (close, next) => {
          return (
            <>
              <p>
                Pour {firstName}, votre action peut tout changer !<br />
                <br />
                Vous souhaitez être informé(e) de la suite pour {firstName} ? Et
                du projet LinkedOut ?<br />
                Laissez-nous votre adresse mail :
              </p>
              <FormWithValidation
                formSchema={schemaGetEmail}
                submitText="Envoyer"
                onCancel={close}
                onSubmit={({ email }) => {
                  event(TAGS.POPUP_PARTAGE_ENVOYER_MAIL_SUCCES);
                  Api.post('/api/v1/mail/newsletter', { email })
                    .then(next)
                    .catch(() => {
                      return UIkit.notification(
                        'Une erreur est survenue',
                        'danger'
                      );
                    });
                }}
              />
            </>
          );
        },
        (close) => {
          return (
            <div className="uk-flex uk-flex-column">
              <p className="uk-text-center uk-flex-1 uk-margin-medium-top">
                Saviez-vous que LinkedOut est porté par l&apos;association
                Entourage&nbsp;?
              </p>
              <div className="uk-flex uk-flex-center">
                <Img
                  className="uk-height-max-small uk-margin-medium-top"
                  src="/static/img/logo-entourage.png"
                  alt="Logo Entourage"
                />
              </div>
              <div className="uk-flex uk-flex-center uk-margin-medium-top">
                <Button
                  isExternal
                  newTab
                  onClick={() => {
                    event(TAGS.POPUP_PARTAGE_SITE_ENTOURAGE_CLIC);
                    close();
                  }}
                  href={EXTERNAL_LINKS.ENTOURAGE}
                  style="primary"
                >
                  En savoir plus <IconNoSSR name="chevron-right" />
                </Button>
              </div>

              <div className="uk-margin-medium-top uk-flex uk-flex-right">
                <Button
                  style="default"
                  onClick={() => {
                    return close();
                  }}
                >
                  Fermer
                </Button>
              </div>
            </div>
          );
        },
      ]}
    />
  );
};
ModalShareCV.propTypes = {
  firstName: PropTypes.string,
};
ModalShareCV.defaultProps = {
  firstName: undefined,
};
export default ModalShareCV;
