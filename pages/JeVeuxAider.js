import React from 'react';

import PropsType from 'prop-types';
import { HelpingCard, Button, Section, Grid } from '../components/utils';
import { DiscovertPartial, EmphasePartial } from '../components/partials';

const ScaleCard = ({ title, titleEmphaseStart, description }) => {
  const arr = title.split(' ');
  const title1 = arr.slice(0, titleEmphaseStart).join(' ');
  const title2 = arr.slice(titleEmphaseStart).join(' ');
  return (
    <div className="uk-card uk-height-1-1 uk-card-default uk-card-body">
      <h3>
        <span>{title1} </span>
        <span className="uk-text-primary">{title2}</span>
      </h3>
      <p>{description}</p>
    </div>
  );
};
ScaleCard.propTypes = {
  title: PropsType.string.isRequired,
  titleEmphaseStart: PropsType.arrayOf(PropsType.string).isRequired,
  description: PropsType.string.isRequired,
};

const JeVeuxAider = () => (
  <div>
    <Section style="default">
      <Grid
        childWidths={['1-2']}
        items={[
          <div id="help">
            <div className="uk-margin-right">
              <h1>
                Vous souhaitez <span className="uk-text-primary">aider</span> ?
              </h1>
            </div>
          </div>,
          <div>
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
          </div>,
        ]}
      />
    </Section>
    <Section style="muted">
      <div className="uk-text-center" id="scale">
        <h2>
          Aider <span className="uk-text-primary">à votre échelle</span>
        </h2>
        <div
          className="uk-position-relative uk-visible-toggle uk-padding"
          tabIndex="-1"
          data-uk-slider="finite: false; autoplay: true"
        >
          {/*  */}
          <ul
            className="uk-slider-items uk-grid-small uk-child-width-1-4"
            data-uk-grid
          >
            {[
              <li>
                <ScaleCard
                  title="Je suis un particulier"
                  titleEmphaseStart={2}
                  description="Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Laboriosam repellat suscipit, quo iure similique beatae
            recusandae eius itaque."
                />
              </li>,
              <li>
                <ScaleCard
                  title="Je suis un acteur du millieu associatif"
                  titleEmphaseStart={2}
                  description="Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Laboriosam repellat suscipit, quo iure similique beatae
            recusandae eius itaque."
                />
              </li>,
              <li>
                <ScaleCard
                  title="Je veux recruter"
                  titleEmphaseStart={2}
                  description="Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Laboriosam repellat suscipit, quo iure similique beatae
            recusandae eius itaque."
                />
              </li>,
              <li>
                <ScaleCard
                  title="Je suis un travailleur social"
                  titleEmphaseStart={2}
                  description="Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Laboriosam repellat suscipit, quo iure similique beatae
            recusandae eius itaque."
                />
              </li>,
            ]}
          </ul>
          <a
            className="uk-position-center-left uk-position-small uk-hidden-hover"
            href="#"
            data-uk-slidenav-previous
            data-uk-slider-item="previous"
          />
          <a
            className="uk-position-center-right uk-position-small uk-hidden-hover"
            href="#"
            data-uk-slidenav-next
            data-uk-slider-item="next"
          />
        </div>
        <Button style="primary">écrivez-nous</Button>
        {/* uk-text-uppercase */}
      </div>
    </Section>
    <DiscovertPartial />
  </div>
);

export default JeVeuxAider;
