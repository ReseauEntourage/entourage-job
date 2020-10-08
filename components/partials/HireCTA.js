import React from 'react';
import { Button, IconNoSSR, Section } from '../utils';
import Grid from '../utils/Grid';

const HireCTA = () => {
  return (
    <Section container="small">
      <h2 className="uk-text-center uk-text-bold uk-text-primary">
        Vous souhaitez recruter&nbsp;?
      </h2>
      <div className="uk-margin-top uk-text-center uk-text-bold">
        Recherchez le candidat qui correspond à vos besoins et proposez-lui
        votre offre
      </div>
      <Grid
        className="uk-margin-medium-top"
        childWidths={['1-2@m', 'auto']}
        center
        match
      >
        <Button href="/entreprises/cvs" style="primary" size="large">
          <span style={{ whiteSpace: 'nowrap' }}>
            Recruter en Île-de-France et dans les Hauts-de-France
          </span>
          <IconNoSSR name="chevron-right" />
        </Button>
        <Button
          href="/entreprises/recruter-hors-linkedout"
          style="primary"
          size="large"
        >
          Recruter ailleurs <IconNoSSR name="chevron-right" />
        </Button>
      </Grid>
    </Section>
  );
};

export default HireCTA;
