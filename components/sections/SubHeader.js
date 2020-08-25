import React from 'react';
import PropTypes from 'prop-types';
import {Section} from '../utils';
import Grid from "../utils/Grid";

const SubHeader = ({id, style, data}) => {
  return (
    <Section id={id} style={style}>
      <Grid
        childWidths={[`1-${data.length}@m`]}
        match
        middle
        center
        gap="small">
        {data.map((item, index) =>
          <h3 key={index} className="uk-text-center uk-padding-small uk-margin-remove-vertical">
            <a
              key={index.toString()}
              className="uk-link-heading"
              href={item.href}
              data-uk-scroll>
              {item.label}
            </a>
          </h3>
        )}
      </Grid>
    </Section>
  );
};

SubHeader.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  })).isRequired
};

SubHeader.defaultProps = {
  style: 'default'
};

export default SubHeader;
