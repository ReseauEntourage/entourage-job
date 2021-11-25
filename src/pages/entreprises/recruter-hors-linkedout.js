import React from 'react';
import Layout from 'src/components/Layout';
import { Section } from 'src/components/utils';
import PartnersMap from 'src/components/partials/PartnersMap';
import MultipleCTA from 'src/components/partials/MultipleCTA';
import { EXTERNAL_LINKS } from 'src/constants';
import NewsletterPartial from 'src/components/partials/NewsletterPartial';

const RecruterHorsLinkedOut = () => {
  return (
    <Layout title="Recruter en dehors du réseau - LinkedOut">
      <Section container="small" style="muted">
        <h1 className="uk-text-bold uk-text-center">
          <span className="uk-text-primary">Recruter</span>
          &nbsp;un candidat en précarité
        </h1>
        <p className="uk-text-center">
          Le programme LinkedOut est pour l’instant présent seulement en
          Île-de-France, à Lille et à Lyon.
        </p>
        <p className="uk-text-center">
          Dans les territoires où nous ne sommes pas présents, nous avons mis en
          place des partenariats avec des acteurs de l’insertion qui recherchent
          des opportunités d’emploi pour leurs candidats tout au long de
          l’année.
        </p>
        <p className="uk-text-center">
          Contactez-les de la part de LinkedOut, ils vous accueilleront à bras
          ouverts&nbsp;!
        </p>
        <h2 className="uk-text-bold uk-text-center uk-text-large">
          Contactez nos partenaires&nbsp;:
        </h2>
        <PartnersMap />
      </Section>
      <Section container="small">
        <MultipleCTA
          data={[
            {
              title: 'Vous ne trouvez pas de partenaire sur votre territoire ?',
              text: (
                <p>
                  Il existe d’autres façons d’agir avec nous. Découvrez toutes
                  les autres manières de vous engager aux côtés de
                  LinkedOut&nbsp;:
                </p>
              ),
              button: {
                label: "S'engager",
                href: '/entreprises#sengager',
              },
            },
            {
              title: 'Découvrez les clubs La France une chance',
              text: (
                <p>
                  Rejoignez d’autres entreprises engagées dans votre département
                  et découvrez des moyens d’agir localement&nbsp;:
                </p>
              ),
              button: {
                label: 'Découvrir',
                href: EXTERNAL_LINKS.FRANCE_UNE_CHANCE,
                external: true,
              },
            },
          ]}
        />
      </Section>
      <NewsletterPartial style="muted" />
    </Layout>
  );
};

export default RecruterHorsLinkedOut;
