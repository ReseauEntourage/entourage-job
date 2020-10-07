import React from 'react';
import Layout from '../../components/Layout';
import { Section } from '../../components/utils';
import ImageTitle from '../../components/sections/ImageTitle';
import Carousel from '../../components/utils/Carousel';
import CarouselItem from '../../components/partials/CarouselItem';
import { EXTERNAL_LINKS } from '../../constants';
import MultipleCTA from '../../components/partials/MultipleCTA';
import HowToBeInclusive from '../../components/sections/HowToBeInclusive';
import CorporateNewsletter from '../../components/partials/CorporateNewsletterPartial';

const Sinformer = () => {
  return (
    <Layout title="S'informer - LinkedOut">
      <ImageTitle
        img="/static/img/header_pic_hire.jpg"
        id="sinformer-title"
        title={
          <>
            Pourquoi et comment<div>devenir une</div>
            <div className="uk-text-primary">entreprise&nbsp;inclusive</div>
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
          société, c’est la conviction de LinkedOut.
        </p>
        <p className="uk-text-center">
          Il est temps de passer d’une logique d’insertion à une logique
          d’inclusion : ce n’est pas qu’aux personnes exclues de faire le chemin
          pour s’insérer mais aussi à l’entreprise de se transformer pour faire
          une place à tous.
        </p>
        <div
          className="uk-flex uk-flex-middle uk-margin-large-top"
          style={{ justifyContent: 'space-around' }}
        >
          <p className="uk-text-bold uk-text-center">
            La performance durable, c’est de&nbsp;
            <span className="uk-text-primary">
              s'ouvrir à la différence et de bâtir la confiance !
            </span>
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
                'Le Campus de l’inclusion propose des formations aux dirigeants d’organisation et vous aide à construire un plan d’action adapté à votre organisation.',
              button: {
                label: "Plus d'infos ici",
                href: EXTERNAL_LINKS.CAMPUS_INCLUSION,
                external: true,
                size: 'small',
              },
            },
            {
              title: <div>Sensibiliser ses collaborateurs</div>,
              text:
                'Nous proposons des ateliers pour ouvrir le dialogue autour de ce sujet dans votre entreprise et initier une démarche parmi vos collaborateurs. Intéressés ?',
              button: {
                label: 'Contactez nous',
                href: 'mailto:florent@entourage.social',
                external: true,
                size: 'small',
              },
            },
            {
              title: 'Agir dans son territoire',
              text:
                'Les clubs La France Une Chance rassemblent dans chaque territoire les entreprises engagées dans l’inclusion. Rejoignez votre club et découvrez les formes d’engagement locales.',
              button: {
                label: 'Retrouvez les clubs ici',
                href: EXTERNAL_LINKS.FRANCE_UNE_CHANCE,
                external: true,
                size: 'small',
              },
            },
            {
              title: 'Prêt à recruter ?',
              text:
                'Découvrez si un candidat LinkedOut correspond à votre besoin. Si vous êtes dans un autre territoire, contactez nos partenaires qui cherchent aussi des emplois pour leurs candidats.',
              button: {
                label: 'Je recrute',
                href: '/entreprises/cvs',
                size: 'small',
              },
            },
          ]}
          showHorizontalDividers
        />
      </Section>
      <CorporateNewsletter />
    </Layout>
  );
};

export default Sinformer;
