import React from 'react';
import Img from '../utils/Img';
import { EXTERNAL_LINKS } from '../../constants';
import { Button, IconNoSSR, Section } from '../utils';

const VendeeGlobePartial = () => {
  const content = () => {
    return (
      <div className="uk-flex uk-flex-column uk-flex-middle uk-flex-center">
        <div className="uk-light uk-flex uk-flex-column uk-flex-middle">
          <h2 className="uk-text-bold uk-text-center uk-margin-bottom uk-margin-remove-top">
            LinkedOut, c’est aussi un bateau qui porte notre message autour du
            monde&nbsp;!
          </h2>
          <p
            className="uk-text-center uk-margin-remove-top"
            style={{ color: 'white' }}
          >
            Tous ensemble, faisons du Vendée Globe un événement sportif utile et
            solidaire avec les personnes en grande précarité&nbsp;!
          </p>
        </div>
        <Button href={EXTERNAL_LINKS.LKO_VG} style="default" isExternal newTab>
          Suivez la course&nbsp;
          <IconNoSSR name="chevron-right" />
        </Button>
      </div>
    );
  };

  return (
    <Section container="small" style="muted" className="uk-padding-remove-top">
      <div>
        <div className="uk-inline uk-visible@m">
          <Img
            width={1500}
            height={1000}
            src="/static/img/foil.jpg"
            alt="Bateau LinkedOut"
          />
          <div
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            className="uk-position-cover"
          />
          <div className="uk-overlay uk-position-center uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding-large">
            {content()}
          </div>
        </div>
        <div
          className="uk-hidden@m uk-flex uk-flex-column uk-flex-middle uk-padding-small uk-background-center-center uk-background-cover uk-background-blend-overlay"
          style={{
            backgroundImage: 'url(/static/img/foil.jpg)',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          {content()}
        </div>
      </div>
    </Section>
  );
};

export default VendeeGlobePartial;
