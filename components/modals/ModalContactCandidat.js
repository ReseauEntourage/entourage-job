import React, { Component } from "react";
import { CloseButtonNoSSR } from '../utils/CloseButton';
import FormContactCandidat from '../forms/FormContactCandidat';

export default class ModalContactCandidat extends Component {

  static get defaultProps() {
    return {
      candidat: {
        id: "111",
        firstName: "Clément",
      }
    }
  }

  render() {
    return (
      <div id="modalContactCandidat" className="uk-modal-container uk-flex-top" data-uk-modal>
        <div className="uk-modal-dialog uk-margin-auto-vertical">
          <div className="uk-modal-header">
            <h4>Proposer une opportunité à {this.props.candidat.firstName}</h4>
          </div>
          <div className="uk-modal-body">
            <p>
              Cet espace est dédié aux potentiels recruteurs qui souhaitent proposer des opportunités aux candidats.
              Écrivez vos mots d'encouragement ou contactez avec le coach plus bas dans la page CV !
            </p>
            <FormContactCandidat candidat={this.props.candidat} />
            <CloseButtonNoSSR className="uk-modal-close-default" />
          </div>
        </div>
      </div>
    );
  }
}
