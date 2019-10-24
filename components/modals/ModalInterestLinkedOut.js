/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CloseButtonNoSSR } from '../utils/CloseButton';
import { IconNoSSR } from '../utils/Icon';
import FormContactCandidat from '../forms/FormContactCandidat';
import ModalGeneric from './ModalGeneric';

export default class ModalInterestLinkedOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formSent: false,
    };
    this.confirmMessageSent = this.confirmMessageSent.bind(this);
  }

  static get propTypes() {
    return {
      candidat: PropTypes.shape({
        id: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
      }).isRequired,
    };
  }

  confirmMessageSent() {
    this.setState({ formSent: true });
  }

  render() {
    const { candidat } = this.props;
    const { formSent } = this.state;

    return (
      <ModalGeneric id="modalInterestLinkedOut">
        {(closeModal) => (
          <>
            <div className="uk-width-3-5 uk-flex">
              <div className="uk-width-1-6 uk-text-center">
                <span className="uk-text-primary">
                  <IconNoSSR name="linkedout-contract" />
                </span>
              </div>
              <div className="uk-width-5-6">
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
                    Merci pour votre message, {candidat.firstName} et son coach
                    reviennent vers vous bientôt.
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
                <p>
                  Cet espace est dédié aux potentiels recruteurs qui souhaitent
                  proposer des opportunités aux candidats. Écrivez vos mots
                  d&apos;encouragement ou contactez avec le coach plus bas dans
                  la page CV !
                </p>
                <FormContactCandidat
                  candidat={candidat}
                  closeModal={closeModal}
                  confirmMessageSent={this.confirmMessageSent}
                />
                <CloseButtonNoSSR className="uk-modal-close-default" />
              </>
            )}
          </>
        )}
      </ModalGeneric>
    );
  }
}
