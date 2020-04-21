/* eslint-disable no-undef */
import React from 'react';
import FormSpecialSkill from '../forms/FormSpecialSkill';
import withValidation from '../forms/withValidation';
import rulesSpecialSkill from '../forms/rulesSpecialSkill';
import SuccessModalContent from './SuccessModalContent';
import StepperModal from './StepperModal';

const ModalSpecialSkill = () => (
  <StepperModal
    id="modalSpecialSkill"
    title={
      <>
        Vous souhaitez{' '}
        <span className="uk-text-primary">apporter vos compétences ?</span>
      </>
    }
    composers={[
      (closeModal, nextStep, previousStep) => {
        const FormSpecialSkillWithValidation = withValidation(
          FormSpecialSkill,
          rulesSpecialSkill,
          closeModal,
          nextStep
        );
        return (
          <>
            <p
              className="uk-text-lead"
              style={{
                lineHeight: '1.2',
                fontSize: '1.2rem',
                fontWeight: '500',
              }}
            >
              Nous avons besoin de tout le monde ! Merci de nous indiquer ce que
              vous souhaitez apporter aux candidats, et de nous laisser vos
              coordonnées
            </p>
            <FormSpecialSkillWithValidation />
          </>
        );
      },
      (closeModal, nextStep, previousStep) => (
        <SuccessModalContent
          text="Merci pour votre message."
          closeModal={closeModal}
        />
      ),
    ]}
  />
);
export default ModalSpecialSkill;
