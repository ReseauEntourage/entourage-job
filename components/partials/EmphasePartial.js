import React from 'react';
import { Section, GridNoSSR, ImgNoSSR } from '../utils';

const datas = [
  {
    imgSrc: '/static/img/illustrations/helping_process.png',
    imgAlt: 'profiles',
    number: '1',
    title: 'Découvrez les profils des candidats',
    description:
      'Nos candidats sont des gens en situation de précarité financière et professionnels, mais ils sont tous accompagnés par des travailleurs sociaux.',
  },
  {
    imgSrc: '/static/img/illustrations/flyer_sharing.png',
    imgAlt: 'partage',
    number: '2',
    title: 'Partagez leur CV',
    description:
      'Chaque candidat dévoile ses talents, aspirations et motivations à se réinsérer. En partageant leurs CVs avec vos proches, vous leur donnez de la visibilité.',
  },
  {
    imgSrc: '/static/img/illustrations/friendship.png',
    imgAlt: 'échange',
    number: '3',
    title: 'Laissez la puissance du réseau opérer',
    description:
      'Des dizaines de candidats ont déjà pu trouver un emploi grace à Linked Out. Un recruteur fait peut-être partie de votre réseau, alors à vos partages !',
  },
];
const EmphasePartial = () => (
  <Section style="default" id="profiles">
    <GridNoSSR gap="large" column middle eachWidths={['2-3@s', '1-1']}>
      <div className="uk-text-center">
        <h2 className="uk-text-bold">
          LinkedOut en <span className="uk-text-primary">trois</span> étapes
          {/* Un partage peut tout <span className="uk-text-primary">changer</span> */}
        </h2>
        {/* <p>
          Lorsque l’on est désocialisé, on devient invisible.
          <br />
          Les chances de retrouver un travail sont faible.
          <br />
          Faites un don de visibilité.
        </p> */}
      </div>
      <GridNoSSR
        middle
        center
        childWidths={['1-3@s']}
        items={datas.map(({ imgSrc, imgAlt, title, number }, i) => (
          <GridNoSSR
            style={{ paddingTop: '150px', width: 'auto' }}
            eachWidths={[
              'auto@s uk-width-1-4 uk-text-right',
              'expand@s uk-width-3-4',
            ]}
            row
          >
            <span className="uk-text-primary uk-heading-small">{number}</span>
            <GridNoSSR gap="small" column className="uk-position-relative">
              <div style={{ position: 'absolute', top: '-150px' }}>
                <ImgNoSSR
                  src={imgSrc}
                  alt={imgAlt}
                  className="uk-height-small"
                />
              </div>
              <h4 className="uk-margin-small-top">{title}</h4>
              <hr
                // className="uk-divider-small"
                style={{ borderTopColor: '#F55F24', width: '100px' }}
              />
              {/* <p>{value.description}</p> */}
            </GridNoSSR>
          </GridNoSSR>
        ))}
      />
    </GridNoSSR>
  </Section>
);
export default EmphasePartial;
