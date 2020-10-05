import React from 'react';
import { Section } from '../utils';
import Grid from '../utils/Grid';

const tips = [
  {
    title: (
      <div>
        Recruter
        <br />
        inclusif
      </div>
    ),
  },
  {
    title: (
      <div>
        Acheter
        <br />
        inclusif
      </div>
    ),
  },
  {
    title: "Soutenir les acteurs qui agissent pour l'inclusion",
    text:
      "Par du don financier, de la mise à disposition de moyens ou du mécénat de compétences, vous pouvez soutenir des projets comme LinkedOut ou d'autres qui accompagnent des personnes fragiles.",
  },
  { title: 'Sensibiliser et engager mes collaborateurs' },
];

const TipsGrid = () => {
  return (
    <div>
      <Grid
        childWidths={[`1-${tips.length}@m`]}
        match
        className="uk-margin-top"
        gap="large"
        items={tips.map((item, index) => (
          <div key={index.toString()}>
            <h4
              className="uk-text-bold"
              style={{ paddingLeft: '0.7rem', borderLeft: '2px solid #F55F24' }}
            >
              {item.title}
            </h4>
            {item.text && <div className="uk-text-small">{item.text}</div>}
          </div>
        ))}
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
