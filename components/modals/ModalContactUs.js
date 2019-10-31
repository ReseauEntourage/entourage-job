/* eslint-disable no-undef */
import React, { Component } from 'react';
import { CloseButtonNoSSR } from '../utils/CloseButton';
import { IconNoSSR } from '../utils/Icon';
import FormContactUs from '../forms/FormContactUs';
import ModalGeneric from './ModalGeneric';
import withValidation from '../forms/withValidation';
import rulesContactUs from '../forms/rulesContactUs';

export default class ModalSpecialSkill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formSent: false,
    };
    this.confirmMessageSent = this.confirmMessageSent.bind(this);
  }

  confirmMessageSent() {
    this.setState({ formSent: true });
  }

  render() {
    const { formSent } = this.state;

    return (
      <ModalGeneric id="modalContactUs">
        {(closeModal) => {
          const FormContactUsWithValidation = withValidation(
            FormContactUs,
            rulesContactUs,
            closeModal,
            this.confirmMessageSent
          );

          return (
            <>
              <div className="uk-flex">
                <div className="uk-margin-medium-right">
                  <span className="uk-text-primary">
                    <IconNoSSR name="linkedout-contract" ratio={1.5} />
                  </span>
                </div>
                <div className="">
                  <h3 className="uk-text-bold">
                    Vous souhaitez{' '}
                    <span className="uk-text-primary">
                      apporter vos compétences ?
                    </span>
                  </h3>
                </div>
              </div>

              {formSent ? (
                <div className="uk-flex uk-flex-center uk-margin-large">
                  <div className="uk-card uk-card-body uk-text-center">
                    <IconNoSSR
                      name="check"
                      ratio={4}
                      className="uk-text-primary"
                    />
                    <p className="uk-text-lead">
                      Merci pour votre message, {candidat.firstName} et son
                      coach reviennent vers vous bientôt.
                    </p>
                    <button
                      type="button"
                      className="uk-button uk-button-primary"
                      onClick={closeModal}
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p
                    className="uk-text-lead"
                    style={{
                      lineHeight: '1.2',
                      fontSize: '1.2rem',
                      fontWeight: '500',
                    }}
                  >
                    Nous avons besoin de tout le monde ! Merci de nous indiquer
                    ce que vous souhaitez apporter aux candidats, et de nous
                    laisser vos coordonnées
                  </p>
                  <FormContactUsWithValidation />
                  <CloseButtonNoSSR className="uk-modal-close-default" />
                </>
              )}
            </>
          );
        }}
      </ModalGeneric>
    );
  }
}
