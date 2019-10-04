/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CloseButtonNoSSR } from '../utils/CloseButton';
import { IconNoSSR } from '../utils/Icon';
import FormContactCandidat from '../forms/FormContactCandidat';

export default class ModalContactCandidat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageSent: false,
    };

    this.closeModal = this.closeModal.bind(this);
  }

  static get propTypes() {
    return {
      candidat: PropTypes.shape({
        id: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
      }).isRequired,
    };
  }

  closeModal() {
    const { messageSent } = this.state;
    UIkit.modal('#modalContactCandidat').hide();
    if (messageSent) {
      this.setState({ messageSent: false });
    }
  }

  confirmMessageSent() {
    this.setState({ messageSent: true });
  }

  render() {
    const { candidat } = this.props;
    const { messageSent } = this.state;

    return (
      <div
        id="modalContactCandidat"
        className="uk-modal-container uk-flex-top"
        data-uk-modal="bg-close:false"
      >
        <div className="uk-modal-dialog uk-margin-auto-vertical">
          <div className="uk-modal-header">
            <h4>Proposer une opportunité à {candidat.firstName}</h4>
          </div>
          <div className="uk-modal-body">
            {messageSent ? (
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
                    onClick={this.closeModal}
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
                  closeModal={this.closeModal}
                  messageSent={this.messageSent}
                />
                <CloseButtonNoSSR className="uk-modal-close-default" />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}
