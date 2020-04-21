/* eslint-disable no-undef */
import React, { Component } from 'react';
import { CloseButtonNoSSR } from '../utils/CloseButton';
import ModalGeneric from './ModalGeneric';
import FormInterestLinkedOut from '../forms/FormInterestLinkedOut';
import withValidation from '../forms/withValidation';
import rulesInterestLinkedOut from '../forms/rulesInterestLinkedOut';
import SuccessModalContent from './SuccessModalContent';
import HeaderModal from './HeaderModal';

export default class ModalInterestLinkedOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.confirmMessageSent = this.confirmMessageSent.bind(this);
  }

  confirmMessageSent() {
    this.setState({ index: 1 });
  }

  render() {
    const { index } = this.state;

    return (
      <ModalGeneric id="modalInterestLinkedOut">
        {(closeModal) => {
          const FormInterestLinkedOutWithValidation = withValidation(
            FormInterestLinkedOut,
            rulesInterestLinkedOut,
            closeModal,
            this.confirmMessageSent
          );

          const content = [
            <FormInterestLinkedOutWithValidation />,
            <SuccessModalContent
              closeModal={closeModal}
              text="Merci pour votre message."
            />,
          ];

          return (
            <>
              <HeaderModal>Vous êtes intéressés par LinkedOut ?</HeaderModal>
              {content[index]}
              <CloseButtonNoSSR className="uk-modal-close-default" />
            </>
          );
        }}
      </ModalGeneric>
    );
  }
}
