import React from 'react';
import { addPrefix } from '../../utils';
import { CONTACT_INFO } from '../../constants';
import { Section } from '../utils';

const CorporateContact = () => {
  return (
    <Section style="muted">
      <h2 className="uk-text-bold uk-text-center">
        Une <span className="uk-text-primary">question ?</span>
      </h2>
      <p className="uk-text-center">
        Pour tout renseignement, l&apos;équipe se tient à votre disposition :
      </p>
      <div className="uk-flex uk-flex-center uk-flex-middle">
        <div
          style={{
            borderRadius: '50%',
            width: 80,
            height: 80,
            backgroundImage: `url(${addPrefix(
              '/static/img/logo-entourage.png'
            )})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          className="uk-overflow-hidden"
        />
        <a
          href={`mailto:${CONTACT_INFO.CORPORATE_CONTACT}`}
          target="_blank"
          className="uk-text-bold uk-margin-small-left"
          rel="noopener noreferrer"
        >
          <span uk-icon="mail" />
          &nbsp;
          {CONTACT_INFO.CORPORATE_CONTACT}
        </a>
      </div>
    </Section>
  );
};
export default CorporateContact;
