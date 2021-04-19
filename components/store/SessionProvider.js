import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const SessionContext = createContext({ isFirstLoad: true });

const SessionProvider = ({ children }) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  return (
    <SessionContext.Provider value={{ isFirstLoad, setIsFirstLoad }}>
      {children}
    </SessionContext.Provider>
  );
};

SessionProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
export default SessionProvider;
