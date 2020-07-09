import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR, Section, IconNoSSR } from '../utils';
import { CandidatCard } from '../cards';
import SimpleLink from '../utils/SimpleLink';
import Api from '../../Axios';

const DiscoverPartial = ({style}) => {
  const [cvs, setCVs] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    Api.get('/api/v1/cv/cards/random?nb=3')
      .then(({ data }) => setCVs(data))
      .catch((err) => {
        console.error(err);
        setError('Impossible de récupérer les CVs.');
      });
  }, []);

  const Content = () => {
    if (error) return <p className="uk-text-italic">{error}</p>;
    if (cvs === undefined) return <div data-uk-spinner="" />;
    return (
      <GridNoSSR
        childWidths={['1-3@m']}
        items={cvs.map((cv) => (
          <CandidatCard
            url={cv.user && cv.user.url}
            imgSrc={
              (cv.urlImg && process.env.AWSS3_URL + cv.urlImg) || undefined
            }
            imgAlt={cv.user && cv.user.candidat.firstName}
            firstName={cv.user && cv.user.candidat.firstName}
            gender={cv.user && cv.user.candidat.gender}
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
    <Section id="discover" style={style}>
      <div className="uk-text-center">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
          Découvrez les <span className="uk-text-primary">candidats</span>
        </h2>
        <SimpleLink href="/lescandidats">
          Voir tous les candidats <IconNoSSR name="arrow-right" />
        </SimpleLink>
      </div>
      <div className="uk-text-center uk-margin-large-top">
        <Content />
      </div>
    </Section>
  );
};

DiscoverPartial.propTypes = {
  style: PropTypes.string
};

DiscoverPartial.defaultProps = {
  style: 'default'
};

export default DiscoverPartial;
