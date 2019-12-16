/* eslint-disable jsx-a11y/aria-role */
import React from 'react';
import PropTypes from 'prop-types';
import { Section } from '../utils';
import { GridNoSSR } from '../utils/Grid';
import {
  SkillsCard,
  PassionsCard,
  InfoProfileCard,
  StoryProfileCard,
  ExperiencesProfileCard,
} from '../cards';
import { CVEditIntro, CVEditPicture, CVEditReviews } from '.';

const toUpperFirstLetter = (text) => {
  if (typeof text !== 'string' || text === '') {
    return text;
  }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const CVFicheEdition = ({ cv, onChange }) => {
  const arrayContracts =
    cv.Contracts &&
    cv.Contracts.map((contract) => {
      if (contract.name) {
        return contract.name;
      }
      return contract;
    });
  const arrayLanguages =
    cv.Languages &&
    cv.Languages.map((language) => {
      if (language.name) {
        return toUpperFirstLetter(language.name);
      }
      return toUpperFirstLetter(language);
    });
  const arraySkills =
    cv.Skills &&
    cv.Skills.map((skill) => {
      if (skill.name) {
        return toUpperFirstLetter(skill.name);
      }
      return toUpperFirstLetter(skill);
    });
  const arrayPassions =
    cv.Passions &&
    cv.Passions.map((passion) => {
      if (passion.name) {
        return toUpperFirstLetter(passion.name);
      }
      return toUpperFirstLetter(passion);
    });

  return (
    <Section>
      <GridNoSSR childWidths={['1-2@s']} match>
        <CVEditIntro intro={cv.intro} onChange={onChange} />
        <CVEditPicture img="" onChange={onChange} />
      </GridNoSSR>
      <GridNoSSR childWidths={['1-2@s']} match>
        <InfoProfileCard
          contracts={arrayContracts}
          location={cv.location}
          availability={cv.availability}
          languages={arrayLanguages}
          transport={cv.transport}
          onChange={onChange}
        />
        <GridNoSSR childWidths={['1-2@m']} match>
          <SkillsCard list={arraySkills} onChange={onChange} />
          <PassionsCard list={arrayPassions} onChange={onChange} />
        </GridNoSSR>
      </GridNoSSR>
      <GridNoSSR childWidths={['1-2@s']}>
        <GridNoSSR childWidths={['1-1']}>
          <StoryProfileCard description={cv.story} onChange={onChange} />
          <CVEditReviews reviews={cv.Reviews} onChange={onChange} />
        </GridNoSSR>
        <ExperiencesProfileCard
          experiences={cv.Experiences}
          onChange={onChange}
        />
      </GridNoSSR>
    </Section>
  );
};

CVFicheEdition.propTypes = {
  cv: PropTypes.shape().isRequired,
  onChange: PropTypes.func,
};

CVFicheEdition.defaultProps = {
  onChange: console.log('Aucune fonction de modification associé'),
};

export default CVFicheEdition;
