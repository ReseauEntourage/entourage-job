import React from 'react';
import { Button, IconNoSSR, Section } from '../utils';

const ContactPartial = () => (
  <Section style="muted" size="large" id="contact">
    <h3 className="uk-text-center uk-text-bold">
      <span>Gardons contact, </span>
      <span className="uk-text-primary">le programme évolue</span> !
    </h3>
    <div className="uk-margin-medium-top">
      <form>
        <div className="uk-align-center uk-text-center" data-uk-grid>
          <div className="uk-padding-remove">
            <div data-uk-form-custom="target: true">
              <a className="uk-form-icon" disabled>
                <IconNoSSR name="mail" />
              </a>
              <input
                className="uk-input uk-margin-small"
                type="text"
                placeholder="Votre adresse mail..."
              />
            </div>
            <Button style="primary">Ecrivez-nous</Button>
          </div>
        </div>
      </form>
    </div>
  </Section>
);
export default ContactPartial;
