import React from 'react';
import Layout from '../../components/Layout';
import CorporateContact from '../../components/partials/CorporateContactPartial';
import { Section } from '../../components/utils';
import { PartnersMapNoSSR } from '../../components/partials/PartnersMap';
import MultipleCTA from '../../components/partials/MultipleCTA';
import {EXTERNAL_LINKS} from '../../constants';

const RecruterHorsLinkedOut = () => (
  <Layout title="Recruter en dehors du réseau - LinkedOut">
    <Section container="small" style="muted">
      <h1 className="uk-text-bold uk-text-center">
        <span className="uk-text-primary">Recruter</span>
        &nbsp;un candidat en précarité
      </h1>
      <p className="uk-text-center">
        @TODO Texte intro pour dire que LinkedOut n’est pas partout en France. Mais
        dans chaque territoire, nos partenaires agissent et recherchent aussi
        des offres d’emploi pour leurs candidats.
      </p>
      <h2 className="uk-text-bold uk-text-center uk-text-large">
        Contactez nos partenaires&nbsp;:
      </h2>
      <PartnersMapNoSSR />
    </Section>
    <Section container="small">
      <MultipleCTA
        data={[
          {
            title: 'Vous ne trouvez pas de partenaire sur votre territoire ?',
            text:
              <div>Il existe d’autres façons d’agir avec nous. Découvrez toutes les autres manières de vous engager aux côtés de LinkedOut&nbsp;:</div>,
            button: {
              label: "S'engager",
              href: '/entreprises/sengager',
            },
          },
          {
            title:
              'Rejoignez d’autres entreprises engagées dans votre territoire et découvrez des moyens d’agir localement',
            text: <div>Découvrez les Clubs départementaux La France une Chance&nbsp;:</div>,
            button: {
              label: 'Découvrir',
              href: EXTERNAL_LINKS.FRANCE_UNE_CHANCE,
              external: true,
            },
          },
        ]}
      />
    </Section>
    <CorporateContact />
  </Layout>
);

export default RecruterHorsLinkedOut;
