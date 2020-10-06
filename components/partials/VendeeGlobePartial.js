/* global UIkit */

import React from 'react';
import Img from "../utils/Img";
import {EXTERNAL_LINKS} from "../../constants";
import {Button, IconNoSSR, Section} from "../utils";

const VendeeGlobePartial = () => {

  const content = () => {
    return (
      <div>
        <div className="uk-light uk-flex uk-flex-column uk-flex-middle">
          <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
            Rejoignez la <span style={{color: '#00B9EF'}}>Course Au Changement</span> avec le bateau LinkedOut&nbsp;!
          </h2>
          <h4 className="uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
            Tous ensemble, faisons du prochain Vendée Globe un événement sportif utile et solidaire avec les personnes en grande précarité&nbsp;!
          </h4>
        </div>
        <Button
          href={EXTERNAL_LINKS.LKO_VG}
          style="secondary"
          isExternal
          newTab
        >
          Visiter le site du voilier LinkedOut&nbsp;<IconNoSSR name="chevron-right" />
        </Button>
      </div>
    )
  };

  return (
    <Section container="small" style="muted" className="uk-padding-remove-top">
      <div className="uk-inline uk-visible@m" uk-scrollspy="cls: uk-animation-scale-up; delay: 200;">
        <Img src='../../static/img/foil.jpg' alt='Bateau LinkedOut' />
        <div style={{backgroundColor: 'rgba(0,0,0,0.6)'}} className="uk-position-cover" />
        <div className="uk-overlay uk-position-center uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding-large">
          {content()}
        </div>
      </div>
      <div
        uk-scrollspy="cls: uk-animation-scale-up; delay: 200;"
        className="uk-hidden@m uk-flex uk-flex-column uk-flex-middle uk-padding-small uk-background-center-center uk-background-cover uk-background-blend-overlay"
        style={{backgroundImage: 'url(../../static/img/foil.jpg)', backgroundColor: 'rgba(0,0,0,0.6)'}}>
        {content()}
      </div>
    </Section>
  )
};


export default VendeeGlobePartial;
