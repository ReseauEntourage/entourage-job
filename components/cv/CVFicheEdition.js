import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from '../utils/Grid';
import {
  ExperiencesProfileCard,
  InfoProfileCard,
  PassionsCard,
  SkillsCard,
  StoryProfileCard,
} from '../cards';
import CVEditCatchphrase from './CVEditCatchphrase';
import CVEditReviews from './CVEditReviews';
import CVEditPicture from './CVEditPicture';
import CVEditBusinessLines from './CVEditBusinessLines';
import CVEditCareerPath from './CVEditCareerPath';
import { ImgNoSSR } from '../utils';
import { CV_STATUS } from '../../constants';

const CVFicheEdition = ({
  cv,
  gender,
  onChange,
  disablePicture,
  previewGenerating,
  email,
  phone,
  address,
}) => {
  const [previewUrl, setPreviewUrl] = useState(undefined);
  const [imageUrl, setImageUrl] = useState(undefined);

  const updateImage = () => {
    // Use hash to reload image if an update is done
    const previewHash = Date.now();
    const baseUrl = `${process.env.AWSS3_URL}${process.env.AWSS3_IMAGE_DIRECTORY}${cv.UserId}.${cv.status}`;
    setPreviewUrl(`${baseUrl}.preview.jpg?${previewHash}`);
    setImageUrl(`${baseUrl}.jpg?${previewHash}`);
  };

  useEffect(() => {
    if (cv.status !== CV_STATUS.Draft.value) {
      updateImage();
    }
  }, [cv]);

  useEffect(() => {
    if (!previewGenerating && cv) {
      updateImage();
    }
  }, [previewGenerating]);

  return (
    <GridNoSSR childWidths={['1-1']}>
      <GridNoSSR childWidths={['1-2@s']} match>
        <GridNoSSR childWidths={['1-1']} match>
          <CVEditBusinessLines
            businessLines={cv.businessLines}
            onChange={onChange}
          />
          <CVEditCatchphrase catchphrase={cv.catchphrase} onChange={onChange} />
          <CVEditCareerPath
            ambitions={cv.ambitions}
            careerPathOpen={cv.careerPathOpen}
            gender={gender}
            onChange={onChange}
          />
        </GridNoSSR>
        <GridNoSSR childWidths={['1-1']} match>
          <CVEditPicture
            imageUploading={previewGenerating}
            urlImg={imageUrl || '/static/img/arthur-background.jpg'}
            onChange={onChange}
            disablePicture={disablePicture}
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
                  {(cv.status === CV_STATUS.Draft.value ||
                    previewGenerating) && (
                    <>
                      <div
                        className="uk-position-cover"
                        style={{
                          background: 'rgba(0, 0, 0, 0.8)',
                        }}
                      />
                      <div className="uk-overlay uk-position-center uk-light">
                        {previewGenerating ? (
                          <div>
                            Génération de la prévisualisation en cours&nbsp;
                            <div
                              className="uk-margin-small-left"
                              data-uk-spinner="ratio: 0.6"
                            />
                          </div>
                        ) : (
                          <p>Veuillez sauvegarder ou publier le CV</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </GridNoSSR>
      </GridNoSSR>
      <GridNoSSR childWidths={['1-2@s']} match>
        <InfoProfileCard
          contracts={cv.contracts}
          locations={cv.locations}
          availability={cv.availability}
          languages={cv.languages}
          transport={cv.transport}
          email={email}
          phone={phone}
          address={address}
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
        </GridNoSSR>
      </GridNoSSR>
    </GridNoSSR>
  );
};

CVFicheEdition.propTypes = {
  cv: PropTypes.shape({
    catchphrase: PropTypes.string,
    story: PropTypes.string,
    locations: PropTypes.array,
    availability: PropTypes.string,
    urlImg: PropTypes.string,
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
  email: PropTypes.string.isRequired,
  phone: PropTypes.string,
  address: PropTypes.string,
  previewGenerating: PropTypes.bool.isRequired,
};

CVFicheEdition.defaultProps = {
  onChange: console.log('Aucune fonction de modification associé'),
  disablePicture: false,
  phone: undefined,
  address: undefined,
};

export default CVFicheEdition;
