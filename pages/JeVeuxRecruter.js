import React, { Fragment } from 'react';
import { HelpingCard, ScaleCard, Button, Section } from '../components/utils';
import { GridNoSSR } from '../components/utils/Grid';
import { IconNoSSR } from '../components/utils/Icon';

const JeVeuxRecruter = () => (
  <Fragment>
    <Section id="recruter1" style="default">
      <h1 className="uk-text-bold uk-text-center">
        Vous souhaitez <span className="uk-text-primary">recruter</span> un candidat ?
      </h1>
      <div className="uk-width-1-2 uk-align-center uk-text-center">
        <p>
          Recruteurs, plus que quiconque, faîtes la différence !
          Soyez acteur essentiel de l'opération LinkedOut par Entourage
          en publiant vos offres d'emplois et en cherchant les candidats
          qui feront le bonheur de votre entreprise.
        </p>
        <Button style="primary">Découvrir les candidats</Button>
      </div>
    </Section>
    <Section id="recruter2" style="default">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-width-1-2 uk-margin-large-bottom">
        Une opportunité <span className="uk-text-primary">et</span> une bonne action,
        <span className="uk-text-primary"> ne passez pas à côté !</span>
      </h2>
      <div data-uk-grid className="uk-child-width-expand@s">
        <div>
          <div className="uk-width-5-6">
            <h3 className="uk-text-bold"><span className="uk-text-primary">LinedOut plebiscité</span> par les recruteurs...</h3>
            <p>
              Le retour des recruteurs en entreprise est unanime : les candidats apportent une joie de
              vivre et une énergie qui facilitent leur intégration. Un bonheur au quotidien.
            </p>
          </div>
        </div>
        <div>
          <div class="uk-card uk-card-default uk-card-body uk-margin-medium">
            <div data-uk-grid>
              <div className="uk-width-auto uk-text-primary">
                <IconNoSSR name="quote-right" />
              </div>
              <div className="uk-width-expand">
                <p className="uk-text-small uk-margin-small">
                  Nous avons intégré Zineb à l'équipe il y a maintenant 6 mois.
                  Tout a été rendu facile par Entourage et les équipes de travail sont très satisfaites.
                </p>
                <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">Paul Jean</p>
                <p className="uk-margin-remove">Directeur RH chez Sanofi</p>
              </div>
              <div className="uk-width-auto uk-text-bottom" style={{ alignSelf: "flex-end" }}>
                <img src="/static/img/arthur.png" alt="Arthur" style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
              </div>
            </div>
          </div>
          <div class="uk-card uk-card-default uk-card-body uk-margin-medium">
            <div data-uk-grid>
              <div className="uk-width-auto uk-text-primary">
                <IconNoSSR name="quote-right" />
              </div>
              <div className="uk-width-expand">
                <p className="uk-text-small uk-margin-small">
                  Nous avons intégré Zineb à l'équipe il y a maintenant 6 mois.
                  Tout a été rendu facile par Entourage et les équipes de travail sont très satisfaites.
                </p>
                <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">Paul Jean</p>
                <p className="uk-margin-remove">Directeur RH chez Sanofi</p>
              </div>
              <div className="uk-width-auto uk-text-bottom" style={{ alignSelf: "flex-end" }}>
                <img src="/static/img/arthur.png" alt="Arthur" style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
              </div>
            </div>
          </div>
          <div class="uk-card uk-card-default uk-card-body uk-margin-medium">
            <div data-uk-grid>
              <div className="uk-width-auto uk-text-primary">
                <IconNoSSR name="quote-right" />
              </div>
              <div className="uk-width-expand">
                <p className="uk-text-small uk-margin-small">
                  Nous avons intégré Zineb à l'équipe il y a maintenant 6 mois.
                  Tout a été rendu facile par Entourage et les équipes de travail sont très satisfaites.
                </p>
                <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">Paul Jean</p>
                <p className="uk-margin-remove">Directeur RH chez Sanofi</p>
              </div>
              <div className="uk-width-auto uk-text-bottom" style={{ alignSelf: "flex-end" }}>
                <img src="/static/img/arthur.png" alt="Arthur" style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  </Fragment>
);

export default JeVeuxRecruter;
