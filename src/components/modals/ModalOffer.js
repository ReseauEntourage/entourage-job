import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, SimpleLink } from 'src/components/utils';
import Textarea from 'src/components/forms/fields/Textarea';
import Select from 'src/components/forms/fields/Select';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import { IconNoSSR } from 'src/components/utils/Icon';

import Api from 'src/Axios';
import { OFFER_STATUS } from 'src/constants';
import { formatParagraph } from 'src/utils';
import ModalOfferInfo from 'src/components/modals/ModalOfferInfo';
import ModalGeneric from 'src/components/modals/ModalGeneric';

export const List = ({ className, children }) => {
  return (
    <ul className={`uk-nav ${className}`}>
      {Array.isArray(children)
        ? children.map((item, i) => {
            return <li key={i}>{item}</li>;
          })
        : children}
    </ul>
  );
};
List.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};
List.defaultProps = {
  className: undefined,
};

export const OfferInfoContainer = ({ icon, title, children }) => {
  if (!children) {
    children = [];
  } else if (!children.map) {
    children = [children];
  }

  return (
    <Grid gap="small" eachWidths={['auto', 'expand']}>
      {icon ? <IconNoSSR name={icon} /> : <div className="uk-margin-left" />}
      <div>
        {title ? <span className="uk-text-bold">{title}</span> : undefined}
        <Grid gap="collapse" childWidths={['1-1']}>
          {children}
        </Grid>
      </div>
    </Grid>
  );
};

OfferInfoContainer.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    ),
  ]),
};

OfferInfoContainer.defaultProps = {
  title: undefined,
  icon: undefined,
  children: [],
};

const ModalOffer = ({ currentOffer, onOfferUpdated, navigateBackToList }) => {
  const [loadingIcon, setLoadingIcon] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const [offer, setOffer] = useState(currentOffer);
  const { status, bookmarked, note, archived } = offer?.userOpportunity ?? {};
  const [noteBuffer, setNoteBuffer] = useState(note);

  const updateOpportunityUser = async (opportunityUser) => {
    const { data } = await Api.put(
      `${process.env.SERVER_URL}/api/v1/opportunity/join`,
      opportunityUser
    );
    setOffer((prevOffer) => {
      return {
        ...prevOffer,
        userOpportunity: data,
      };
    });
    await onOfferUpdated();
  };

  const resetNoteBuffer = () => {
    return setNoteBuffer(note);
  };

  useEffect(resetNoteBuffer, [offer, note]);

  if (!offer) {
    return null;
  }

  const mutatedOfferStatus = [
    {
      ...OFFER_STATUS[0],
      label: offer.isPublic ? OFFER_STATUS[0].alt : OFFER_STATUS[0].label,
    },
    ...OFFER_STATUS.slice(1),
  ];

  return (
    <ModalGeneric
      className={archived ? 'uk-light uk-background-secondary' : ''}
      onClose={(onClose) => {
        onClose();
        navigateBackToList();
      }}
    >
      <div>
        <Grid gap="small" between middle eachWidths={['expand', 'auto']}>
          <ModalOfferInfo
            startOfContract={offer.startOfContract}
            isPublic={offer.isPublic}
            numberOfPositions={offer.numberOfPositions}
            contract={offer.contract}
            date={offer.date}
            title={offer.title}
            isPartTime={offer.isPartTime}
            endOfContract={offer.endOfContract}
            offerId={offer.id}
          />
          <div>
            <Grid eachWidths={['expand', 'auto']} row middle>
              {loadingStatus && <div data-uk-spinner="" />}
              <Select
                id="modal-offer-status"
                title="Statut"
                name="status"
                placeholder="statut"
                options={mutatedOfferStatus}
                value={status}
                onChange={async (event) => {
                  setLoadingStatus(true);
                  const { userOpportunity } = offer;
                  await updateOpportunityUser({
                    ...userOpportunity,
                    status: Number(event.target.value),
                  });
                  setLoadingStatus(false);
                }}
              />
            </Grid>
            <List className="uk-iconnav uk-flex uk-flex-right uk-flex-middle">
              {loadingIcon && (
                <div className="uk-flex uk-flex-center uk-flex-middle">
                  <div data-uk-spinner="" />
                </div>
              )}
              <ButtonIcon
                name="archive"
                className={archived ? 'ent-color-amber' : undefined}
                onClick={async () => {
                  setLoadingIcon(true);
                  const { userOpportunity } = offer;
                  await updateOpportunityUser({
                    ...userOpportunity,
                    archived: !archived,
                  });
                  setLoadingIcon(false);
                }}
              />
              <ButtonIcon
                name="star"
                className={bookmarked ? 'ent-color-amber' : undefined}
                onClick={async () => {
                  setLoadingIcon(true);
                  const { userOpportunity } = offer;
                  await updateOpportunityUser({
                    ...userOpportunity,
                    bookmarked: !bookmarked,
                  });
                  setLoadingIcon(false);
                }}
              />
            </List>
          </div>
        </Grid>
        <hr />
        {offer.message && (
          <>
            <Grid>
              <OfferInfoContainer icon="commenting">
                <div>{formatParagraph(offer.message)}</div>
              </OfferInfoContainer>
            </Grid>
            <hr />
          </>
        )}
        <Grid
          className="uk-margin-bottom"
          eachWidths={['1-3@s', '2-3@s']}
          items={[
            <Grid column gap="medium">
              <OfferInfoContainer icon="home" title="Entreprise">
                {offer.company}
              </OfferInfoContainer>
              <OfferInfoContainer icon="user" title="Recruteur">
                <span>
                  {offer.recruiterFirstName} {offer.recruiterName}
                </span>
                <span className="uk-text-muted">{offer.recruiterPosition}</span>
                <SimpleLink
                  href={`mailto:${offer.recruiterMail}`}
                  className="uk-link-muted"
                  isExternal
                  newTab
                >
                  <span>{offer.recruiterMail}&nbsp;</span>
                  <IconNoSSR name="mail" ratio={0.8} />
                </SimpleLink>
              </OfferInfoContainer>
              <OfferInfoContainer icon="location" title={offer.department} />
            </Grid>,
            <Grid gap="medium" childWidths={['1-1']}>
              {offer.companyDescription && (
                <OfferInfoContainer
                  icon="comment"
                  title="Description de l'entreprise"
                >
                  <div>{formatParagraph(offer.companyDescription)}</div>
                </OfferInfoContainer>
              )}
              <OfferInfoContainer icon="comment" title="Description de l'offre">
                <div>{formatParagraph(offer.description)}</div>
              </OfferInfoContainer>
              <OfferInfoContainer icon="check" title="Compétences importantes">
                <div>{formatParagraph(offer.skills)}</div>
              </OfferInfoContainer>
              {offer.prerequisites && (
                <OfferInfoContainer icon="check" title="Pré-requis">
                  <div>{formatParagraph(offer.prerequisites)}</div>
                </OfferInfoContainer>
              )}
              {offer.businessLines && (
                <Grid gap="small">
                  {offer.businessLines.map((businessLine, index) => {
                    return (
                      <Button key={index} disabled>
                        <span style={{ color: '#666' }}>{businessLine}</span>
                      </Button>
                    );
                  })}
                </Grid>
              )}
            </Grid>,
          ]}
        />
        <div>
          <Textarea
            id="modal-offer-comment"
            name="modal-offer-comment"
            title="Ecrivez un commentaire à propos de cette opportunité..."
            type="text"
            value={noteBuffer}
            onChange={(e) => {
              return setNoteBuffer(e.target.value);
            }}
          />
          {noteBuffer === note || (note === null && noteBuffer === '') ? (
            <Button style="default" disabled>
              Enregistré
            </Button>
          ) : (
            <Button
              style="default"
              onClick={async () => {
                setLoading(true);
                console.log('update offer note', noteBuffer);
                const { userOpportunity } = offer;
                await updateOpportunityUser({
                  ...userOpportunity,
                  note: noteBuffer,
                });
                setLoading(false);
              }}
            >
              Enregistrer
              {loading ? (
                <div
                  data-uk-spinner="ratio: 0.5"
                  className="uk-margin-small-left"
                />
              ) : null}
            </Button>
          )}
        </div>
      </div>
    </ModalGeneric>
  );
};

ModalOffer.propTypes = {
  currentOffer: PropTypes.shape({
    id: PropTypes.string,
    message: PropTypes.string,
    title: PropTypes.string,
    company: PropTypes.string,
    description: PropTypes.string,
    companyDescription: PropTypes.string,
    numberOfPositions: PropTypes.number,
    prerequisites: PropTypes.string,
    skills: PropTypes.string,
    contract: PropTypes.string,
    endOfContract: PropTypes.string,
    startOfContract: PropTypes.string,
    isPartTime: PropTypes.bool,
    recruiterName: PropTypes.string,
    recruiterFirstName: PropTypes.string,
    recruiterPosition: PropTypes.string,
    isPublic: PropTypes.bool,
    recruiterMail: PropTypes.string,
    businessLines: PropTypes.arrayOf(PropTypes.string),
    date: PropTypes.string,
    location: PropTypes.string,
    department: PropTypes.string,
    userOpportunity: PropTypes.shape({
      status: PropTypes.number,
      bookmarked: PropTypes.bool,
      note: PropTypes.string,
      archived: PropTypes.bool,
    }),
  }),
  onOfferUpdated: PropTypes.func.isRequired,
  navigateBackToList: PropTypes.func.isRequired,
};
ModalOffer.defaultProps = {
  currentOffer: { userOpportunity: {}, businessLines: [] },
};

export default ModalOffer;
