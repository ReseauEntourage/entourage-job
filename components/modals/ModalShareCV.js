/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';

import StepperModal from './StepperModal';
import FormWithValidation from '../forms/FormWithValidation';
import schemaGetEmail from '../forms/schema/fromGetEmail.json';
import Axios from '../../Axios';
import { Button } from '../utils';

const ModalShareCV = ({ firstName, id }) => (
  <StepperModal
    id={id}
    title="Merci pour votre partage."
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
            formSchema={schemaGetEmail}
            submitText="Envoyer"
            onCancel={close}
            onSubmit={({ email }) => {
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
          <p>
            Saviez-vous que LinkedOut est porté par l&apos;association Entourage
            ?
          </p>
          <Button isExternal href="https://www.entourage.social/" style="link">
            https://www.entourage.social/
          </Button>
          <div className="uk-margin-top uk-flex uk-flex-right">
            <Button style="default" onClick={() => close()}>
              Fermer
            </Button>
          </div>
        </div>
      ),
    ]}
  />
);
ModalShareCV.propTypes = {
  firstName: PropTypes.string,
  id: PropTypes.string.isRequired,
};
ModalShareCV.defaultProps = {
  firstName: undefined,
};
export default ModalShareCV;
