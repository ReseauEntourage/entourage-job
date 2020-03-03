import React, { useState, useEffect } from 'react';
import { GridNoSSR, Section, IconNoSSR } from '../utils';
import { CandidatCard } from '../cards';
import Api from '../../Axios';

const DiscoverPartial = () => {
  const [cvs, setCVs] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    Api.get('/api/v1/cv/cards/random?nb=2')
      .then(({ data }) => setCVs(data))
      .catch((err) => {
        console.error(err);
        setError('Impossible de récupérer les CVs.');
      });
  }, []);

  const Content = () => {
    if (error) return <p className="uk-text-italic">{error}</p>;
    if (cvs === undefined) return <div data-uk-spinner />;
    return (
      <GridNoSSR
        childWidths={['1-2@s']}
        items={cvs.map((cv) => (
          <CandidatCard
            url={cv.user && cv.user.url}
            imgSrc={
              (cv.urlImg && process.env.AWSS3_URL + cv.urlImg) || undefined
            }
            imgAlt={cv.user && cv.user.firstName}
            firstName={cv.user && cv.user.firstName}
            ambitions={cv.ambitions}
            skills={cv.skills}
            catchphrase={cv.catchphrase}
            employed={cv.user.employed}
          />
        ))}
      />
    );
  };
  return (
    <Section id="discover">
      <div className="uk-text-center">
        <h2 className="uk-text-bold">
          Découvrez les <span className="uk-text-primary">candidats</span>
        </h2>
        <a href="#">
          Voir tous les candidats <IconNoSSR name="arrow-right" />
        </a>
      </div>
      <div className="uk-text-center uk-margin-large-top">
        <Content />
      </div>
    </Section>
  );
};
export default DiscoverPartial;
