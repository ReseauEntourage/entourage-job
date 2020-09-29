import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../store/UserProvider';
import { ImgNoSSR } from '../utils';
import {USER_ROLES} from '../../constants';

const ImgProfile = ({ user, size }) => {
  const { firstName, role, candidat } = user || useContext(UserContext).user;
  const [urlImg, setUrlImg] = useState(null);

  useEffect(() => {
    if (role === USER_ROLES.CANDIDAT && candidat && candidat.cvs) {
      const latestCV = candidat.cvs.reduce((acc, curr) => {
        return acc.version < curr.version ? curr : acc;
      }, {version: -1});
      setUrlImg(latestCV.urlImg);
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
          style={{ fontSize: size / 2, color: '#fff' }}
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
    candidat: PropTypes.shape({
      cvs: PropTypes.arrayOf(PropTypes.shape({
        version: PropTypes.number,
        urlImg: PropTypes.string
      }))
    })
  }),
  size: PropTypes.number,
};
ImgProfile.defaultProps = {
  user: null,
  size: 40,
};

export default ImgProfile;
