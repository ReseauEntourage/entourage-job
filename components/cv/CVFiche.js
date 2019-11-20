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
  ReviewCard,
  CVPresentationCard,
} from '../cards';

const CVFiche = ({ cv }) => {
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
      <CVPresentationCard
        firstName={cv.firstName}
        userId={cv.userId}
        intro={cv.intro}
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
          />,
          <GridNoSSR
            childWidths={['1-2@m']}
            match
            items={[
              <SkillsCard list={arraySkills} />,
              <PassionsCard list={arrayPassions} />,
            ]}
          />,
        ]}
      />
      <GridNoSSR
        childWidths={['1-2@s']}
        items={[
          <GridNoSSR
            items={[
              <StoryProfileCard description={cv.story} />,
              <ReviewCard
                picture="/static/img/arthur.png"
                review="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum sed diam eu pulvinar."
                author="Hervé"
                role="Assistant social"
              />,
              <ReviewCard
                picture="/static/img/arthur.png"
                review="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum sed diam eu pulvinar."
                author="Hervé"
                role="Assistant social"
              />,
            ]}
          />,
          <ExperiencesProfileCard experiences={cv.Experiences} />,
        ]}
      />
    </Section>
  );
};

CVFiche.propTypes = {
  cv: PropTypes.shape().isRequired,
};

CVFiche.defaultProps = {};

export default CVFiche;
