import React from 'react';
import { useRouter } from 'next/router';
import { DiscovertPartial, ContactPartial } from '../../components/partials';
import { Section } from '../../components/utils';
import { GridNoSSR } from '../../components/utils/Grid';
import {
  SkillsCard,
  PassionsCard,
  InfoProfileCard,
  StoryProfileCard,
  ExperiencesProfileCard,
  ReviewCard,
  CVPresentationCard,
  CVBackground,
} from '../../components/cards';

const CV = () => {
  const router = useRouter();
  const { id } = router.query;
  const email = `${id}@gmail.com`;
  const link = `https://entourage-job-preprod.herokuapp.com/cv/${id}`;
  const backgroundUrl =
    'https://www.telegraph.co.uk/content/dam/Travel/2018/October/bear%20standing.jpg?imwidth=1400';
  return (
    <div style={{ position: 'relative' }}>
      <CVBackground url={backgroundUrl} />
      <Section>
        <CVPresentationCard
          name={id}
          link={link}
          email={email}
          description={
            <span>
              Motivée et curieuse, j&apos;aimerais beaucoup travailler dans
              <span className="uk-text-primary"> la gestion </span>ou
              <span className="uk-text-primary"> l&apos;administration </span>
              mais reste ouverte à toutes autres propositions.
            </span>
          }
        />
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
              experiences={Array(6).fill({
                dateStart: 'Mai 2018',
                dateEnd: 'Janvier 2019',
                title: 'Secretaire comptable et chagée de recouvrement',
                description:
                  'Duis fermentum sed diam eu pulvinar. Suspendisse tellus enim, sagittis sed odio bibendum, malesuada aliquet mauris.',
              })}
            />,
          ]}
        />
      </Section>
      <ContactPartial />
      <DiscovertPartial />
    </div>
  );
};

export default CV;
