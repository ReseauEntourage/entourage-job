import React from 'react';
import Layout from '../../components/Layout';
import { Section } from '../../components/utils';
import ImageTitle from '../../components/sections/ImageTitle';
import Carousel from '../../components/utils/Carousel';
import CarouselItem from '../../components/partials/CarouselItem';
import { EXTERNAL_LINKS } from '../../constants';
import MultipleCTA from '../../components/partials/MultipleCTA';
import HowToBeInclusive from '../../components/sections/HowToBeInclusive';

const Sensibiliser = () => {
  return (
    <Layout title="Sensibiliser - LinkedOut">
      <ImageTitle
        img="/static/img/header_pic_hire.jpg"
        id="sensibiliser-title"
        title={
          <>
            Comment et pourquoi devenir une&nbsp;
            <span className="uk-text-primary">entreprise&nbsp;inclusive</span>
          </>
        }
      />
      <Section style="muted" container="small">
        <h2 className="uk-text-bold uk-text-center">
          <span className="uk-text-primary">Engager</span> mon entreprise dans
          l’inclusion : pourquoi ?
        </h2>
        <p className="uk-text-center">
          Chacun devrait pouvoir avoir sa place dans l’entreprise et dans la
          société, c’est la conviction de LinkedOut. Ce n’est pas qu’aux
          personnes exclues de faire le chemin mais aussi à l’entreprise de se
          transformer pour faire une place à tous.
        </p>
        <div
          className="uk-flex uk-flex-middle uk-margin-large-top"
          style={{ justifyContent: 'space-around' }}
        >
          <p className="uk-text-bold">
            Changeons de paradigme,{' '}
            <span className="uk-text-primary">à bas l’individualisme !</span>
          </p>
          <div style={{ background: 'black', color: 'white', padding: '8rem' }}>
            @TODO Vidéo à intégrer
          </div>
        </div>
      </Section>
      <Section style="default" container="small">
        <h2 className="uk-text-bold uk-text-center">
          Un emploi, <span className="uk-text-primary">ça change une vie</span>
        </h2>
        <p className="uk-text-center uk-margin-large-bottom">
          Jeunes issus de l’aide sociale à l’enfance, réfugiés nouvellement
          arrivés, personnes ayant eu des accidents de la vie… tous ont en
          commun de n’avoir que très peu de gens sur qui compter. Beaucoup ont
          aussi des compétences, du talent, et l’envie de s’en sortir. Loin
          d’être assistés, ils rêvent de travailler !
        </p>
        <Carousel containerClasses="uk-child-width-1-1" style="muted">
          <CarouselItem
            key={0}
            index={0}
            img="/static/img/highlight_1.jpg"
            description={
              <h4 className="uk-bold uk-text-primary">Retrouver sa dignité</h4>
            }
          />
          <CarouselItem
            key={1}
            index={1}
            img="/static/img/highlight_1.jpg"
            description={
              <h4 className="uk-bold uk-text-primary">
                Retrouver son autonomie financière
              </h4>
            }
          />
          <CarouselItem
            key={2}
            index={2}
            img="/static/img/highlight_1.jpg"
            description={
              <h4 className="uk-bold uk-text-primary">Se resocialiser</h4>
            }
          />
          <CarouselItem
            key={3}
            index={3}
            img="/static/img/highlight_1.jpg"
            description={
              <h4 className="uk-bold uk-text-primary">Se sentir utile</h4>
            }
          />
          <CarouselItem
            key={4}
            index={4}
            img="/static/img/highlight_1.jpg"
            description={
              <h4 className="uk-bold uk-text-primary">
                Et pouvoir à nouveau se projeter.
              </h4>
            }
          />
        </Carousel>
      </Section>
      <HowToBeInclusive />
      <Section style="default" container="small">
        <Carousel containerClasses="uk-child-width-1-1">
          <CarouselItem
            key={1}
            index={1}
            img="/static/img/highlight_1.jpg"
            description={
              <h4 className="uk-bold uk-text-primary">
                @TODO contenu à intégrer
              </h4>
            }
          />
          <CarouselItem
            key={2}
            index={2}
            img="/static/img/highlight_1.jpg"
            description={
              <h4 className="uk-bold uk-text-primary">
                @TODO contenu à intégrer
              </h4>
            }
          />
        </Carousel>
      </Section>
      <Section style="muted" container="small">
        <h2 className="uk-text-bold uk-text-center uk-margin-large-bottom">
          <span className="uk-text-primary">Des ressources</span>&nbsp;pour vous
          lancer
        </h2>
        <MultipleCTA
          spacing="medium"
          data={[
            {
              title: 'Se former à l’inclusion',
              text:
                'Pour approfondir les piliers ci-dessus et commencer à construire un plan d’action adapté à votre organisation, notre partenaire Le Campus de l’inclusion propose des formations aux dirigeants d’organisation.',
              button: {
                label: "Plus d'infos ici",
                href: EXTERNAL_LINKS.CAMPUS_INCLUSION,
                external: true,
                size: 'small',
              },
            },
            {
              title: <div>Sensibiliser mes collaborateurs</div>,
              text:
                'Nous proposons des ateliers de sensibilisation pour ouvrir le dialogue autour de ce sujet dans votre entreprise, sentir la sensibilité de vos collaborateurs et co-construire une démarche. Intéressé ?',
              button: {
                label: 'Contactez nous',
                href: 'mailto:florent@entourage.social',
                external: true,
                size: 'small',
              },
            },
            {
              title: 'Agir dans mon territoire',
              text:
                'Les clubs d’entreprise La France Une Chance rassemblent dans chaque territoire les entreprises engagées dans l’inclusion. Rejoignez le club et découvrez les formes d’engagement locales.',
              button: {
                label: 'Retrouvez les clubs ici',
                href: EXTERNAL_LINKS.FRANCE_UNE_CHANCE,
                external: true,
                size: 'small',
              },
            },
            {
              title: <div>Déjà prêt à recruter inclusif&nbsp;?</div>,
              text:
                'Découvrez sur LinkedOut.fr si un candidat vous correspond. Si vous êtes dans un autre territoire, découvrez dans votre territoire nos organisations partenaires qui cherchent elles aussi des jobs à leurs candidats.',
            },
          ]}
          showHorizontalDividers
        />
      </Section>
    </Layout>
  );
};

export default Sensibiliser;
