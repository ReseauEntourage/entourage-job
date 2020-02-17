import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR, Button, IconNoSSR } from '../utils';

function translateStatus(status) {
  if (status === 0) return 'Contacté';
  if (status === 1) return "Phase d'entretien";
  if (status === 2) return 'Embauche';
  if (status === 3) return 'Refus';
  if (status === 4) return 'En attente';
  if (status === 5) return 'Relance';
  return 'Non défini';
}

const OfferCard = ({
  title,
  from,
  shortDescription,
  status,
  isStared,
  isNew,
  archived,
}) => (
  <div
    className={`ent-offer uk-card uk-card-hover uk-card-body uk-card-${
      archived ? 'secondary' : 'default'
    }`}
  >
    {isNew && <div className="ent-offer-badge" />}
    <GridNoSSR
      gap="medium"
      childWidths={['1-1']}
      items={[
        <GridNoSSR
          eachWidths={['expand', 'auto']}
          items={[
            <h5 className="uk-text-bold">{title}</h5>,
            isStared === undefined ? (
              <></>
            ) : (
              <IconNoSSR
                name="star"
                className={`${isStared ? 'ent-color-amber' : undefined}`}
              />
            ),
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
            status === undefined ? (
              <></>
            ) : (
              <Button disabled>
                <span style={{ color: '#666' }}>{translateStatus(status)}</span>
              </Button>
            ),
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
  status: PropTypes.string,
  isStared: PropTypes.bool,
  isNew: PropTypes.bool,
  archived: PropTypes.bool,
};

OfferCard.defaultProps = {
  isStared: undefined,
  isNew: undefined,
  archived: undefined,
  status: undefined,
};
export default OfferCard;
