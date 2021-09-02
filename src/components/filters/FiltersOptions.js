import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonIcon from 'src/components/utils/ButtonIcon';

const FiltersOptions = ({ numberOfResults, filters, search, resetFilters }) => {
  const [numberOfFilters, setNumberOfFilters] = useState(0);

  useEffect(() => {
    setNumberOfFilters(
      Object.values(filters).reduce((acc, curr) => {
        return acc + curr.length;
      }, 0)
    );
  }, [filters]);

  const hasFilters = numberOfFilters > 0 || search;

  return (
    <div className="uk-flex uk-flex-middle uk-flex-right uk-flex-1">
      {hasFilters && (
        <div className="uk-text-meta uk-margin-small-right uk-text-italic">
          {numberOfResults}
          &nbsp;résultat
          {numberOfResults !== 1 ? 's' : ''}
        </div>
      )}
      {hasFilters && (
        <div className="uk-flex uk-flex-middle uk-flex-right">
          <div className="uk-flex uk-flex-right uk-flex-wrap uk-flex-1">
            <div className="uk-flex">
              {' '}
              &nbsp;
              <ButtonIcon ratio={0.9} name="close" onClick={resetFilters} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

FiltersOptions.propTypes = {
  numberOfResults: PropTypes.number.isRequired,
  filters: PropTypes.shape().isRequired,
  search: PropTypes.string,
  resetFilters: PropTypes.func.isRequired,
};

FiltersOptions.defaultProps = {
  search: undefined,
};

export default FiltersOptions;
