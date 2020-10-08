import React from 'react';
import { Button, IconNoSSR, Section } from '../utils';
import Grid from '../utils/Grid';

import "./HireCTA.less"

const HireCTA = () => {
  return (
    <Section container="small">
      <h2 className="uk-text-center uk-text-bold uk-text-primary">
        Vous souhaitez recruter&nbsp;?
      </h2>
      <p className="uk-margin-medium-top uk-text-center uk-text-bold">
        Recherchez le candidat qui correspond à vos besoins et proposez-lui
        votre offre
      </p>
      <Grid
        className="uk-margin-medium-top"
        childWidths={['1-2@m', 'auto']}
        center
        match
      >
        <Button href="/entreprises/cvs" style="primary" className="hireButton-xlarge">
            Recruter en Île-de-France et dans les Hauts-de-France
          <IconNoSSR name="chevron-right" />
        </Button>
        <Button
          href="/entreprises/recruter-hors-linkedout"
          style="primary"
          className="hireButton-xlarge"
        >
          Recruter ailleurs <IconNoSSR name="chevron-right" />
        </Button>
      </Grid>
    </Section>
  );
};

export default HireCTA;
