import React from 'react';
import ModalInterestLinkedOut from 'src/components/modals/ModalInterestLinkedOut';
import { event } from 'src/lib/gtag';
import TAGS from 'src/constants/tags';
import { Button, Grid, Section } from 'src/components/utils';

const CorporateContact = () => {
  return (
    <Section style="muted">
      <h2 className="uk-text-bold uk-text-center">
        Une <span className="uk-text-primary">question ?</span>
      </h2>
      <p className="uk-text-center">
        Pour tout renseignement, l&apos;équipe se tient à votre
        disposition&nbsp;!
      </p>
      <Grid middle column gap="collapse">
        <Button
          style="secondary"
          className="uk-margin-small-top"
          toggle="target: #modal-interest-linkedOutStyled"
          onClick={() => {
            return event(TAGS.PAGE_AIDER_CONTACT_RECRUTEUR_CLIC);
          }}
        >
          Nous contacter
        </Button>
      </Grid>
      <ModalInterestLinkedOut />
    </Section>
  );
};
export default CorporateContact;
