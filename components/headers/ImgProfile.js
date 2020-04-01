import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../store/UserProvider';
import Api from '../../Axios';

const ImgProfile = ({ user, size }) => {
  console.log(user);
  const userToCheck = user || useContext(UserContext).user;
  const [urlImg, setUrlImg] = useState(null);

  useEffect(() => {
    Api.get(`/api/v1/cv/?userId=${userToCheck.id}`)
      .then(({ data }) => {
        if (data && data.urlImg) {
          setUrlImg(data.urlImg);
        }
      })
      .catch();
  }, [user]);
  return urlImg ? (
    <div
      className="uk-border-circle"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: `url(${process.env.AWSS3_URL + urlImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  ) : (
    <div
      className="uk-background-primary uk-border-circle uk-text-large uk-text-normal uk-text-uppercase uk-text-center"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        color: 'white',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -52%)',
          fontSize: size / 2,
        }}
      >
        {userToCheck.firstName.substr(0, 1)}
      </div>
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
