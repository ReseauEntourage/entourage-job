/* eslint-disable no-undef */
import React, { Component } from 'react';
import { CloseButtonNoSSR } from '../utils/CloseButton';
import FormSpecialSkill from '../forms/FormSpecialSkill';
import ModalGeneric from './ModalGeneric';
import withValidation from '../forms/withValidation';
import rulesSpecialSkill from '../forms/rulesSpecialSkill';
import SuccessModalContent from './SuccessModalContent';
import HeaderModal from './HeaderModal';

export default class ModalSpecialSkill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  confirmMessageSent() {
    this.setState({ index: 1 });
  }

  render() {
    const { index } = this.state;

    return (
      <ModalGeneric id="modalSpecialSkill">
        {(closeModal) => {
          const FormSpecialSkillWithValidation = withValidation(
            FormSpecialSkill,
            rulesSpecialSkill,
            closeModal,
            this.confirmMessageSent
          );

          const content = [
            <>
              <p
                className="uk-text-lead"
                style={{
                  lineHeight: '1.2',
                  fontSize: '1.2rem',
                  fontWeight: '500',
                }}
              >
                Nous avons besoin de tout le monde ! Merci de nous indiquer ce
                que vous souhaitez apporter aux candidats, et de nous laisser
                vos coordonnées
              </p>
              <FormSpecialSkillWithValidation />
            </>,
            <SuccessModalContent
              closeModal={closeModal}
              text="Merci pour votre message."
            />,
          ];

          return (
            <>
              <HeaderModal>
                <>
                  Vous souhaitez{' '}
                  <span className="uk-text-primary">
                    apporter vos compétences ?
                  </span>
                </>
              </HeaderModal>
              {content[index]}
              <CloseButtonNoSSR className="uk-modal-close-default" />
            </>
          );
        }}
      </ModalGeneric>
    );
  }
}
