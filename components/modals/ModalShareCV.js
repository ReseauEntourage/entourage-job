/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';

import StepperModal from './StepperModal';
import FormWithValidation from '../forms/FormWithValidation';
import schemaGetEmail from '../forms/schema/formGetEmail.json';
import Axios from '../../Axios';
import {Button, IconNoSSR, ImgNoSSR} from '../utils';
import {useResetForm} from "../../hooks";
import {EXTERNAL_LINKS} from "../../constants";
import {event} from "../../lib/gtag";
import TAGS from "../../constants/tags";

const ModalShareCV = ({ firstName, id }) => {
  const [form, resetForm] = useResetForm();

  return (
    <div>
      <StepperModal
        id={id}
        title="Merci pour votre partage."
        resetForm={() => {
          resetForm();
          event(TAGS.POPUP_PARTAGE_ANNULER_MAIL_CLIC);
        }}
        composers={[
          (close, next) => (
            <>
              <p>
                Pour {firstName}, votre action peut tout changer !<br />
                <br />
                Vous souhaitez être informé(e) de la suite pour {firstName} ? Et du
                projet LinkedOut ?<br />
                Laissez-nous votre adresse mail :
              </p>
              <FormWithValidation
                ref={form}
                formSchema={schemaGetEmail}
                submitText="Envoyer"
                onCancel={close}
                onSubmit={({ email }) => {
                  event(TAGS.POPUP_PARTAGE_ENVOYER_MAIL_SUCCES);
                  Axios.post('/api/v1/cv/share', { email })
                    .then(next)
                    .catch(() =>
                      UIkit.notification('Une erreur est survenue', 'danger')
                    );
                }}
              />
            </>
          ),
          (close) => (
            <div className="uk-flex uk-flex-column">
              <p className="uk-text-center uk-flex-1 uk-margin-medium-top">
                Saviez-vous que LinkedOut est porté par l&apos;association Entourage&nbsp;?
              </p>
              <div className="uk-flex uk-flex-center">
                <ImgNoSSR
                  className="uk-width-small"
                  src="../../static/img/logo-entourage.png" />
              </div>
              <div className="uk-flex uk-flex-center uk-margin-small-top">
                <Button
                  isExternal
                  newTab
                  onClick={() => {
                    event(TAGS.POPUP_PARTAGE_SITE_ENTOURAGE_CLIC);
                    close();
                  }}
                  href={EXTERNAL_LINKS.ENTOURAGE}
                  style="primary">
                  En savoir plus{' '}<IconNoSSR name="chevron-right"/>
                </Button>
              </div>

              <div className="uk-margin-medium-top uk-flex uk-flex-right">
                <Button style="default" onClick={() => close()}>
                  Fermer
                </Button>
              </div>
            </div>
          ),
        ]}
      />
    </div>
  );
}
ModalShareCV.propTypes = {
  firstName: PropTypes.string,
  id: PropTypes.string.isRequired,
};
ModalShareCV.defaultProps = {
  firstName: undefined,
};
export default ModalShareCV;
