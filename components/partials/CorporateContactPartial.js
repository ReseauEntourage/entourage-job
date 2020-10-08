import React from 'react';
import { Button, Section } from '../utils';

const CorporateContact = () => (
  <Section style="muted">
    <h2 className="uk-text-bold uk-text-center">
      Une <span className="uk-text-primary">question ?</span>
    </h2>
    <p className="uk-text-center">
      Pour tout renseignement, Florent se tient à votre disposition :
    </p>
    <div className="uk-flex uk-flex-center uk-flex-middle">
      <img
        style={{ width: '80px', borderRadius: '50%' }}
        src="/static/img/florent.jpg"
        alt="florent"
      />
      <a
        href="mailto:entreprises@entourage.social"
        target="_blank"
        className="uk-text-bold uk-margin-small-left"
        rel="noopener noreferrer"
      >
        <span uk-icon="mail" />
        &nbsp;entreprises@entourage.social
      </a>
    </div>
  </Section>
);
export default CorporateContact;
