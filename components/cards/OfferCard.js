import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR, Button, IconNoSSR } from '../utils';

const OfferCard = ({
  title,
  from,
  shortDescription,
  type,
  isStared,
  isNew,
  isArchive,
}) => (
  <div
    className={`uk-card uk-card-hover uk-card-${
      isArchive ? 'secondary' : 'default'
    } uk-card-body ent-offer`}
  >
    {isNew ? <div className="ent-offer-badge" /> : undefined}

    <GridNoSSR
      gap="medium"
      childWidths={['1-1']}
      items={[
        <GridNoSSR
          eachWidths={['expand', 'auto']}
          items={[
            <h5 className="uk-text-bold">{title}</h5>,
            <IconNoSSR
              name="star"
              className={`${isStared ? 'ent-color-amber' : undefined}`}
            />,
          ]}
        />,
        <GridNoSSR
          gap="small"
          eachWidths={['auto', 'expand']}
          items={[<IconNoSSR name="user" />, <p>{from}</p>]}
        />,
        <GridNoSSR
          gap="small"
          eachWidths={['auto', 'expand']}
          items={[<IconNoSSR name="hashtag" />, <p>{shortDescription}</p>]}
        />,
        <GridNoSSR
          gap="small"
          between
          items={[
            <Button disabled>
              <span style={{ color: '#666' }}>{type}</span>
            </Button>,
            <u className="uk-link-muted">voir l&rsquo;offre</u>,
          ]}
        />,
      ]}
    />
  </div>
);
OfferCard.propTypes = {
  title: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  shortDescription: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  isStared: PropTypes.bool,
  isNew: PropTypes.bool,
  isArchive: PropTypes.bool,
};

OfferCard.defaultProps = {
  isStared: true,
  isNew: true,
  isArchive: false,
};
export default OfferCard;
