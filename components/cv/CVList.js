import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from '../utils';
import { CandidatCard } from '../cards';
import axios from '../../Axios';

const CVList = ({ nb, search }) => {
  const [cvs, setCVs] = useState(undefined);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    setCVs(undefined);
    setError(undefined);
    axios
      .get(`/api/v1/cv/cards/random`, {
        params: {
          q: search,
          nb,
        },
      })
      .then(({ data }) => setCVs(data))
      .catch((err) => {
        console.error(err);
        setError('Impossible de récupérer les CVs.');
      });
  }, [nb, search]);

  if (error) {
    return <p className="uk-text-center uk-text-italic">{error}</p>;
  }

  if (cvs) {
    if (cvs.length <= 0) {
      return (
        <p className="uk-text-center uk-text-italic">Aucuns CVs trouvés</p>
      );
    }
    return (
      <div uk-scrollspy="cls:uk-animation-slide-bottom-small; target: .uk-card; delay: 50">
        <GridNoSSR
          childWidths={['1-1', '1-2@s', '1-3@m']}
          gap="small"
          row
          center
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

  return (
    <div className="uk-text-center">
      <div data-uk-spinner />
    </div>
  );
};
CVList.propTypes = {
  nb: PropTypes.number,
  search: PropTypes.string,
};

CVList.defaultProps = {
  nb: undefined,
  search: undefined,
};
export default CVList;
