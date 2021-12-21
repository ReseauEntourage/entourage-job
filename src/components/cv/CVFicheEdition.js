import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMount, usePrevious } from 'src/hooks/utils';
import { Grid, Img } from 'src/components/utils';
import {
  ExperiencesProfileCard,
  InfoProfileCard,
  PassionsCard,
  SkillsCard,
  StoryProfileCard,
} from 'src/components/cards';
import CVEditCatchphrase from 'src/components/cv/CVEditCatchphrase';
import CVEditReviews from 'src/components/cv/CVEditReviews';
import CVEditPicture from 'src/components/cv/CVEditPicture';
import CVEditBusinessLines from 'src/components/cv/CVEditBusinessLines';
import CVEditCareerPath from 'src/components/cv/CVEditCareerPath';

import { CV_STATUS } from 'src/constants';

const CVFicheEdition = ({
  cv,
  gender,
  onChange,
  disablePicture,
  previewGenerating,
  email,
  phone,
  address,
  userZone,
}) => {
  const [previewUrl, setPreviewUrl] = useState(undefined);
  const [imageUrl, setImageUrl] = useState(undefined);

  const prevPreviewGenerating = usePrevious(previewGenerating);

  const updateImage = useCallback(() => {
    // Use hash to reload image if an update is done
    const previewHash = Date.now();
    const baseUrl = `${process.env.AWSS3_URL}${process.env.AWSS3_IMAGE_DIRECTORY}${cv.UserId}.${cv.status}`;
    setPreviewUrl(`${baseUrl}.preview.jpg?${previewHash}`);
    setImageUrl(`${baseUrl}.jpg?${previewHash}`);
  }, [cv.UserId, cv.status]);

  useMount(() => {
    updateImage();
  });

  useEffect(() => {
    if (!!prevPreviewGenerating && !previewGenerating) {
      updateImage();
    }
  }, [prevPreviewGenerating, previewGenerating, updateImage]);

  return (
    <Grid childWidths={['1-1']}>
      <Grid childWidths={['1-2@s']} match>
        <Grid childWidths={['1-1']} match>
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
        </Grid>
        <Grid childWidths={['1-1']} match>
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
                <div className="uk-inline uk-width-expand">
                  {previewUrl ? (
                    <Img
                      className="uk-height-medium"
                      src={previewUrl}
                      alt="Preview"
                    />
                  ) : (
                    <div className="uk-height-medium uk-width-expand" />
                  )}

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
        </Grid>
      </Grid>
      <Grid childWidths={['1-2@s']} match>
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
          userZone={userZone}
        />
        <Grid childWidths={['1-2@m']} match>
          <SkillsCard list={cv.skills} onChange={onChange} />
          <PassionsCard list={cv.passions} onChange={onChange} />
        </Grid>
      </Grid>
      <Grid childWidths={['1-2@s']}>
        <Grid childWidths={['1-1']}>
          <StoryProfileCard description={cv.story} onChange={onChange} />
          <CVEditReviews reviews={cv.reviews} onChange={onChange} />
        </Grid>
        <Grid childWidths={['1-1']}>
          <ExperiencesProfileCard
            experiences={cv.experiences}
            onChange={onChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

CVFicheEdition.propTypes = {
  cv: PropTypes.shape({
    catchphrase: PropTypes.string,
    story: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.string),
    availability: PropTypes.string,
    urlImg: PropTypes.string,
    careerPathOpen: PropTypes.bool,
    contracts: PropTypes.arrayOf(PropTypes.string),
    ambitions: PropTypes.arrayOf(PropTypes.string),
    languages: PropTypes.arrayOf(PropTypes.string),
    transport: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string),
    passions: PropTypes.arrayOf(PropTypes.string),
    businessLines: PropTypes.arrayOf(PropTypes.string),
    reviews: PropTypes.arrayOf(PropTypes.string),
    experiences: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
    UserId: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func,
  disablePicture: PropTypes.bool,
  gender: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string,
  address: PropTypes.string,
  previewGenerating: PropTypes.bool.isRequired,
  userZone: PropTypes.string,
};

CVFicheEdition.defaultProps = {
  onChange: console.log('Aucune fonction de modification associé'),
  disablePicture: false,
  phone: undefined,
  address: undefined,
  userZone: undefined,
};

export default CVFicheEdition;
