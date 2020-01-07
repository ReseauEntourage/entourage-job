import React from 'react';
import PropTypes from 'prop-types';
import { SimpleLink, GridNoSSR, IconNoSSR } from '../utils';

const doEllipsis = (text, max) =>
  text
    .split(' ')
    .map((mot) => (mot.length > max ? mot.slice(0, max - 1).concat('…') : mot))
    .join(' ');

const CandidatCard = ({ url, imgSrc, imgAlt, firstName, ambitions }) => (
  <SimpleLink href={`/cv/${url}`} className="uk-link-toggle">
    <div className="uk-card uk-card-small uk-card-body uk-card-default uk-card-hover">
      <div className="uk-cover-container uk-height-large uk-margin-bottom">
        <img src={imgSrc} alt={imgAlt} data-uk-cover />

        <div
          style={{
            borderRadius: '0px 2px 2px 0px',
            background: 'linear-gradient(90deg, white 50%, transparent 200%)',
          }}
          // ent-gradiant-default
          className="uk-width-1-2 uk-position-center-left uk-padding-small"
        >
          <GridNoSSR column gap="small">
            <div>
              <h3 className="uk-margin-remove uk-text-uppercase uk-text-bold">
                {firstName}
              </h3>
              <p className="uk-margin-remove">
                A besoin d&apos;un coup de pouce pour travailler dans...
              </p>
            </div>
            <GridNoSSR
              column
              gap="collapse"
              className="uk-text-lowercase uk-text-bold uk-text-primary"
            >
              {ambitions.slice(0, 2).map((a, index) => (
                <span key={index}>{doEllipsis(a.name, 15)}</span>
              ))}
            </GridNoSSR>
            <p>
              Il souhaite <br />
              travailler dans :
              <GridNoSSR className="uk-grid-row-collapse uk-grid-column-small">
                <span className="uk-label uk-label-primary uk-text-lowercase">
                  menuiserie
                </span>
                <span className="uk-label uk-label-primary uk-text-lowercase">
                  peinture
                </span>
              </GridNoSSR>
            </p>
          </GridNoSSR>
        </div>
      </div>
      <GridNoSSR row gap="small" between>
        <u className="uk-text-link uk-text-primary">Voir le CV</u>
        <GridNoSSR row gap="small">
          <span>Partager :</span>
          <IconNoSSR className="uk-text-primary" name="facebook" ratio=".8" />
          <IconNoSSR className="uk-text-primary" name="twitter" ratio=".8" />
          <IconNoSSR className="uk-text-primary" name="linkedin" ratio=".8" />
          <span className="uk-text-primary">|</span>
          <span>X fois</span>
        </GridNoSSR>
      </GridNoSSR>

      {/* <div className="uk-width-1-1 uk-padding-small uk-overlay-default uk-position-bottom">
        </div>
        <div className="uk-width-1-1 uk-padding-small uk-overlay-default uk-position-top" />
        <div className="uk-height-1-1 uk-padding-small uk-overlay-default uk-position-left" />
        <div className="uk-height-1-1 uk-padding-small uk-overlay-default uk-position-right" /> */}
    </div>
  </SimpleLink>
);
CandidatCard.propTypes = {
  url: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  ambitions: PropTypes.arrayOf(PropTypes.shape).isRequired,
  imgSrc: PropTypes.string.isRequired,
  imgAlt: PropTypes.string.isRequired,
};

export default CandidatCard;
