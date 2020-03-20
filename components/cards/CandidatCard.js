/* global UIkit */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  LinkedinShareButton,
  TwitterShareButton,
  FacebookShareButton,
} from 'react-share';
import { SimpleLink, GridNoSSR, IconNoSSR, ImgNoSSR } from '../utils';
import ModalShareCV from '../modals/ModalShareCV';

const doEllipsis = (text, max) =>
  text
    .split(' ')
    .map((mot) => (mot.length > max ? mot.slice(0, max - 1).concat('…') : mot))
    .join(' ');

const CandidatCard = ({
  url,
  imgSrc,
  imgAlt,
  gender,
  firstName,
  ambitions,
  skills,
  catchphrase,
  employed,
}) => {
  // petit systeme pour ne pas avoir a afficher la modal a chaque carte
  // optimisation possible
  const [showModal, setShowModal] = useState(false);
  const openNewsletterModal = () => {
    setShowModal(true);
    UIkit.modal(`#info-share-${firstName}`).show();
  };
  return (
    <div className="uk-card uk-card-small uk-card-body uk-card-default uk-card-hover uk-text-small uk-text-left">
      <SimpleLink href={`/cv/${url}`} className="uk-link-toggle">
        <div className="uk-cover-container uk-height-medium uk-margin-bottom">
          <img src={imgSrc} alt={imgAlt} data-uk-cover />
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
          <div
            style={{
              borderRadius: '0px 2px 2px 0px',
              background: 'white', // 'linear-gradient(90deg, white 50%, transparent 200%)',
            }}
            // ent-gradiant-default
            className="uk-width-1-2 uk-position-center-left"
          >
            <GridNoSSR
              column
              gap="small"
              className="uk-margin-small-bottom uk-margin-small-top uk-margin-small-right"
            >
              <div>
                <h5 className="uk-margin-remove uk-text-uppercase uk-text-bold">
                  {firstName}
                </h5>
                {catchphrase ? (
                  <p className="uk-margin-remove">{catchphrase}</p>
                ) : (
                  "cherche un job pour s'en sortir"
                )}
              </div>
              <GridNoSSR
                column
                gap="collapse"
                className="uk-text-lowercase uk-text-bold uk-text-primary"
                items={skills.slice(0, 2).map((a, index) => (
                  <span key={index}>{doEllipsis(a, 15)}</span>
                ))}
              />
              {ambitions && ambitions.length > 0 && (
                <>
                  <p>
                    {gender === 1 ? 'Elle' : 'Il'} souhaite <br />
                    travailler dans :
                  </p>
                  <GridNoSSR
                    className="uk-grid-row-collapse uk-grid-column-small"
                    items={ambitions.slice(0, 3).map((a, index) => (
                      <span
                        key={index}
                        className="uk-label uk-label-primary uk-text-lowercase"
                      >
                        {doEllipsis(a, 15)}
                      </span>
                    ))}
                  />
                </>
              )}
            </GridNoSSR>
          </div>
        </div>
      </SimpleLink>
      <GridNoSSR gap="small" between eachWidths={['expand', 'auto']}>
        <SimpleLink href={`/cv/${url}`} className="uk-link-toggle">
          <u className="uk-text-link uk-text-primary">Voir le CV</u>
        </SimpleLink>
        <GridNoSSR middle center gap="small">
          <span>Partager :</span>
          <ul className="uk-iconnav">
            <li>
              <FacebookShareButton
                onShareWindowClose={openNewsletterModal}
                url={`${process.env.SERVER_URL}/cv/${url}`}
                quote={
                  "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer."
                }
                hashtags={['LinkedOut']}
                style={{ cursor: 'pointer' }}
                className="uk-icon-link uk-text-primary"
              >
                <IconNoSSR name="facebook" ratio={0.9} />
              </FacebookShareButton>
            </li>
            <li>
              <TwitterShareButton
                onShareWindowClose={openNewsletterModal}
                url={`${process.env.SERVER_URL}/cv/${url}`}
                title={
                  "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer."
                }
                hashtags={['LinkedOut']}
                via="R_Entourage"
                style={{ cursor: 'pointer' }}
                className="uk-icon-link uk-text-primary"
              >
                <IconNoSSR name="twitter" ratio={0.9} />
              </TwitterShareButton>
            </li>
            <li>
              <LinkedinShareButton
                onShareWindowClose={openNewsletterModal}
                url={`${process.env.SERVER_URL}/cv/${url}`}
                title={`${firstName.charAt(0).toUpperCase() +
                  firstName.slice(1).toLowerCase()} - Entourage Jobs`}
                description={
                  "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer."
                }
                style={{ cursor: 'pointer' }}
                className="uk-icon-link uk-text-primary"
              >
                <IconNoSSR name="linkedin" ratio={0.9} />
              </LinkedinShareButton>
            </li>
          </ul>
        </GridNoSSR>
      </GridNoSSR>
      {showModal && (
        <ModalShareCV id={`info-share-${firstName}`} firstName={firstName} />
      )}
    </div>
  );
};
CandidatCard.propTypes = {
  url: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  ambitions: PropTypes.arrayOf(PropTypes.shape).isRequired,
  imgSrc: PropTypes.string,
  imgAlt: PropTypes.string.isRequired,
  skills: PropTypes.arrayOf(PropTypes.string).isRequired,
  catchphrase: PropTypes.string,
  employed: PropTypes.bool,
  gender: PropTypes.number.isRequired,
};

CandidatCard.defaultProps = {
  imgSrc: 'static/img/arthur.png',
  employed: false,
  catchphrase: "cherche un job pour s'en sortir",
};
export default CandidatCard;
