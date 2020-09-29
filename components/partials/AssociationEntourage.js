import React from 'react';
import {GridNoSSR, ImgNoSSR, Background, Section, IconNoSSR} from '../utils';
import Button from "../utils/Button";
import {EXTERNAL_LINKS} from "../../constants";
import {event} from "../../lib/gtag";
import TAGS from "../../constants/tags";

const AssociationEntourage = () => (
  <Background blend={{ colorHex: '#484848' }}>
    <Section className="uk-padding-remove-top">
      <GridNoSSR
        center
        column
        gap="large"
        childWidths={['auto']}
        className="uk-text-center"
      >
        <div style={{borderTop: 'solid 1px rgba(255, 255, 255, 0.2)'}}>
          <ImgNoSSR className="uk-margin-large-top" src="/static/img/logo-entourage.svg" alt="logo-entourage" />
          <h1 className="uk-text-bold uk-margin-small">
            <span style={{ color: '#fff' }}>L&apos;association </span>
            <span className="uk-text-primary">Entourage</span>
          </h1>
        </div>
        <GridNoSSR middle childWidths={['1-2@m']} className="uk-light">
          <div style={{ color: '#fff' }}>
            <p className="uk-text-left uk-padding-small">
              Depuis 2015, l&apos;association Entourage engage la société civile à créer des relations durables et de proximité avec les personnes précaires pour leur permettre de participer à la vie de la société.
            </p>
            <div className="uk-flex uk-flex-center">
              <Button
                href={EXTERNAL_LINKS.ENTOURAGE}
                style="default"
                isExternal
                onClick={() => event(TAGS.FOOTER_SITE_ENTOURAGE_CLIC)}
                newTab>
                Voir le site{' '}<IconNoSSR name="chevron-right" />
              </Button>
            </div>
          </div>
          <div className="uk-cover-container uk-height-medium">
            <ImgNoSSR
              className="uk-cover uk-position-center"
              src="/static/img/association_pic.jpg"
            />
          </div>
        </GridNoSSR>
      </GridNoSSR>
    </Section>
  </Background>
);
export default AssociationEntourage;
