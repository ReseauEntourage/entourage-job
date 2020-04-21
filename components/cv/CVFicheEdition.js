/* eslint-disable jsx-a11y/aria-role */
import React, { useEffect, useState } from 'react';
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
import CVEditBusinessLines from './CVEditBusinessLines';
import CVEditDevise from './CVEditDevise';
import CVEditCareerPath from './CVEditCareerPath';
import { ImgNoSSR } from '../utils';

const CVFicheEdition = ({ cv, gender, onChange, disablePicture }) => {
  const [previewUrl, setPreviewUrl] = useState(undefined);
  useEffect(() => {
    if (cv.status !== 'Draft') {
      // Use hash to reload image if an update is done
      const previewHash = Date.now();
      setPreviewUrl(
        `${process.env.AWSS3_URL}${process.env.AWSS3_DIRECTORY}${cv.UserId}.${cv.status}.preview.jpg?${previewHash}`
      );
    }
  }, [cv]);

  return (
    <GridNoSSR childWidths={['1-1']}>
      <GridNoSSR childWidths={['1-2@s']} match>
        <CVEditDevise devise={cv.devise} onChange={onChange} />
        <CVEditBusinessLines
          businessLines={cv.businessLines}
          onChange={onChange}
        />
      </GridNoSSR>
      <GridNoSSR childWidths={['1-2@s']} match>
        <GridNoSSR childWidths={['1-1']}>
          <CVEditCatchphrase catchphrase={cv.catchphrase} onChange={onChange} />
          <CVEditCareerPath
            ambitions={cv.ambitions}
            careerPathOpen={cv.careerPathOpen}
            gender={gender}
            onChange={onChange}
          />
        </GridNoSSR>
        <CVEditPicture
          urlImg={process.env.AWSS3_URL + cv.urlImg || undefined}
          onChange={onChange}
          disablePicture={disablePicture}
        />
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
        <GridNoSSR childWidths={['1-1']}>
          <ExperiencesProfileCard
            experiences={cv.experiences}
            onChange={onChange}
          />
          {cv.urlImg && (
            <div className="uk-card uk-card-default">
              <div className="uk-card-body">
                <h3 className="uk-card-title">
                  Photo de <span className="uk-text-primary">partage</span>
                </h3>
              </div>
              <div className="uk-card-media-bottom">
                <div className="uk-inline">
                  <ImgNoSSR
                    className="uk-height-medium"
                    src={previewUrl}
                    alt="Preview"
                  />
                  {cv.status === 'Draft' && (
                    <>
                      <div
                        className="uk-position-cover"
                        style={{
                          background: 'rgba(0, 0, 0, 0.8)',
                        }}
                      />
                      <div className="uk-overlay uk-position-center uk-light">
                        <p>Veuillez sauvegarder ou publier le CV</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </GridNoSSR>
      </GridNoSSR>
    </GridNoSSR>
  );
};

CVFicheEdition.propTypes = {
  cv: PropTypes.shape({
    devise: PropTypes.string,
    catchphrase: PropTypes.string,
    story: PropTypes.string,
    location: PropTypes.string,
    availability: PropTypes.string,
    urlImg: PropTypes.string,
    gender: PropTypes.number,
    careerPathOpen: PropTypes.bool,
    contracts: PropTypes.array,
    ambitions: PropTypes.array,
    languages: PropTypes.array,
    transport: PropTypes.array,
    skills: PropTypes.array,
    passions: PropTypes.array,
    businessLines: PropTypes.array,
    reviews: PropTypes.array,
    experiences: PropTypes.array,
    status: PropTypes.string,
    UserId: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func,
  disablePicture: PropTypes.bool,
  gender: PropTypes.number.isRequired,
};

CVFicheEdition.defaultProps = {
  onChange: console.log('Aucune fonction de modification associé'),
  disablePicture: false,
};

export default CVFicheEdition;
