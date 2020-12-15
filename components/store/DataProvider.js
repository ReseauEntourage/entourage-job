import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const DataContext = createContext({});

const DataProvider = ({ children }) => {
  const [data, setData] = useState(true);

  const storeData = (key, value, storeInStorage) => {
    if (storeInStorage) localStorage.setItem(key, JSON.stringify(value));
    setData({
      ...data,
      [key]: value,
    });
  };

  const getData = (key) => {
    if (data[key]) {
      return data[key];
    }
    let item = localStorage.getItem(key);
    if (item) {
      item = JSON.parse(item);
      setData({
        ...data,
        [key]: item,
      });
    }

    return item;
  };

  return (
    <DataContext.Provider value={{ storeData, getData }}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
export default DataProvider;
