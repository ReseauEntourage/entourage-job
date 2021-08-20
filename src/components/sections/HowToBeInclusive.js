import React from 'react';
import { Section } from 'src/components/utils';
import Grid from 'src/components/utils/Grid';

const tips = [
  {
    title: (
      <>
        Recruter
        <br />
        inclusif
      </>
    ),
    text: (
      <p>
        Osez donner sa chance à une personne en précarité pour lui permettre de
        trouver sa place dans votre entreprise et dans la société.
      </p>
    ),
  },
  {
    title: (
      <>
        Acheter
        <br />
        inclusif
      </>
    ),
    text: (
      <p>
        En achetant des services à des structures d’insertion ou à des ESAT,
        vous créez de l’activité économique pour des personnes vulnérables.
      </p>
    ),
  },
  {
    title: 'Soutenir des associations',
    text: (
      <p>
        Par du mécénat financier, de moyens ou de compétences, soutenez des
        projets comme LinkedOut ou d&apos;autres qui accompagnent des personnes
        fragiles.
      </p>
    ),
  },
  {
    title: 'Engager ses collaborateurs',
    text: (
      <p>
        Par la sensibilisation de vos salariés à la question de la fragilité,
        vous contribuez à diffuser une culture de l’inclusion dans le monde du
        travail.
      </p>
    ),
  },
];

const TipsGrid = () => {
  return (
    <div>
      <Grid
        childWidths={[`1-${tips.length}@m`]}
        match
        className="uk-margin-top"
        gap="large"
        items={tips.map((item, index) => {
          return (
            <div key={index.toString()}>
              <h4
                className="uk-text-bold"
                style={{
                  paddingLeft: '0.7rem',
                  borderLeft: '2px solid #F55F24',
                }}
              >
                {item.title}
              </h4>
              {item.text && <div className="uk-text-small">{item.text}</div>}
            </div>
          );
        })}
      />
    </div>
  );
};

const HowToBeInclusive = () => {
  return (
    <Section style="muted" container="small">
      <h2 className="uk-text-bold uk-text-center">
        <span className="uk-text-primary">Concrètement,</span>&nbsp;comment être
        inclusif ?
      </h2>
      <div className="uk-flex uk-flex-center uk-margin-top uk-padding-small">
        <p className="uk-container-small uk-text-center">
          Il y a 1001 manières de s’engager dans l’inclusion. La plus impactante
          est bien sûr de vous engager en tant qu’employeur, en donnant accès à
          l’emploi à des personnes qui en sont éloignées. Mais vous pouvez aussi
          agir autrement. Les différents leviers d’actions sont les suivants :{' '}
        </p>
      </div>
      <TipsGrid />
    </Section>
  );
};

export default HowToBeInclusive;
