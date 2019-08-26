import React from 'react';
import { DiscovertPartial } from '../components/partials';
import { Section, SimpleLink } from '../components/utils';
import { IconNoSSR } from '../components/utils/Icon';
import { GridNoSSR } from '../components/utils/Grid';

const Profile = () => (
  <div>
    <div className="uk-flex uk-flex-center uk-flex-middle uk-background-primary uk-height-large uk-light">
      {/* <img data-src="" alt="" data-uk-img/> */}
      <h1 className="uk-heading-large">Zulfuye</h1>
    </div>
    <Section>
      <div className="uk-card uk-card-default uk-card-body uk-text-center uk-margin-medium">
        <h1>
          <span className="uk-text-primary">Zulfuye</span> a besoin d'un coup de
          pouce et si votre partage faisait la différence?
        </h1>
        <span className="uk-text-primary">
          <IconNoSSR name="quote-right" ratio={2} />
        </span>
        <p>
          Motivée et curieuse, j&apos;aimerais beaucoup travailler dans
          <span className="uk-text-primary"> la gestion </span>ou
          <span className="uk-text-primary"> l&apos;administration </span>mais
          reste ouverte à toutes autres propositions.
        </p>
        <p>partagez le CV de Zulfuye sur vos réseaux</p>
        <div>
          <SimpleLink href="#">
            <div className="uk-icon-button uk-margin-right">
              <IconNoSSR name="linkedin" />
            </div>
          </SimpleLink>
          <SimpleLink href="#">
            <div className="uk-icon-button uk-margin-right">
              <IconNoSSR name="facebook" />
            </div>
          </SimpleLink>
          <SimpleLink href="#">
            <div className="uk-icon-button">
              <IconNoSSR name="twitter" />
            </div>
          </SimpleLink>
        </div>
      </div>
      <GridNoSSR
        childWidths={['1-2']}
        match
        items={[
          <div className="uk-card uk-card-secondary uk-card-body">
            <h3 className="uk-card-title">
              <span className="uk-margin-small-right">
                <IconNoSSR name="info" />
              </span>
              Infos pratiques
            </h3>
            <ul className="uk-list">
              <li>
                <IconNoSSR name="file-text" /> CDI/CDD
              </li>
              <li>
                <IconNoSSR name="location" /> Paris et proche
              </li>
              <li>
                <IconNoSSR name="calendar" /> Semaine - Week-end (jour et nuit)
              </li>
              <li>
                <IconNoSSR name="users" /> Français - Anglais(notions) - Arabe
                (notions)
              </li>
              <li>
                <IconNoSSR name="cart" /> Pas de permis
              </li>
            </ul>
          </div>,
          <GridNoSSR
            childWidths={['1-2']}
            match
            items={[
              <div className="uk-card uk-card-default uk-card-body">
                <h3 className="uk-card-title">
                  <IconNoSSR name="skills" />
                  Mes atouts
                </h3>
                <ul className="uk-list">
                  <li>à l'écoute</li>
                  <li>emphatique</li>
                  <li>sociable</li>
                  <li>optimiste</li>
                  <li>ponctuelle</li>
                  <li>motivée</li>
                </ul>
              </div>,
              <div className="uk-card uk-card-default uk-card-body">
                <h3 className="uk-card-title">
                  <IconNoSSR name="love" />
                  Mes passions
                </h3>
                <ul className="uk-list">
                  <li>Cinéma</li>
                  <li>Histoire / Géopolitique</li>
                  <li>Sport</li>
                </ul>
              </div>,
            ]}
          />,
        ]}
      />
      {/* <article class="uk-comment">
    <div class="uk-comment-header uk-grid-medium uk-flex-middle" uk-grid>
        <div class="uk-width-auto">
            <img class="uk-comment-avatar" src="images/avatar.jpg" width="80" height="80" alt="">
        </div>
        <div class="uk-width-expand">
            <h4 class="uk-comment-title uk-margin-remove"><a class="uk-link-reset" href="#">Author</a></h4>
            <ul class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove-top">
                <li><a href="#">12 days ago</a></li>
                <li><a href="#">Reply</a></li>
            </ul>
        </div>
    </div>
    <div class="uk-comment-body">
        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
    </div>
      </article> */}
    </Section>
    <DiscovertPartial />
  </div>
);

export default Profile;
