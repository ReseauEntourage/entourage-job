import React from 'react';
import PropTypes from 'prop-types';
import { Background, IconNoSSR, Section } from '../utils';
import Grid from '../utils/Grid';
import PARTNERS from '../../constants/partners';
import SimpleLink from '../utils/SimpleLink';
import { event } from '../../lib/gtag';
import TAGS from '../../constants/tags';
import Button from '../utils/Button';
import { addPrefix } from '../../utils';

const Partners = ({ showOrientationPartners }) => {
  const logoList = (data) => {
    return (
      <Grid
        childWidths={[`1-${Math.floor(data.length / 2 + 1)}@m`, 'auto']}
        match
        middle
        center
        gap="small"
        items={data.map(({ key, link, bis }) => {
          return (
            <SimpleLink
              className="uk-flex uk-flex-center"
              isExternal
              target="_blank"
              onClick={() => {
                return event(TAGS.FOOTER_PARTENAIRE_CLIC);
              }}
              href={link}
            >
              <div
                className="uk-background-center-center uk-background-contain uk-width-small uk-height-small"
                style={{
                  maxHeight: 100,
                  backgroundImage: `url(${addPrefix(
                    `/static/img/partners/${key}/logo.png)`
                  )}`,
                }}
              />
              {bis && (
                <div
                  className="uk-background-center-center uk-background-contain uk-width-small uk-height-small"
                  style={{
                    maxHeight: 100,
                    backgroundImage: `url(${addPrefix(
                      `/static/img/partners/${key}/logo_bis.png)`
                    )}`,
                  }}
                />
              )}
            </SimpleLink>
          );
        })}
      />
    );
  };

  return (
    <Background
      blend={{ colorHex: showOrientationPartners ? 'white' : '#484848' }}
    >
      <Section container="large">
        <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          {showOrientationPartners ? (
            <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-remove-top">
              Ils nous ont{' '}
              <span className="uk-text-primary">orientés des candidats</span>
            </h2>
          ) : (
            <h2
              style={{ color: '#fff' }}
              className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top"
            >
              <span className="uk-text-primary">Les partenaires</span> du projet
              LinkedOut
            </h2>
          )}
          <div
            className={`uk-padding-large ${
              showOrientationPartners
                ? 'uk-padding-remove-vertical'
                : 'uk-background-muted'
            }`}
          >
            {showOrientationPartners ? (
              logoList(PARTNERS.orientation)
            ) : (
              <>
                <h4 className="uk-text-primary uk-text-bold">
                  Ce projet est développé en partenariat avec
                </h4>
                {logoList(PARTNERS.strategy)}
              </>
            )}
            <h4 className="uk-text-primary uk-text-bold uk-margin-large-top">
              Avec le soutien précieux de
            </h4>
            {logoList(PARTNERS.finance)}
            <div className="uk-flex uk-flex-center uk-flex-middle uk-margin-large-top">
              <Button style="primary" href="/partenaires">
                En savoir plus &nbsp;
                <IconNoSSR name="arrow-right" />
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </Background>
  );
};

Partners.propTypes = { showOrientationPartners: PropTypes.bool };

Partners.defaultProps = { showOrientationPartners: false };

export default Partners;
