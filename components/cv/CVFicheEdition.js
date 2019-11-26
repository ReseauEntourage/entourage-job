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

const CVFicheEdition = ({ cv, onChange }) => {
  const arrayContracts =
    cv.Contracts &&
    cv.Contracts.map((contract) => {
      return contract.name;
    });
  const arrayLanguages =
    cv.Languages &&
    cv.Languages.map((language) => {
      return (
        language.name.charAt(0).toUpperCase() +
        language.name.slice(1).toLowerCase()
      );
    });
  const arraySkills =
    cv.Skills &&
    cv.Skills.map((skill) => {
      return (
        skill.name.charAt(0).toUpperCase() + skill.name.slice(1).toLowerCase()
      );
    });
  const arrayPassions =
    cv.Passions &&
    cv.Passions.map((passion) => {
      return (
        passion.name.charAt(0).toUpperCase() +
        passion.name.slice(1).toLowerCase()
      );
    });

  return (
    <Section>
      <GridNoSSR
        childWidths={['1-2@s']}
        match
        items={[
          <CVEditIntro intro={cv.intro} onChange={onChange} />,
          <CVEditPicture img="" onChange={onChange} />,
        ]}
      />
      <GridNoSSR
        childWidths={['1-2@s']}
        match
        items={[
          <InfoProfileCard
            contract={arrayContracts}
            location={cv.location}
            availability={cv.availability}
            language={arrayLanguages}
            transport={cv.transport}
            onChange={onChange}
          />,
          <GridNoSSR
            childWidths={['1-2@m']}
            match
            items={[
              <SkillsCard list={arraySkills} onChange={onChange} />,
              <PassionsCard list={arrayPassions} onChange={onChange} />,
            ]}
          />,
        ]}
      />
      <GridNoSSR
        childWidths={['1-2@s']}
        items={[
          <GridNoSSR
            childWidths={['1-1']}
            items={[
              <StoryProfileCard description={cv.story} onChange={onChange} />,
              <CVEditReviews reviews={[]} onChange={onChange} />,
            ]}
          />,
          <ExperiencesProfileCard
            experiences={cv.Experiences}
            onChange={onChange}
          />,
        ]}
      />
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
