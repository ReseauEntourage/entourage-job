import React, { useState, useEffect } from 'react';
import { GridNoSSR, Section } from '../utils';
import { CandidatCard } from '../cards';
import Api from '../../Axios';

const CandidatListPartial = () => {
  const [cvs, setCVs] = useState(undefined);
  const nb = 11;

  useEffect(() => {
    console.log(Api);

    const req = Api.get(`/api/v1/cv/cards/random?nb=${nb}`)
      .then((res) => {
        setCVs(res.data);
      })
      .catch(() => console.error('Impossible de récupérer les CVs.'));
    console.log(req);
  }, [nb]);

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
        {cvs === undefined ? (
          <div className="uk-text-center">
            <div data-uk-spinner />
          </div>
        ) : (
          <div uk-scrollspy="cls:uk-animation-slide-bottom-small; target: .uk-card; delay: 50">
            <GridNoSSR
              childWidths={['1-1', '1-2@s', '1-3@m']}
              gap="small"
              items={cvs
                .filter((cv) => cv.user)
                .map((cv) => (
                  <CandidatCard
                    url={cv.url}
                    imgSrc="static/img/arthur.png"
                    imgAlt={cv.user.firstName}
                    firstName={cv.user.firstName}
                    ambitions={cv.ambitions.slice(0, 2)}
                  />
                ))}
            />
          </div>
        )}
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
      </GridNoSSR>
    </Section>
  );
};

export default CandidatListPartial;
