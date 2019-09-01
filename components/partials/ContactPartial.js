import React from 'react';
import { IconNoSSR, Section } from '../utils';

const ContactPartial = () => (
  <Section style="muted" size="large" id="contact">
    <h2 className="uk-text-center">
      <span>Gardons contact, </span>
      <span className="uk-text-primary">le programme évolue</span> !
    </h2>
    <div className="uk-margin-medium-top uk-flex uk-flex-center">
      <form>
        <div className="uk-button-group">
          <div data-uk-form-custom="target: true">
            <a className="uk-form-icon" href="#">
              <IconNoSSR name="mail" />
            </a>
            <input
              className="uk-input"
              type="text"
              placeholder="Votre adresse mail"
            />
          </div>
          <button type="button" className="uk-button uk-button-default">
            Ecrivez-nous
          </button>
        </div>
      </form>
    </div>
  </Section>
);
export default ContactPartial;
