import React from 'react';
import { DiscovertPartial } from '../components/partials';
import { Section, SimpleLink, Button } from '../components/utils';
import { IconNoSSR } from '../components/utils/Icon';
import { GridNoSSR } from '../components/utils/Grid';
import {
  SkillsCard,
  PassionsCard,
  InfoProfileCard,
  StoryProfileCard,
  ExperiencesProfileCard,
  CommentProfileCard,
  ReviewCard,
} from '../components/cards';

const Profile = () => (
  <div>
    <div className="uk-flex uk-flex-center uk-flex-middle uk-background-primary uk-height-large uk-light">
      <h1 className="uk-heading-large">Zulfuye</h1>
    </div>
    <Section>
      <div className="uk-card uk-card-default uk-card-body uk-text-center uk-margin-medium">
        <h1 className="uk-width-xxlarge uk-margin-auto">
          <span className="uk-text-primary">Zulfuye</span>
          <br /> a besoin d'un coup de pouce et si votre partage faisait la
          différence?
        </h1>
        <span className="uk-text-primary">
          <IconNoSSR name="quote-right" ratio={2} />
        </span>
        <p className="uk-width-xlarge uk-margin-auto">
          Motivée et curieuse, j&apos;aimerais beaucoup travailler dans
          <span className="uk-text-primary"> la gestion </span>ou
          <span className="uk-text-primary"> l&apos;administration </span>mais
          reste ouverte à toutes autres propositions.
        </p>
        <Button href="#" style="primary">
          J'écris à ZulFuye
        </Button>
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
        childWidths={['1-2@s']}
        match
        items={[
          <InfoProfileCard
            contrat="CDI/CDD"
            location="Paris et proche"
            period="Semaine - Week-end (jour et nuit)"
            language="Français - Anglais(notions) - Arabe (notions)"
            car="Pas de permis"
          />,
          <GridNoSSR
            childWidths={['1-2@m']}
            match
            items={[
              <SkillsCard
                list={[
                  "à l'écoute",
                  'emphatique',
                  'sociable',
                  'optimiste',
                  'ponctuelle',
                  'motivée',
                ]}
              />,
              <PassionsCard
                list={['Cinéma', 'Histoire / Géopolitique', 'Sport']}
              />,
            ]}
          />,
        ]}
      />
      <GridNoSSR
        childWidths={['1-2@s']}
        items={[
          <GridNoSSR
            items={[
              <StoryProfileCard description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum sed diam eu pulvinar. Suspendisse tellus enim, sagittis sed odio bibendum, malesuada aliquet mauris. Integer lacinia diam quam, a auctor eros egestas vitae. Aliquam at ante convallis, gravida diam porttitor, ultricies metus. Integer in est urna. Maecenas ullamcorper, lorem id euismod malesuada, arcu orci suscipit nulla, sed rhoncus orci nibh vitae leo. Nulla ut nibh quis lacus tempor pretium." />,
              <ReviewCard
                picture="/static/img/arthur.png"
                review="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum sed diam eu pulvinar."
                author="Hervé"
                role="Assistant social"
              />,
              <ReviewCard
                picture="/static/img/arthur.png"
                review="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum sed diam eu pulvinar."
                author="Hervé"
                role="Assistant social"
              />,
            ]}
          />,
          <ExperiencesProfileCard
            experiences={[
              {
                dateStart: 'Mai 2018',
                dateEnd: 'Janvier 2019',
                title: 'Secretaire comptable et chagée de recouvrement',
                description:
                  'Duis fermentum sed diam eu pulvinar. Suspendisse tellus enim, sagittis sed odio bibendum, malesuada aliquet mauris.',
              },
              {
                dateStart: 'Mai 2018',
                dateEnd: 'Janvier 2019',
                title: 'Secretaire comptable et chagée de recouvrement',
                description:
                  'Duis fermentum sed diam eu pulvinar. Suspendisse tellus enim, sagittis sed odio bibendum, malesuada aliquet mauris.',
              },
              {
                dateStart: 'Mai 2018',
                dateEnd: 'Janvier 2019',
                title: 'Secretaire comptable et chagée de recouvrement',
                description:
                  'Duis fermentum sed diam eu pulvinar. Suspendisse tellus enim, sagittis sed odio bibendum, malesuada aliquet mauris.',
              },
              {
                dateStart: 'Mai 2018',
                dateEnd: 'Janvier 2019',
                title: 'Secretaire comptable et chagée de recouvrement',
                description:
                  'Duis fermentum sed diam eu pulvinar. Suspendisse tellus enim, sagittis sed odio bibendum, malesuada aliquet mauris.',
              },
              {
                dateStart: 'Mai 2018',
                dateEnd: 'Janvier 2019',
                title: 'Secretaire comptable et chagée de recouvrement',
                description:
                  'Duis fermentum sed diam eu pulvinar. Suspendisse tellus enim, sagittis sed odio bibendum, malesuada aliquet mauris.',
              },
              {
                dateStart: 'Mai 2018',
                dateEnd: 'Janvier 2019',
                title: 'Secretaire comptable et chagée de recouvrement',
                description:
                  'Duis fermentum sed diam eu pulvinar. Suspendisse tellus enim, sagittis sed odio bibendum, malesuada aliquet mauris.',
              },
            ]}
          />,
        ]}
      />
    </Section>
    <DiscovertPartial />
  </div>
);
export default Profile;
