/* global UIkit */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import StepperModal from './StepperModal';
import FormWithValidation from '../forms/FormWithValidation';
import schemaGetEmail from '../forms/schema/formGetEmail.json';
import Axios from '../../Axios';
import { Button } from '../utils';
import { EXTERNAL_LINKS } from "../../constants";
import { ModalContext } from '../store/ModalProvider';

const ModalShareCV = ({ firstName, id }) => {
  const {
    close,
    setClose,
    form,
    next
  } = useContext(ModalContext);

  return (
    <div>
      <StepperModal
        id={id}
        title="Merci pour votre partage."
        components={[
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
              onCancel={() => { setClose(true); console.log('Btn Annuler', close) }}
              onSubmit={({ email }) => {
                Axios.post('/api/v1/cv/share', { email })
                  .then(next)
                  .catch(() =>
                    UIkit.notification('Une erreur est survenue', 'danger')
                  );
              }}
            />
          </>,
          <div className="uk-flex uk-flex-column">
            <p>
              Saviez-vous que LinkedOut est porté par l&apos;association Entourage
              ?
              </p>
            <Button
              isExternal
              newTab
              href={EXTERNAL_LINKS.ENTOURAGE}
              style="link">
              {EXTERNAL_LINKS.ENTOURAGE}
            </Button>
            <div className="uk-margin-top uk-flex uk-flex-right">
              <Button style="default" onClick={() => close()}>
                Fermer
                </Button>
            </div>
          </div>,
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
