import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CloseButtonNoSSR } from '../utils/CloseButton';
import HeaderModal from './HeaderModal';

/**
 * Ce composant fournit une modal à contenu variable selon l'index ou l'on s'y trouve
 * composers est un tableau de functions attendant 3 fonctions (action: close, next, previous) et retournant un composant
 * cela permet de gérer le flux/ la modale depuis ses composant internes
 */
export default class StepperModal extends Component {
  constructor(props) {
    super(props);
    const { composers } = this.props;
    this.state = {
      index: 0,
      wrappedComponents: composers.map((composer) =>
        composer(
          this.closeModal.bind(this),
          this.nextStep.bind(this),
          this.previousStep.bind(this)
        )
      ),
    };
  }

  static get propTypes() {
    return {
      id: PropTypes.string.isRequired,
      title: PropTypes.element.isRequired,
      composers: PropTypes.arrayOf(PropTypes.func).isRequired,
    };
  }

  closeModal() {
    const { id } = this.props;
    UIkit.modal(`#${id}`).hide();
    // TODO: Probleme car il est possible que la modale se ferme par un moyen autre qu'ici (uk-close-icon~)
    this.setState({ index: 0 });
  }

  nextStep() {
    const { index } = this.state;
    this.setState({ index: index + 1 });
  }

  previousStep() {
    const { index } = this.state;
    this.setState({ index: index - 1 });
  }

  render() {
    const { title, id } = this.props;
    const { index, wrappedComponents } = this.state;

    return (
      <div id={id} className="uk-flex-top" data-uk-modal="bg-close:false">
        <div className="uk-modal-dialog uk-margin-auto-vertical uk-width-1-1 uk-width-2-3@m">
          <CloseButtonNoSSR className="uk-modal-close-default" />
          <div className="uk-modal-body uk-padding-large">
            <HeaderModal>{title}</HeaderModal>
            {wrappedComponents[index]}
          </div>
        </div>
      </div>
    );
  }
}
