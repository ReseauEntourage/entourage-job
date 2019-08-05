import { HelpingCard } from '../components/utils/card';
import React from 'react';

const JeVeuxAider = () => (
  <div>
    <div className="uk-section uk-section-default">
      <div className="uk-container">
        <div data-uk-grid>
          <div className="uk-width-1-2" id="help">
            <div className="uk-margin-right">
              <h1>
                Vous souhaitez <span className="uk-text-primary">aider</span> ?
              </h1>
            </div>
          </div>
          <div className="uk-width-1-2">
            <HelpingCard
              titleHead="Vous connaissez une personne en difficulté ? "
              titleMiddle="Entourage vous accompagne"
              titleTail=" dans les démarches"
              description="Vous n'êtes pas seul! Entourage vous donne les outils pour soutenir efficacement une personne danssa recherche professionnelle et dans sa prise de poste"
              img="/static/img/help_1.png"
            />
            <HelpingCard
              titleHead="Vous connaissez une personne en difficulté ? "
              titleMiddle="Entourage vous accompagne"
              titleTail=" dans les démarches"
              description="Vous n'êtes pas seul! Entourage vous donne les outils pour soutenir efficacement une personne danssa recherche professionnelle et dans sa prise de poste"
              img="/static/img/help_2.png"
            />
            <HelpingCard
              titleHead="Vous connaissez une personne en difficulté ? "
              titleMiddle="Entourage vous accompagne"
              titleTail=" dans les démarches"
              description="Vous n'êtes pas seul! Entourage vous donne les outils pour soutenir efficacement une personne danssa recherche professionnelle et dans sa prise de poste"
              img="/static/img/help_3.png"
            />
          </div>
        </div>
      </div>
    </div>
    <div className="uk-section uk-section-default">
      <div className="uk-container">
        <div className="uk-text-center" id="scale">
          <h1>
            Aider <span className="uk-text-primary">à votre échelle</span>
          </h1>
          <div className="uk-child-width-1-2" data-uk-grid>
            <div>
              <div className="uk-card uk-card-body">
                <h2>
                  Je suis <span className="uk-text-primary">un particulier</span>
                </h2>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam repellat
                  suscipit, quo iure similique beatae recusandae eius itaque.
                </p>
              </div>
            </div>
            <div>
              <div className="uk-card uk-card-body">
                <h2>
                  Je suis <span className="uk-text-primary">un particulier</span>
                </h2>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam repellat
                  suscipit, quo iure similique beatae recusandae eius itaque.
                </p>
              </div>
            </div>
            <div>
              <div className="uk-card uk-card-body">
                <h2>
                  Je suis <span className="uk-text-primary">un particulier</span>
                </h2>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam repellat
                  suscipit, quo iure similique beatae recusandae eius itaque.
                </p>
              </div>
            </div>
            <div>
              <div className="uk-card uk-card-body">
                <h2>
                  Je suis <span className="uk-text-primary">un particulier</span>
                </h2>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam repellat
                  suscipit, quo iure similique beatae recusandae eius itaque.
                </p>
              </div>
            </div>
          </div>
          <button className="uk-button uk-button-default uk-text-uppercase">écrivez-nous</button>
        </div>
      </div>
    </div>
  </div>
);

export default JeVeuxAider;
