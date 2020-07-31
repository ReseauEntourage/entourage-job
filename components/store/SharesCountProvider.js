// store/SharesCount.js
import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Api from '../../Axios';
import {VALUES} from '../../constants';

export const SharesCountContext = createContext({totalShares: 0});

const SharesCountProvider = ({ children }) => {
  const [totalShares, setTotalShares] = useState(0);

  const incrementSharesCount = () => {
    setTotalShares(totalShares + 1);
  };

  useEffect(() => {
    Api.get('api/v1/cv/shares').then(({data}) => {
      setTotalShares(data.total);
    }).catch((e) => {
      console.log(e);
      setTotalShares(VALUES.SHARES);
    })
  }, []);

  return (
    <SharesCountContext.Provider
      value={{ totalShares, incrementSharesCount }}
    >
      {children}
    </SharesCountContext.Provider>
  );
};

SharesCountProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
export default SharesCountProvider;
