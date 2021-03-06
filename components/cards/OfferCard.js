import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { GridNoSSR, IconNoSSR } from '../utils';
import { findOfferStatus } from '../../utils';

const OfferCard = ({
  title,
  from,
  shortDescription,
  isStared,
  isNew,
  archived,
  isPublic,
  date,
  userOpportunity,
  isValidated,
  isAdmin,
}) => {
  const renderStatus = (userOpp) => {
    if (userOpp.status !== undefined) {
      return (
        <span
          className={`uk-text-meta uk-text-${
            findOfferStatus(userOpp.status).color
          }`}
        >
          {findOfferStatus(userOpp.status).label}
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className={`ent-offer uk-card uk-card-hover uk-card-body uk-card-${
        archived ? 'secondary' : 'default'
      }`}
    >
      {isNew && <div className="ent-offer-badge" />}
      <GridNoSSR
        gap="medium"
        childWidths={['1-1']}
        className="uk-height-max-large"
      >
        <GridNoSSR eachWidths={['expand', 'auto']}>
          <h5 className="uk-text-bold">{title}</h5>
          {isStared === undefined ? (
            <></>
          ) : (
            <IconNoSSR
              name="star"
              className={`${isStared ? 'ent-color-amber' : undefined}`}
            />
          )}
        </GridNoSSR>
        <GridNoSSR gap="small" middle eachWidths={['auto', 'expand']}>
          <IconNoSSR name="user" />
          <p>{from}</p>
        </GridNoSSR>
        <GridNoSSR gap="small" middle eachWidths={['auto', 'expand']}>
          <IconNoSSR name="world" />
          <p>{shortDescription}</p>
        </GridNoSSR>
        <GridNoSSR gap="small" middle eachWidths={['auto', 'expand']}>
          <IconNoSSR name="info" />
          <div>
            {isPublic ? (
              <div>
                <p className="uk-margin-remove-bottom">Offre générale</p>
                {userOpportunity &&
                  (Array.isArray(userOpportunity)
                    ? userOpportunity.length > 0 &&
                      isAdmin && (
                        <span className="uk-text-meta">
                          {userOpportunity.length}&nbsp;candidat
                          {userOpportunity.length !== 1 ? 's' : ''} sur
                          l&apos;offre
                        </span>
                      )
                    : renderStatus(userOpportunity))}
              </div>
            ) : (
              <div>
                <p className="uk-margin-remove-bottom">Offre privée</p>
                {userOpportunity &&
                  (Array.isArray(userOpportunity)
                    ? userOpportunity.length > 0 &&
                      userOpportunity.map((userOpp) => {
                        return (
                          <div
                            className="uk-flex uk-flex-column"
                            style={{ marginTop: 5 }}
                          >
                            <span className="uk-text-meta uk-text-secondary">
                              {userOpp.User.firstName} {userOpp.User.lastName}
                            </span>
                            {renderStatus(userOpp)}
                          </div>
                        );
                      })
                    : renderStatus(userOpportunity))}
              </div>
            )}
          </div>
        </GridNoSSR>
        {date && (
          <GridNoSSR gap="small" middle eachWidths={['auto', 'expand']}>
            <IconNoSSR name="calendar" />
            <p>{moment(date).format('DD/MM/YYYY')}</p>
          </GridNoSSR>
        )}
        <div className="uk-flex uk-flex-between uk-flex-bottom uk-margin-small-top">
          {isAdmin && (
            <div className="uk-flex-1 uk-text-left uk-text-meta uk-text-success uk-flex uk-flex-bottom">
              {!archived &&
                (isValidated ? (
                  <div className="uk-flex uk-flex-middle">
                    Validé&nbsp;
                    <IconNoSSR name="check" />
                  </div>
                ) : (
                  <div className="uk-flex uk-flex-middle uk-text-warning">
                    En attente
                  </div>
                ))}
            </div>
          )}
          <u className="uk-link-muted uk-flex-1 uk-text-right">
            Voir l&rsquo;offre
          </u>
        </div>
      </GridNoSSR>
    </div>
  );
};

OfferCard.propTypes = {
  title: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  shortDescription: PropTypes.string.isRequired,
  isStared: PropTypes.bool,
  isNew: PropTypes.bool,
  archived: PropTypes.bool,
  isPublic: PropTypes.bool,
  date: PropTypes.string,
  userOpportunity: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.arrayOf(PropTypes.shape()),
  ]),
  isValidated: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool,
};

OfferCard.defaultProps = {
  isStared: undefined,
  isNew: undefined,
  archived: undefined,
  isPublic: undefined,
  date: undefined,
  userOpportunity: undefined,
  isAdmin: false,
};
export default OfferCard;
