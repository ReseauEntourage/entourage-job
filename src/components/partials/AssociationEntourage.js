import React from 'react';
import { Background, Grid, Img, Section } from 'src/components/utils';
import Button from 'src/components/utils/Button';
import { EXTERNAL_LINKS } from 'src/constants';
import { event } from 'src/lib/gtag';
import TAGS from 'src/constants/tags';
import { IconNoSSR } from 'src/components/utils/Icon';

const AssociationEntourage = () => {
  return (
    <Background blend={{ colorHex: '#484848' }}>
      <Section className="uk-padding-remove-top">
        <div
          style={{ borderTop: 'solid 1px rgba(255, 255, 255, 0.2)' }}
          className="uk-text-center"
        >
          <Grid
            middle
            center
            childWidths={['1-2@m']}
            className="uk-margin-large-top"
          >
            <div>
              <Img src="/static/img/logo-entourage.svg" alt="logo-entourage" />
              <h2 className="uk-text-bold uk-margin-small">
                <span style={{ color: '#fff' }}>L&apos;association </span>
                <span className="uk-text-primary">Entourage</span>
              </h2>
              <div className="uk-light">
                <p className="uk-text-center uk-padding-small uk-text-secondary">
                  Depuis 2016, l&apos;association Entourage engage la société
                  civile à créer des relations durables et de proximité avec les
                  personnes précaires pour leur permettre de participer à la vie
                  de la société.
                </p>
                <div className="uk-flex uk-flex-center">
                  <Button
                    href={EXTERNAL_LINKS.ENTOURAGE}
                    style="default"
                    isExternal
                    onClick={() => {
                      return event(TAGS.FOOTER_SITE_ENTOURAGE_CLIC);
                    }}
                    newTab
                  >
                    Voir le site <IconNoSSR name="chevron-right" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="uk-cover-container uk-height-medium">
              <Img
                className="uk-cover uk-position-center"
                src="/static/img/association_pic.jpg"
                alt="association entourage"
              />
            </div>
          </Grid>
        </div>
      </Section>
    </Background>
  );
};
export default AssociationEntourage;
