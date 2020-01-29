/* eslint-disable jsx-a11y/aria-role */
import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from '../utils/Grid';
import {
  SkillsCard,
  PassionsCard,
  InfoProfileCard,
  StoryProfileCard,
  ExperiencesProfileCard,
} from '../cards';
import { CVEditCatchphrase, CVEditPicture, CVEditReviews } from '.';
import CVEditDevise from './CVEditDevise';
import CVEditCareerPath from './CVEditCareerPath';

const CVFicheEdition = ({ cv, onChange }) => (
  <GridNoSSR childWidths={['1-1']}>
    <CVEditDevise devise={cv.devise} onChange={onChange} />
    <GridNoSSR childWidths={['1-2@s']} match>
      <GridNoSSR childWidths={['1-1']}>
        <CVEditCatchphrase catchphrase={cv.catchphrase} onChange={onChange} />
        <CVEditCareerPath
          careerPath0={cv.careerPath0}
          careerPath1={cv.careerPath1}
          careerPathOpen={cv.careerPathOpen}
          gender={cv.gender}
          onChange={onChange}
        />
      </GridNoSSR>
      <CVEditPicture onChange={onChange} />
    </GridNoSSR>
    <GridNoSSR childWidths={['1-2@s']} match>
      <InfoProfileCard
        contracts={cv.contracts}
        location={cv.location}
        availability={cv.availability}
        languages={cv.languages}
        transport={cv.transport}
        onChange={onChange}
      />
      <GridNoSSR childWidths={['1-2@m']} match>
        <SkillsCard list={cv.skills} onChange={onChange} />
        <PassionsCard list={cv.passions} onChange={onChange} />
      </GridNoSSR>
    </GridNoSSR>
    <GridNoSSR childWidths={['1-2@s']}>
      <GridNoSSR childWidths={['1-1']}>
        <StoryProfileCard description={cv.story} onChange={onChange} />
        <CVEditReviews reviews={cv.reviews} onChange={onChange} />
      </GridNoSSR>
      <ExperiencesProfileCard
        experiences={cv.experiences}
        onChange={onChange}
      />
    </GridNoSSR>
  </GridNoSSR>
);

CVFicheEdition.propTypes = {
  cv: PropTypes.shape().isRequired,
  onChange: PropTypes.func,
};

CVFicheEdition.defaultProps = {
  onChange: console.log('Aucune fonction de modification associé'),
};

export default CVFicheEdition;
