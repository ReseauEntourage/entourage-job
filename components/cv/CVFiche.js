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
} from '../cards';
import { CVPresentationCard } from '.';

const CVFiche = ({ cv }) => (
  <Section>
    <CVPresentationCard
      firstName={cv.user.firstName}
      userId={cv.UserId}
      intro={cv.catchphrase}
    />
    <GridNoSSR
      childWidths={['1-2@s']}
      match
      items={[
        <InfoProfileCard
          contracts={cv.contracts}
          location={cv.location}
          availability={cv.availability}
          languages={cv.languages}
          transport={cv.transport}
        />,
        <GridNoSSR
          childWidths={['1-2@m']}
          match
          items={[
            <SkillsCard list={cv.skills} />,
            <PassionsCard list={cv.passions} />,
          ]}
        />,
      ]}
    />
    <GridNoSSR childWidths={['1-2@s']}>
      <GridNoSSR
        column
        childWidths={['1-1']}
        items={[
          <StoryProfileCard description={cv.story} />,
          ...cv.reviews.map((review) => (
            <ReviewCard
              picture="/static/img/arthur.png"
              review={review.text}
              author={review.name}
              role={review.status}
            />
          )),
        ]}
      />
      <ExperiencesProfileCard experiences={cv.experiences} />
    </GridNoSSR>
  </Section>
);

CVFiche.propTypes = {
  cv: PropTypes.shape().isRequired,
};

CVFiche.defaultProps = {};

export default CVFiche;
