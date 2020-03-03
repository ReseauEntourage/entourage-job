import React from 'react';
import PropTypes from 'prop-types';
import { SimpleLink, GridNoSSR, IconNoSSR, ImgNoSSR } from '../utils';

const doEllipsis = (text, max) =>
  text
    .split(' ')
    .map((mot) => (mot.length > max ? mot.slice(0, max - 1).concat('…') : mot))
    .join(' ');

const CandidatCard = ({
  url,
  imgSrc,
  imgAlt,
  firstName,
  ambitions,
  skills,
  catchphrase,
  employed,
}) => (
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
              <ImgNoSSR src="/static/img/logo-white.png" alt="logo entourage" />
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
              <p className="uk-margin-remove">{catchphrase}</p>
            </div>
            <GridNoSSR
              column
              gap="collapse"
              className="uk-text-lowercase uk-text-bold uk-text-primary"
            >
              {/* ICI !!! */}
              {skills.slice(0, 2).map((a, index) => (
                <span key={index}>{doEllipsis(a, 15)}</span>
              ))}
            </GridNoSSR>
            <p>
              Il souhaite <br />
              travailler dans :
              <GridNoSSR className="uk-grid-row-collapse uk-grid-column-small">
                {ambitions.slice(0, 3).map((a, index) => (
                  <span
                    key={index}
                    className="uk-label uk-label-primary uk-text-lowercase"
                  >
                    {doEllipsis(a, 15)}
                  </span>
                ))}
              </GridNoSSR>
            </p>
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
            <IconNoSSR className="uk-text-primary" name="facebook" ratio=".9" />
          </li>
          <li>
            <IconNoSSR className="uk-text-primary" name="twitter" ratio=".9" />
          </li>
          <li>
            <IconNoSSR className="uk-text-primary" name="linkedin" ratio=".9" />
          </li>
        </ul>
      </GridNoSSR>
    </GridNoSSR>
  </div>
);
CandidatCard.propTypes = {
  url: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  ambitions: PropTypes.arrayOf(PropTypes.shape).isRequired,
  imgSrc: PropTypes.string,
  imgAlt: PropTypes.string.isRequired,
  catchphrase: PropTypes.string.isRequired,
  skills: PropTypes.arrayOf(PropTypes.string).isRequired,
  employed: PropTypes.bool.isRequired,
};

CandidatCard.defaultProps = {
  imgSrc: 'static/img/arthur.png',
};
export default CandidatCard;
