import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR, Section } from '../utils';
import { NumberCard } from '../cards';

const NumberPartial = ({ numbers }) => (
  <Section style="default">
    <div className="uk-text-center">
      <h3 className="uk-h6 uk-text-uppercase uk-margin-remove-bottom">
        Les chiffres
      </h3>
      <h2 className="uk-margin-remove-top uk-text-bold">
        Un programme <span className="uk-text-primary">efficace</span>
      </h2>
    </div>
    <div className="uk-margin-large-top">
      <GridNoSSR
        childWidths={['1-1', '1-3@m']}
        items={numbers.map((content) => (
          <div className="  uk-flex uk-flex-center uk-flex-center">
            <NumberCard
              value={content.value}
              description={content.description}
            />
          </div>
        ))}
      />
    </div>
  </Section>
);
NumberPartial.propTypes = {
  numbers: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      description: PropTypes.string,
    })
  ).isRequired,
};
export default NumberPartial;
