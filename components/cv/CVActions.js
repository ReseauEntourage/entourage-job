import React from 'react';
import { Button, Section } from '../utils';

const CVActions = () => (
  <Section>
    <h2 className="uk-text-bold">Ravi de te revoir, USERCONTEXTFIRSTNAME !</h2>
    <div data-uk-grid>
      <div className="uk-width-2-3@m">
        <p className="uk-text-lead">
          Bienvenue dans ton espace personnel, depuis lequel tu peux modifier
          les informations qui s&apos;affichent dans ta page profil candidat sur
          LinkedOut.fr.
        </p>
      </div>
      <div className="uk-width-auto"> </div>
    </div>
    <hr
      className="uk-margin-medium-top"
      style={{ borderTop: '1px solid black' }}
    />
    <div className="uk-align-right uk-text-center" data-uk-grid>
      <div className="uk-inline uk-padding-small">
        <Button style="default">Prévisualiser la page</Button>
      </div>
      <div className="uk-inline uk-padding-small uk-margin-remove">
        <Button style="primary">Publier</Button>
      </div>
    </div>
  </Section>
);

export default CVActions;
