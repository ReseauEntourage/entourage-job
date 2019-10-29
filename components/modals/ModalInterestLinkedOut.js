/* eslint-disable no-undef */
import React, { Component } from 'react';
import { CloseButtonNoSSR } from '../utils/CloseButton';
import { IconNoSSR } from '../utils/Icon';
import ModalGeneric from './ModalGeneric';
import FormInterestLinkedOut from '../forms/FormInterestLinkedOut';
import withValidation from '../forms/withValidation';
import rulesInterestLinkedOut from '../forms/rulesInterestLinkedOut';

export default class ModalInterestLinkedOut extends Component {
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
      <ModalGeneric id="modalInterestLinkedOut">
        {(closeModal) => {
          const FormInterestLinkedOutWithValidation = withValidation(
            FormInterestLinkedOut,
            rulesInterestLinkedOut,
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
                    Vous êtes intéressés par LinkedOut ?
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
                  <FormInterestLinkedOutWithValidation />
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
