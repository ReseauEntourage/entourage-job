import React from 'react';
import { DiscovertPartial } from '../components/partials';
import { Section, Grid } from '../components/utils';

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
        <span
          className="uk-text-primary"
          uk-icon="icon: quote-right; ratio: 2"
        />
        <p>
          Motivée et curieuse, j&apos;aimerais beaucoup travailler dans
          <span className="uk-text-primary"> la gestion </span>ou
          <span className="uk-text-primary"> l&apos;administration </span>mais
          reste ouverte à toutes autres propositions.
        </p>
        <p>partagez le CV de Zulfuye sur vos réseaux</p>
        <div>
          <a
            href=""
            className="uk-icon-button uk-margin-right"
            uk-icon="linkedin"
          />
          <a
            href=""
            className="uk-icon-button uk-margin-right"
            uk-icon="facebook"
          />
          <a href="" className="uk-icon-button" uk-icon="twitter" />
        </div>
      </div>
      <Grid
        childWidths={['1-2']}
        match
        items={[
          <div className="uk-card uk-card-secondary uk-card-body">
            <h3 className="uk-card-title">
              <span className="uk-margin-small-right" uk-icon="info" />
              Infos pratiques
            </h3>
            <ul className="uk-list">
              <li>
                <span uk-icon="file-text" /> CDI/CDD
              </li>
              <li>
                <span uk-icon="location" /> Paris et proche
              </li>
              <li>
                <span uk-icon="calendar" /> Semaine - Week-end (jour et nuit)
              </li>
              <li>
                <span uk-icon="users" /> Français - Anglais(notions) - Arabe
                (notions)
              </li>
              <li>
                <span uk-icon="cart" /> Pas de permis
              </li>
            </ul>
          </div>,
          <Grid
            childWidths={['1-2']}
            match
            items={[
              <div className="uk-card uk-card-default uk-card-body">
                <h3 className="uk-card-title">
                  <span uk-icon="skills" />
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
                  <span uk-icon="love" />
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
