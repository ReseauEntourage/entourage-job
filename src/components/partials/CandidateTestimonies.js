import React from 'react';
import { Img, Section } from 'src/components/utils';
import Carousel from 'src/components/utils/Carousel';
import CarouselItem from 'src/components/partials/CarouselItem';

const testimonies = [
  {
    image: '/static/img/temoignage-candidat-miah.png',
    author: 'Miah',
    quote: 'Trouver du travail a changé ma vie.',
  },
  {
    image: '/static/img/temoignage-candidat-laith.jpg',
    author: 'Laith',
    quote:
      'LinkedOut m’a permis d’avoir un emploi stable et un réseau vers qui me tourner. Je peux enfin être utile à la société.',
  },
  {
    image: '/static/img/temoignage-candidat-nasser.jpg',
    author: 'Nasser',
    quote:
      'Avoir un emploi ouvre le champ des possibles dans une vie. Que de défis à affronter pour y arriver mais on puise nos forces au plus profond de nos âmes.',
  },
  {
    image: '/static/img/temoignage-candidat-kenny.jpg',
    author: 'Kenny',
    quote:
      'Avec un emploi, j’ai retrouvé ma dignité tout simplement ! Une dignité qu’on laisse dans la rue. Maintenant je n’attends qu’une chose : pouvoir moi aussi payer des impôts !',
  },
  {
    image: '/static/img/temoignage-candidat-ross.jpg',
    author: 'Ross',
    quote:
      'Travailler, c’est une question de respect pour soi-même, je préfère gagner ma vie plutôt qu’être dépendant de la générosité des autres.',
  },
  {
    image: '/static/img/temoignage-candidat-cornelia.jpg',
    author: 'Cornelia',
    quote:
      'Travailler, c’est ne plus être seule, c’est retrouver des collègues tous les jours. Ca transforme et embellit le quotidien.',
  },
  {
    image: '/static/img/temoignage-candidat-anais.jpg',
    author: 'Anais',
    quote:
      'Je veux travailler pour être indépendante financièrement et offrir un avenir à ma fille.',
  },
  {
    image: '/static/img/temoignage-candidat-orelio.jpg',
    author: 'Orelio',
    quote:
      'Trouver un boulot ça change tout dans la tête : ça permet de rebondir. Un futur est possible !',
  },
  {
    image: '/static/img/temoignage-candidat-mickael.jpg',
    author: 'Mickaël',
    quote:
      'Quand tu touches le RSA, tu ne l’as pas gagné à la sueur de ton front, c’est humiliant de vivre aux crochets de la société.',
  },
];

const CandidateTestimonies = () => {
  return (
    <Section style="default" container="small">
      <h2 className="uk-text-bold uk-text-center">
        Un emploi, <span className="uk-text-primary">ça change une vie</span>
      </h2>
      <p className="uk-text-center">
        Jeunes issus de l’aide sociale à l’enfance, réfugiés nouvellement
        arrivés, accidentés de la vie, familles très précaires… tous ont en
        commun de n’avoir que très peu de gens sur qui compter. Beaucoup ont
        aussi des compétences, du talent, et l’envie de s’en sortir.
      </p>
      <p className="uk-text-center uk-margin-large-bottom">
        Aujourd’hui,&nbsp;
        <span className="uk-text-primary uk-text-bold">
          2 millions de personnes sont exclues du marché de l’emploi et vivent
          dans une grande précarité
        </span>
        . Pourtant, loin d’être assistés, ils rêvent de travailler !
      </p>
      <div className="uk-flex uk-flex-center">
        <Carousel
          style="default"
          containerClasses="uk-container-small uk-child-width-1-1"
        >
          {testimonies.map(({ author, image, quote }, index) => {
            return (
              <CarouselItem
                key={index}
                index={index}
                img={image}
                description={
                  <div>
                    <Img
                      alt="guillemets"
                      width="27"
                      height="21"
                      src="/static/img/guillemets.png"
                    />
                    <p className="uk-text-small uk-margin-small uk-text-italic">
                      {quote}
                    </p>
                    <div
                      className="uk-text-bottom"
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Img
                        alt="guillemets-petits"
                        width="15"
                        height="12"
                        src="/static/img/guillemetsPetits.png"
                      />
                    </div>
                    <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">
                      {author}
                    </p>
                  </div>
                }
              />
            );
          })}
        </Carousel>
      </div>
      <p className="uk-text-center">
        On sous-estime souvent le rôle que l’emploi joue dans nos vies. Loin de
        se résumer à sa seule dimension économique,{' '}
        <span className="uk-text-primary uk-text-bold">
          l’emploi est une colonne vertébrale qui tient les gens debout
        </span>{' '}
        : il leur rend leur dignité, apporte du lien social, permet de se
        projeter et de se sentir utile à la société. L’emploi est une clé
        essentielle pour l&apos;accomplissement de soi.
      </p>
    </Section>
  );
};

export default CandidateTestimonies;
