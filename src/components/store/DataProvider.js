import React, { createContext, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

export const DataContext = createContext({});

const DataProvider = ({ children }) => {
  const [data, setData] = useState(true);

  const storeData = useCallback((key, value, storeInStorage) => {
    if (storeInStorage) localStorage.setItem(key, JSON.stringify(value));
    setData((prevData) => {
      return {
        ...prevData,
        [key]: value,
      };
    });
  }, []);

  const getData = useCallback(
    (key) => {
      if (data[key]) {
        return data[key];
      }
      let item = localStorage.getItem(key);
      if (item) {
        item = JSON.parse(item);
        setData((prevData) => {
          return {
            ...prevData,
            [key]: item,
          };
        });
      }

      return item;
    },
    [data]
  );

  const value = useMemo(() => {
    return { storeData, getData };
  }, [getData, storeData]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

DataProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
export default DataProvider;
