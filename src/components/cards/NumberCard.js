import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'src/components/utils';

// todo: les cartes sont un petit peu decallés à cause du jeu expand auto
// recentrer les cartes
const NumberCard = ({ value, description, subDescription }) => {
  return (
    <div className="uk-card uk-width-1-1 uk-card-body uk-card-small uk-flex uk-flex-center uk-flex-middle">
      <Grid middle center gap="collapse" eachWidths={['1-3', '1-6', '1-2']}>
        <div className="uk-text-right uk-text-primary">
          {value.toString().length > 6 ? (
            <span className="uk-text-primary uk-text-right">{value}</span>
          ) : (
            <span className="uk-h1 uk-text-primary uk-text-nowrap">
              {value}
            </span>
          )}
        </div>
        <hr
          className="uk-divider-vertical"
          style={{ borderLeftColor: '#F55F24', height: '80px' }}
        />
        <div className="">
          <p className="uk-text-uppercase uk-text-bold uk-margin-remove">
            {description}
          </p>
          {subDescription && (
            <p className="uk-text-meta uk-text-small uk-text-italic uk-text-right uk-margin-remove">
              {subDescription}
            </p>
          )}
        </div>
      </Grid>
    </div>
  );
};
NumberCard.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  description: PropTypes.string.isRequired,
  subDescription: PropTypes.string,
};

NumberCard.defaultProps = {
  subDescription: undefined,
};
export default NumberCard;
