/* global UIkit */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, GridNoSSR, IconNoSSR } from '../utils';
import ButtonIcon from '../utils/ButtonIcon';
import { event } from '../../lib/gtag';
import TAGS from '../../constants/tags';

const CurrentFilters = ({ numberOfResults, filters, resetFilters }) => {
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
        UIkit.util.on(document, 'show', '#toggle-filter-menu', () =>
          onFilterMenuToggle(true)
        );
        UIkit.util.on(document, 'hide', '#toggle-filter-menu', () =>
          onFilterMenuToggle(false)
        );
      }
    }, 1000);

    return () => {
      clearInterval(modalInterval);
      UIkit.util.off(document, 'show', '#toggle-filter-menu', () =>
        onFilterMenuToggle(true)
      );
      UIkit.util.off(document, 'hide', '#toggle-filter-menu', () =>
        onFilterMenuToggle(false)
      );
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
    <GridNoSSR middle gap="small" eachWidths={['1-4@m', '3-4@m']}>
      <div
        className="uk-flex uk-flex-middle uk-flex-left"
        style={{
          paddingTop: 5,
          paddingBottom: 5,
        }}
      >
        <Button
          style="text"
          className="uk-margin-small-right"
          toggle="target: #toggle-filter-menu;"
        >
          Filtrer par &nbsp;
          <IconNoSSR
            style={{ width: 15, height: 15 }}
            name={`filter${filterMenuOpened ? '' : '-empty'}`}
          />
        </Button>
        {numberOfFilters > 0 && (
          <div className="uk-text-meta uk-margin-small-left uk-text-italic">
            {numberOfResults}
            &nbsp;résultat
            {numberOfResults !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      {numberOfFilters > 0 && (
        <div className="uk-flex uk-flex-middle uk-flex-right">
          <div className="uk-flex uk-flex-right uk-flex-wrap uk-flex-1">
            {Object.values(filters)
              .reduce((acc, curr) => {
                return acc.concat(curr);
              }, [])
              .map((filter, index) => (
                <div
                  key={filter.label + index}
                  className="uk-flex uk-flex-center uk-flex-middle"
                  style={{
                    paddingRight: 5,
                    paddingTop: 5,
                    paddingBottom: 5,
                  }}
                >
                  <span className="uk-badge">{filter.label}</span>
                </div>
              ))}
          </div>
          <div className="uk-flex">
            {' '}
            &nbsp;
            <ButtonIcon ratio={0.9} name="close" onClick={resetFilters} />
          </div>
        </div>
      )}
    </GridNoSSR>
  );
};

CurrentFilters.propTypes = {
  numberOfResults: PropTypes.number.isRequired,
  filters: PropTypes.shape().isRequired,
  resetFilters: PropTypes.func.isRequired,
};

export default CurrentFilters;
