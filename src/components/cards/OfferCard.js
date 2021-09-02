import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Grid, Icon } from 'src/components/utils';
import { findOfferStatus } from 'src/utils';

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
  department,
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
      <Grid
        gap="medium"
        childWidths={['1-1']}
        className="uk-height-max-large uk-overflow-auto"
      >
        <Grid eachWidths={['expand', 'auto']}>
          <h5 className="uk-text-bold">{title}</h5>
          {isStared === undefined ? (
            <></>
          ) : (
            <Icon
              name="star"
              className={`${isStared ? 'ent-color-amber' : undefined}`}
            />
          )}
        </Grid>
        <Grid gap="small" middle eachWidths={['auto', 'expand']}>
          <Icon name="user" />
          <p>{from}</p>
        </Grid>
        {department && (
          <Grid gap="small" middle eachWidths={['auto', 'expand']}>
            <Icon name="location" />
            <p>{department}</p>
          </Grid>
        )}
        <Grid gap="small" middle eachWidths={['auto', 'expand']}>
          <Icon name="world" />
          <p>{shortDescription}</p>
        </Grid>
        <Grid gap="small" middle eachWidths={['auto', 'expand']}>
          <Icon name="info" />
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
                            key={userOpp.OpportunityId + userOpp.UserId}
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
        </Grid>
        {date && (
          <Grid gap="small" middle eachWidths={['auto', 'expand']}>
            <Icon name="calendar" />
            <p>{moment(date).format('DD/MM/YYYY')}</p>
          </Grid>
        )}
      </Grid>
      <div className="uk-flex uk-flex-between uk-flex-bottom uk-margin-medium-top">
        {isAdmin && (
          <div className="uk-flex-1 uk-text-left uk-text-meta uk-text-success uk-flex uk-flex-bottom">
            {!archived &&
              (isValidated ? (
                <div className="uk-flex uk-flex-middle">
                  Publiée&nbsp;
                  <Icon name="check" />
                </div>
              ) : (
                <div className="uk-flex uk-flex-middle uk-text-warning">
                  À valider
                </div>
              ))}
          </div>
        )}
        <u className="uk-link-muted uk-flex-1 uk-text-right">
          Voir l&rsquo;offre
        </u>
      </div>
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
  department: PropTypes.string,
};

OfferCard.defaultProps = {
  isStared: undefined,
  isNew: undefined,
  archived: undefined,
  isPublic: undefined,
  date: undefined,
  userOpportunity: undefined,
  isAdmin: false,
  department: undefined,
};
export default OfferCard;
