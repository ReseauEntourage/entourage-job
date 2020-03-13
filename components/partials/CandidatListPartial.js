import React, { useState, useEffect } from 'react';
import { GridNoSSR, Section } from '../utils';
import { CandidatCard } from '../cards';
import axios from '../../Axios';

const CandidatListPartial = () => {
  const [cvs, setCVs] = useState(undefined);
  const [error, setError] = useState(undefined);
  const nb = 11;

  useEffect(() => {
    axios
      .get(`/api/v1/cv/cards/random?nb=${nb}`)
      .then(({ data }) => setCVs(data))
      .catch((err) => {
        console.error(err);
        setError('Impossible de récupérer les CVs.');
      });
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
                url={cv.user.url}
                imgSrc={
                  (cv.urlImg && process.env.AWSS3_URL + cv.urlImg) || undefined
                }
                imgAlt={cv.user.candidat.firstName}
                firstName={cv.user.candidat.firstName}
                ambitions={cv.ambitions}
                skills={cv.skills}
                catchphrase={cv.catchphrase}
                employed={cv.user.employed}
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
          <h2 className="uk-text-bold uk-margin-remove-bottom">
            Ils sont <span className="uk-text-primary">motivés</span> pour
            travailler
          </h2>
          <h3 className="uk-text-bold uk-margin-remove-top">
            Votre partage peut tout{' '}
            <span className="uk-text-primary">changer</span>
          </h3>
          <p>
            Eux ont du talent. Vous, vous avez du réseau.
            <br />
            Si vous pensez comme nous que l&apos;exclusion ne doit pas être un
            frein, partagez votre réseau professionnel à ceux qui en ont le plus
            besoin.
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
            Voir tous les candidats &gt;
          </button>
          <p style={{ marginTop: '20px' }}>
            Tous ces candidats cherchent un travail en Île de France, si vous
            êtes sur un autre territoire, contactez-nous à
            contact-linkedout@entourage.social
          </p>
        </GridNoSSR>
      </GridNoSSR>
    </Section>
  );
};

export default CandidatListPartial;
