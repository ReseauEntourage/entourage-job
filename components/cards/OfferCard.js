import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR, Button, IconNoSSR } from '../utils';

const OfferCard = ({
  title,
  from,
  shortDescription,
  type,
  link,
  isStared,
  isNew,
}) => (
  <a className="uk-link-reset" href={link}>
    <div className="uk-card uk-card-hover uk-card-default uk-card-body ent-offer">
      {isNew ? <div className="ent-offer-badge" /> : undefined}
      <GridNoSSR
        eachWidths={['expand', 'auto']}
        items={[
          <h5 className="uk-text-bold">{title}</h5>,
          <IconNoSSR
            name="star"
            className={`${isStared ? 'ent-color-amber' : undefined}`}
          />,
        ]}
      />
      <GridNoSSR
        className="uk-margin-large-top uk-margin-large-bottom"
        gap="small"
        items={[
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
        ]}
      />
      <GridNoSSR
        gap="small"
        between
        items={[
          <Button disabled>{type}</Button>,
          <a className="uk-link-muted" href="">
            voir l&rsquo;offre
          </a>,
        ]}
      />
    </div>
  </a>
);
OfferCard.propTypes = {
  title: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  shortDescription: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  link: PropTypes.string,
  isStared: PropTypes.bool,
  isNew: PropTypes.bool,
};

OfferCard.defaultProps = {
  link: '#',
  isStared: true,
  isNew: true,
};
export default OfferCard;
