/* global UIkit */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'src/components/utils';
import { event } from 'src/lib/gtag';
import TAGS from 'src/constants/tags';
import { IconNoSSR } from 'src/components/utils/Icon';

const FiltersMobile = ({ filters }) => {
  const [filterMenuOpened, setFilterMenuOpened] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);

  const onFilterMenuToggle = (opened) => {
    if (opened) event(TAGS.PAGE_GALERIE_AFFICHER_FILTRES_CLIC);
    setFilterMenuOpened(opened);
  };

  useEffect(() => {
    const modalInterval = setInterval(() => {
      if (UIkit) {
        clearInterval(modalInterval);
        UIkit.util.on(document, 'show', '#toggle-filter-menu', () => {
          return onFilterMenuToggle(true);
        });
        UIkit.util.on(document, 'hide', '#toggle-filter-menu', () => {
          return onFilterMenuToggle(false);
        });
      }
    }, 1000);

    return () => {
      clearInterval(modalInterval);
    };
  }, []);

  useEffect(() => {
    setNumberOfFilters(
      Object.values(filters).reduce((acc, curr) => {
        return acc + curr.length;
      }, 0)
    );
  }, [filters]);

  return (
    <div className="uk-flex uk-flex-middle uk-flex-center uk-hidden@m">
      <Button
        className="ent-filter-button-search"
        toggle="target: #toggle-filter-menu;"
      >
        <div className="uk-position-relative">
          <IconNoSSR
            style={{ width: 18, height: 18 }}
            name={`filter${filterMenuOpened ? '' : '-empty'}`}
          />
          {numberOfFilters > 0 && (
            <div className="ent-filter-badge-search">{numberOfFilters}</div>
          )}
        </div>
      </Button>
    </div>
  );
};

FiltersMobile.propTypes = {
  filters: PropTypes.shape().isRequired,
};

export default FiltersMobile;
