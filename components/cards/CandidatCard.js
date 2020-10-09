/* global UIkit */
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import '../../static/css/Toggle.less';
import {
  LinkedinShareButton,
  TwitterShareButton,
  FacebookShareButton,
} from 'react-share';
import { useRouter } from 'next/router';

import { SimpleLink, GridNoSSR, IconNoSSR, ImgNoSSR } from '../utils';
import ModalShareCV from '../modals/ModalShareCV';
import Api from '../../Axios';
import { SharesCountContext } from '../store/SharesCountProvider';
import { hasAsChild } from '../../utils';
import { LOCATIONS } from '../../constants';
import { event } from '../../lib/gtag';
import TAGS from '../../constants/tags';

const CandidatCard = ({
  url,
  imgSrc,
  imgAlt,
  firstName,
  ambitions,
  locations,
  skills,
  catchphrase,
  employed,
  id,
}) => {
  const router = useRouter();

  const isCandidatsPage = router.asPath.includes('/candidats');
  const showShareOptions = !router.asPath.includes('/entreprises');

  const link = `${process.env.SERVER_URL}/cv/${url}`;
  const hashtags = ['LinkedOut'];
  const sharedDescription = `La précarité n'exclut pas les compétences\xa0! Avec LinkedOut, aidons ${firstName} à retrouver un emploi en lui proposant un job ou en diffusant son CV\xa0!`;
  const title = `LinkedOut\xa0: Aidez ${firstName} à retrouver un emploi`;

  // petit systeme pour ne pas avoir a afficher la modal a chaque carte
  // optimisation possible
  const [showModal, setShowModal] = useState(false);

  const { incrementSharesCount } = useContext(SharesCountContext);

  const openNewsletterModal = () => {
    setShowModal(true);
    UIkit.modal(`#info-share-${id}`).show();
  };

  const updateShareCount = (candidatId, type) => {
    Api.post('api/v1/cv/count', {
      candidatId,
      type,
    })
      .then(() => {
        incrementSharesCount();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getReducedLocations = () => {
    if (locations && locations.length > 0) {
      let indexesToRemove = [];
      const reducedLocations = locations;
      for (let i = 0; i < locations.length; i += 1) {
        for (let j = 0; j < locations.length; j += 1) {
          if (hasAsChild(LOCATIONS, locations[i], locations[j])) {
            indexesToRemove.push(j);
          }
        }
      }

      indexesToRemove = indexesToRemove.filter(
        (index, idx) => indexesToRemove.indexOf(index) === idx
      );
      indexesToRemove.sort((a, b) => b - a);

      for (let i = indexesToRemove.length - 1; i >= 0; i -= 1) {
        reducedLocations.splice(indexesToRemove[i], 1);
      }
      return reducedLocations;
    }
    return [];
  };

  const reducedLocations = getReducedLocations();

  return (
    <div className="uk-card uk-card-small uk-card-body uk-card-default uk-card-hover uk-text-small uk-text-left">
      {/* Contenue de la carte */}
      <SimpleLink as={`/cv/${url}`} href="/cv/[url]" className="uk-link-toggle">
        <div
          className="uk-cover-container uk-margin-bottom"
          style={{
            height: 350,
          }}
        >
          {/* Image de fond */}
          <img src={imgSrc} alt={imgAlt} data-uk-cover />
          {/* Bandeau à retrouvé un emploie */}
          {employed && (
            <div
              style={{
                backgroundColor: 'rgba(245, 95, 36, .7)',
              }}
              className="uk-width-1-1 uk-position-bottom uk-flex uk-flex-middle uk-flex-right" // uk-position-cover
            >
              <div className="uk-width-1-2 uk-padding-small uk-text-center">
                <ImgNoSSR
                  src="/static/img/logo-white.png"
                  alt="logo entourage"
                />
                <p
                  className="uk-text-uppercase"
                  style={{ color: '#FFF', margin: '8px 0 0 0' }}
                >
                  a retrouvé un emploi
                </p>
              </div>
            </div>
          )}
          {/* Informations du candidat */}
          <div
            style={{
              borderRadius: '0px 2px 2px 0px',
              background: 'white', // 'linear-gradient(90deg, white 50%, transparent 200%)',
              padding: '10px 10px 10px 0px',
            }}
            // ent-gradiant-default
            className="uk-width-1-2 uk-position-center-left"
          >
            {/*  uk-margin-small-bottom uk-margin-small-top uk-margin-small-right */}
            <GridNoSSR
              gap="collapse"
              between
              column
              childWidths={['1-1']}
              style={{
                minHeight: 240,
              }}
              className="uk-height-1-1"
            >
              <div
                style={{
                  marginBottom: 0,
                }}
              >
                <h5 className="uk-margin-remove uk-text-uppercase uk-text-bold ent-line-clamp-1">
                  {firstName}
                </h5>
                <p
                  style={{
                    fontSize: '0.775rem',
                    marginTop: '5px !important',
                  }}
                  className="uk-text-small ent-line-clamp-3 uk-margin-remove"
                >
                  {catchphrase || "Cherche un job pour s'en sortir"}
                </p>
              </div>
              {skills && skills.length > 0 && (
                <GridNoSSR
                  column
                  style={{
                    marginTop: 5,
                    marginBottom: 5,
                  }}
                  gap="collapse"
                  childWidths={['1-1']}
                  className="uk-text-lowercase uk-text-bold uk-text-primary "
                  items={skills.slice(0, 2).map((a, index) => (
                    <span key={index} className="ent-line-clamp-1">
                      {a}
                    </span>
                  ))}
                />
              )}
              {ambitions && ambitions.length > 0 && (
                <div
                  style={{
                    marginTop: 5,
                    marginBottom: 5,
                  }}
                >
                  <p
                    style={{ fontSize: '0.775rem' }}
                    className="uk-margin-remove uk-margin-small-top"
                  >
                    Je souhaite
                    <br />
                    travailler dans&nbsp;:
                  </p>
                  <GridNoSSR column gap="collapse" childWidths={['1-1']}>
                    {ambitions.slice(0, 2).map((text, index) => (
                      <span
                        key={index}
                        className="uk-label uk-text-lowercase ent-card-ambition"
                      >
                        {text}
                      </span>
                    ))}
                  </GridNoSSR>
                </div>
              )}
              {/* {businessLines && businessLines.length > 0 && (
                <div style={{
                  marginTop: 5,
                  marginBottom: 5
                }}>
                  <p
                    style={{ fontSize: '0.775rem' }}
                    className="uk-margin-remove uk-margin-small-top"
                  >
                    Secteurs d&apos;activité&nbsp;:
                  </p>
                  <GridNoSSR column gap="collapse" childWidths={['1-1']}>
                    {businessLines.slice(0, 2).map((text, index) => (
                      <span
                        key={index}
                        className="uk-label uk-text-lowercase ent-card-ambition"
                      >
                        {text}
                      </span>
                    ))}
                  </GridNoSSR>
                </div>
              )} */}
              {reducedLocations && reducedLocations.length > 0 && (
                <GridNoSSR
                  column
                  gap="collapse"
                  childWidths={['1-1']}
                  style={{ marginTop: 10 }}
                >
                  {reducedLocations.slice(0, 2).map((text, index) => (
                    <div key={text + index} className="uk-flex uk-flex-middle">
                      <IconNoSSR name="location" ratio={0.6} />
                      &nbsp;
                      <span
                        className="uk-text-meta uk-flex-1"
                        style={{
                          fontSize: '0.775rem',
                        }}
                      >
                        {text}
                      </span>
                    </div>
                  ))}
                </GridNoSSR>
              )}
            </GridNoSSR>
          </div>
        </div>
      </SimpleLink>
      {/* Bas de carte */}
      {showShareOptions ? (
        <GridNoSSR gap="small" between middle eachWidths={['expand', 'auto']}>
          <SimpleLink
            as={`/cv/${url}`}
            href="/cv/[url]"
            className="uk-link-toggle"
          >
            <u className="uk-text-link uk-text-primary">Voir le CV</u>
          </SimpleLink>
          <GridNoSSR middle center gap="small">
            <span>Partager :</span>
            <ul className="uk-iconnav">
              <li>
                <LinkedinShareButton
                  onShareWindowClose={() => {
                    event(
                      isCandidatsPage
                        ? TAGS.PAGE_GALERIE_PARTAGE_CV_LINKEDIN_CLIC
                        : TAGS.HOME_PARTAGE_CV_LINKEDIN_CLIC
                    );
                    updateShareCount(id, 'linkedin');
                    openNewsletterModal();
                  }}
                  url={link}
                  title={title}
                  summary={sharedDescription}
                  style={{ cursor: 'pointer' }}
                  className="uk-icon-button light-icon-button"
                >
                  <IconNoSSR
                    name="linkedin"
                    ratio={0.9}
                    className={`share-linkedin-${firstName}`}
                  />
                </LinkedinShareButton>
              </li>
              <li>
                <FacebookShareButton
                  onShareWindowClose={() => {
                    event(
                      isCandidatsPage
                        ? TAGS.PAGE_GALERIE_PARTAGE_CV_FACEBOOK_CLIC
                        : TAGS.HOME_PARTAGE_CV_FACEBOOK_CLIC
                    );
                    updateShareCount(id, 'facebook');
                    openNewsletterModal();
                  }}
                  url={link}
                  quote={sharedDescription}
                  hashtags={hashtags}
                  style={{ cursor: 'pointer' }}
                  className="uk-icon-button light-icon-button"
                >
                  <IconNoSSR
                    name="facebook"
                    ratio={0.9}
                    className={`share-facebook-${firstName}`}
                  />
                </FacebookShareButton>
              </li>
              <li>
                <TwitterShareButton
                  onShareWindowClose={() => {
                    event(
                      isCandidatsPage
                        ? TAGS.PAGE_GALERIE_PARTAGE_CV_TWITTER_CLIC
                        : TAGS.HOME_PARTAGE_CV_TWITTER_CLIC
                    );
                    updateShareCount(id, 'twitter');
                    openNewsletterModal();
                  }}
                  url={link}
                  title={title}
                  hashtags={hashtags}
                  via="R_Entourage"
                  style={{ cursor: 'pointer' }}
                  className="uk-icon-button light-icon-button"
                >
                  <IconNoSSR
                    name="twitter"
                    ratio={0.9}
                    className={`share-twitter-${firstName}`}
                  />
                </TwitterShareButton>
              </li>
            </ul>
          </GridNoSSR>
        </GridNoSSR>
      ) : (
        <div className="uk-text-center">
          <SimpleLink
            as={`/cv/${url}`}
            href="/cv/[url]"
            className="uk-link-toggle uk-text-center"
          >
            <u className="uk-text-link uk-text-primary te">Voir le CV</u>
          </SimpleLink>
        </div>
      )}
      {showModal && (
        <ModalShareCV id={`info-share-${id}`} firstName={firstName} />
      )}
    </div>
  );
};
CandidatCard.propTypes = {
  url: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  ambitions: PropTypes.arrayOf(PropTypes.string).isRequired,
  locations: PropTypes.arrayOf(PropTypes.string).isRequired,
  imgSrc: PropTypes.string,
  imgAlt: PropTypes.string.isRequired,
  skills: PropTypes.arrayOf(PropTypes.string).isRequired,
  catchphrase: PropTypes.string,
  employed: PropTypes.bool,
  id: PropTypes.string.isRequired,
};

CandidatCard.defaultProps = {
  imgSrc: 'static/img/arthur.png',
  employed: false,
  catchphrase: "cherche un job pour s'en sortir",
};
export default CandidatCard;
