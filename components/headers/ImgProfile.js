import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../store/UserProvider';
import Api from '../../Axios';
import { ImgNoSSR } from '../utils';

const ImgProfile = ({ user, size }) => {
  const { id, firstName, role } = user || useContext(UserContext).user;
  const [urlImg, setUrlImg] = useState(null);

  useEffect(() => {
    if (role === 'Candidat') {
      // TODO creer un champs dans le user pour recupérer son image de profil
      // dans notre cas, seul un cv a une image (pas le coach/candidat/admin = USER)
      Api.get(`/api/v1/cv/?userId=${id}`)
        .then(({ data }) => {
          if (data && data.urlImg) {
            setUrlImg(data.urlImg);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  return (
    <div
      className="uk-background-primary uk-border-circle uk-position-relative"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        overflow: 'hidden',
      }}
    >
      {urlImg ? (
        <div
          className="uk-height-1-1 uk-position-center uk-width-expand"
          style={{ maxWidth: 'inherit' }}
        >
          <ImgNoSSR
            className="uk-height-1-1"
            src={process.env.AWSS3_URL + urlImg}
            alt={`photo de ${firstName}`}
          />
        </div>
      ) : (
        <span
          className="uk-text-normal uk-text-uppercase uk-position-center"
          style={{ fontSize: size / 2, paddingBottom: size / 8, color: '#fff' }}
        >
          {firstName.substr(0, 1)}
        </span>
      )}
    </div>
  );
};

ImgProfile.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
  }),
  size: PropTypes.number,
};
ImgProfile.defaultProps = {
  user: null,
  size: 40,
};

export default ImgProfile;
