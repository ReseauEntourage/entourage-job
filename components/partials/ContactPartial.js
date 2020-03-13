import React from 'react';
import { Section, IconNoSSR, GridNoSSR } from '../utils';

const ContactPartial = () => (
  <Section style="default" container="" id="profiles">
    <div className="uk-text-center">
      <h3 className="uk-text-bold">
        Gardons contact,{' '}
        <span className="uk-text-primary">le programme évolue</span> !
      </h3>
    </div>
    <>
      {/* input */}
      <div
        className="uk-align-center uk-text-center uk-width-1-2@s"
        data-uk-grid
      >
        <GridNoSSR
          eachWidths={['expand', 'auto']}
          className="uk-padding-remove"
          gap="collapse"
        >
          <div data-uk-form-custom="target: true" className="uk-width-1-1">
            <a className="uk-form-icon" disabled>
              <IconNoSSR name="mail" />
            </a>
            <input
              className="uk-input"
              type="text"
              placeholder="Votre adresse mail..."
              style={{ borderBottom: 0, borderRadius: '2px 0 0 2px' }}
            />
          </div>
          <button
            type="button"
            className="uk-button uk-button-primary"
            style={{
              color: 'white',
              backgroundColor: '#F55F24',
              backgroundImage: 'none',
              textTransform: 'none',
              boder: null,
              padding: '0px 20px',
              borderRadius: '2px',
            }}
          >
            Écrivez-moi
          </button>
        </GridNoSSR>
      </div>
    </>
  </Section>
);
export default ContactPartial;
