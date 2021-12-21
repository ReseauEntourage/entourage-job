import React from 'react';
import PropTypes from 'prop-types';
import { Background, Section } from 'src/components/utils';
import PARTNERS from 'src/constants/partners';
import Button from 'src/components/utils/Button';
import LogoList from 'src/components/partials/LogoList';
import { IconNoSSR } from 'src/components/utils/Icon';

const Partners = ({ showOrientationPartners }) => {
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
              <LogoList logos={PARTNERS.orientation} />
            ) : (
              <>
                <h4 className="uk-text-primary uk-text-bold">
                  Partenaires majeurs
                </h4>
                <LogoList logos={PARTNERS.strategy} />
              </>
            )}
            <h4 className="uk-text-primary uk-text-bold uk-margin-large-top">
              Partenaires financiers et opérationnels
            </h4>
            <LogoList logos={PARTNERS.finance} />
            <div className="uk-flex uk-flex-center uk-flex-middle uk-margin-large-top">
              <Button style="primary" href="/partenaires">
                En savoir plus&nbsp;
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
