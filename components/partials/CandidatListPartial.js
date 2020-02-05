import React, { useState, useEffect } from 'react';
import { GridNoSSR, Section } from '../utils';
import { CandidatCard } from '../cards';
import Api from '../../Axios';

const CandidatListPartial = () => {
  const [cvs, setCVs] = useState(undefined);
  const [error, setError] = useState(undefined);
  const nb = 11;

  useEffect(() => {
    const req = Api.get(`/api/v1/cv/cards/random?nb=${nb}`)
      .then(({ data }) => setCVs(data))
      .catch((err) => {
        console.error(err);
        setError('Impossible de récupérer les CVs.');
      });
    console.log(req);
  }, [nb]);

  const Content = () => {
    if (cvs) {
      return (
        <div uk-scrollspy="cls:uk-animation-slide-bottom-small; target: .uk-card; delay: 50">
          <GridNoSSR
            childWidths={['1-1', '1-2@s', '1-3@m']}
            gap="small"
            items={cvs.map((cv) => (
              <CandidatCard
                url={cv.url}
                imgSrc="static/img/arthur.png"
                imgAlt={cv.user.firstName}
                firstName={cv.user.firstName}
                ambitions={cv.ambitions}
                skills={cv.skills}
                catchphrase={cv.catchphrase}
              />
            ))}
          />
        </div>
      );
    }
    if (error) {
      return <p className="uk-text-center uk-text-italic">{error}</p>;
    }
    return (
      <div className="uk-text-center">
        <div data-uk-spinner />
      </div>
    );
  };

  return (
    <Section style="muted" container="" id="candidat">
      <GridNoSSR gap="large" column middle eachWidths={['2-3@s', '1-1']}>
        <div className="uk-text-center">
          <h2 className="uk-text-bold">
            Ils viennent de{' '}
            <span className="uk-text-primary">s&apos;inscrire</span>
          </h2>
          <p>
            Ils sont disponibles pour travailler. Découvrez leurs profils,
            partagez ou contactez-les.
          </p>
        </div>
        <Content />
        <GridNoSSR middle column gap="collapse">
          <button
            type="button"
            className="uk-button uk-button-primary"
            style={{
              color: 'white',
              backgroundColor: '#F55F24',
              backgroundImage: 'none',
              textTransform: 'none',
              boder: null,
              padding: '0px 20px',
              borderRadius: '2px',
            }}
          >
            Voir les candidats &gt;
          </button>
          <p style={{ marginTop: '20px' }}>
            En 2020, le projet est expérimenté à Paris et en Seine-Saint-Denis.
          </p>
        </GridNoSSR>
      </GridNoSSR>
    </Section>
  );
};

export default CandidatListPartial;
