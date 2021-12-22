import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Section } from 'src/components/utils';
import { CandidatCard } from 'src/components/cards';
import Api from 'src/Axios';
import Button from 'src/components/utils/Button';
import { IconNoSSR } from 'src/components/utils/Icon';

const DiscoverPartial = ({ style }) => {
  const [cvs, setCVs] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    Api.get('/api/v1/cv/cards/random?nb=3')
      .then(({ data }) => {
        return setCVs(data.cvs);
      })
      .catch((err) => {
        console.error(err);
        setError('Impossible de récupérer les CVs.');
      });
  }, []);

  const Content = useMemo(() => {
    if (error) return <p className="uk-text-italic">{error}</p>;
    if (cvs === undefined) return <div data-uk-spinner="" />;
    return (
      <Grid
        childWidths={['1-3@m']}
        gap="small"
        items={cvs.map((cv) => {
          return (
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
              endOfContract={cv.user.endOfContract}
              id={cv.user.candidat.id}
              locations={cv.locations}
            />
          );
        })}
      />
    );
  }, [cvs, error]);

  return (
    <Section id="discover" style={style}>
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
        Découvrez les <span className="uk-text-primary">candidats</span>
      </h2>
      <Content />
      <div className="uk-flex uk-flex-center">
        <Button
          style="primary"
          href={{ pathname: '/candidats', query: { employed: false } }}
          className="uk-margin-large-top"
        >
          Voir tous les candidats <IconNoSSR name="chevron-right" />
        </Button>
      </div>
    </Section>
  );
};

DiscoverPartial.propTypes = {
  style: PropTypes.string,
};

DiscoverPartial.defaultProps = {
  style: 'default',
};

export default DiscoverPartial;
