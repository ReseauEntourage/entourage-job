/* global UIkit */
import React, { useState, useEffect } from 'react';
import PropsType, { func } from 'prop-types';
import moment from 'moment';
import { GridNoSSR, Button, IconNoSSR, SimpleLink } from '../utils';
import Textarea from '../forms/fields/Textarea';
import Select from '../forms/fields/Select';
import ButtonIcon from '../utils/ButtonIcon';
import { CloseButtonNoSSR } from '../utils/CloseButton';
import axios from '../../Axios';
import {OFFER_STATUS} from "../../constants";

export const List = ({ className, children }) => (
  <ul className={`uk-nav ${className}`}>
    {Array.isArray(children)
      ? children.map((item, i) => <li key={i}>{item}</li>)
      : children}
  </ul>
);
List.propTypes = {
  className: PropsType.string,
  children: PropsType.arrayOf(PropsType.element).isRequired,
};
List.defaultProps = {
  className: undefined,
};

export const OfferInfoContainer = ({ icon, title, children }) => {
  if (!children.map) {
    children = [children];
  }

  return (
    <GridNoSSR gap="small" eachWidths={['auto', 'expand']}>
      {icon ? <IconNoSSR name={icon} /> : <div className="uk-margin-left" />}
      <div>
        {title ? <span className="uk-text-bold">{title}</span> : undefined}
        <GridNoSSR gap="collapse" childWidths={['1-1']}>
          {children}
        </GridNoSSR>
      </div>
    </GridNoSSR>
  );
};
OfferInfoContainer.propTypes = {
  icon: PropsType.string,
  title: PropsType.string,
  children: PropsType.arrayOf(PropsType.string),
};
OfferInfoContainer.defaultProps = {
  title: undefined,
  icon: undefined,
  children: [],
};

export function translateCategory(isPublic) {
  if (!isPublic) return 'Offre personnelle';
  if (isPublic) return 'Offre générale';
  return 'Offre inconnue';
}
const ModalOffer = ({ currentOffer, setCurrentOffer }) => {
  if (!currentOffer) {
    currentOffer = { userOpportunity: {}, businessLines: [] };
  }
  const { status, bookmarked, note, archived } = currentOffer.userOpportunity;

  const [loadingIcon, setLoadingIcon] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [noteBuffer, setNoteBuffer] = useState(note);
  const [loading, setLoading] = useState(false);

  const updateOpportunityUser = async (opportunityUser) => {
    await axios.put(
      `${process.env.SERVER_URL}/api/v1/opportunity/join`,
      opportunityUser
    );
    setCurrentOffer({ ...currentOffer, opportunityUser });
  };

  useEffect(() => setNoteBuffer(note), [currentOffer]);

  // futur: use moment
  const date = new Date(currentOffer.date);
  const formatDate = `${date.getMonth() +
    1}/${date.getDate()}/${date.getFullYear()}`;

  return (
    <div id="modal-offer" data-uk-modal="bg-close:false">
      <div
        className={`uk-modal-dialog uk-width-1-1 uk-width-3-4@m uk-width-2-3@l uk-width-1-2@xl ${archived &&
          'uk-light uk-background-secondary'}`}
      >
        <CloseButtonNoSSR className="uk-modal-close-default" />
        {!currentOffer ? null : (
          <div className="uk-modal-body">
            <GridNoSSR gap="small" between middle>
              <div>
                <h3 className="uk-text-bold uk-margin-remove-bottom">
                  {currentOffer.title}
                </h3>
                <span>{translateCategory(currentOffer.isPublic)}</span>
              </div>
              <List className="uk-iconnav uk-grid-medium uk-flex-middle">
                {loadingIcon && <div data-uk-spinner="" />}
                <ButtonIcon
                  name="pull"
                  className={archived ? 'ent-color-amber' : undefined}
                  onClick={() => {
                    setLoadingIcon(true);
                    const { userOpportunity } = currentOffer;
                    userOpportunity.archived = !archived;
                    updateOpportunityUser(userOpportunity);
                    setLoadingIcon(false);
                  }}
                />
                <ButtonIcon
                  name="star"
                  className={bookmarked ? 'ent-color-amber' : undefined}
                  onClick={() => {
                    setLoadingIcon(true);
                    const { userOpportunity } = currentOffer;
                    userOpportunity.bookmarked = !bookmarked;
                    updateOpportunityUser(userOpportunity);
                    setLoadingIcon(false);
                  }}
                />
              </List>
            </GridNoSSR>
            <hr />
            <GridNoSSR
              className="uk-margin-bottom"
              eachWidths={['1-3@s', '2-3@s']}
              items={[
                <GridNoSSR column gap="medium">
                  <GridNoSSR eachWidths={['expand', 'auto']} row middle>
                    <Select
                      id="modal-offer-status"
                      title="Statut"
                      name="status"
                      placeholder="statut"
                      options={OFFER_STATUS}
                      defaultValue={status}
                      onChange={(event) => {
                        setLoadingStatus(true);
                        const { userOpportunity } = currentOffer;
                        userOpportunity.status = Number(event.target.value);
                        updateOpportunityUser(userOpportunity);
                        setLoadingStatus(false);
                      }}
                    />
                    {loadingStatus && <div data-uk-spinner="" />}
                  </GridNoSSR>
                  <OfferInfoContainer icon="hashtag" title="Entreprise">
                    {currentOffer.company}
                  </OfferInfoContainer>
                  <OfferInfoContainer icon="user" title="Recruteur">
                    {currentOffer.recruiterName}
                    <SimpleLink
                      href={`mailto:${currentOffer.recruiterMail}`}
                      className="uk-link-muted"
                      isExternal
                    >
                      <span>{currentOffer.recruiterMail}</span>
                      <IconNoSSR name="mail" ratio={0.8} />
                    </SimpleLink>
                    <SimpleLink
                      href={`tel:${currentOffer.recruiterPhone}`}
                      className="uk-link-muted"
                      isExternal
                    >
                      <span>{currentOffer.recruiterPhone}</span>
                      <IconNoSSR name="phone" ratio={0.8} />
                    </SimpleLink>
                    <span className="uk-text-italic">
                      offre soumise le{' '}
                      {moment(currentOffer.date).format('DD/MM/YYYY')}
                    </span>
                  </OfferInfoContainer>
                  <OfferInfoContainer
                    icon="location"
                    title={currentOffer.location}
                  />
                </GridNoSSR>,
                <GridNoSSR gap="medium">
                  <OfferInfoContainer icon="comment" title="Message">
                    {currentOffer.description}
                  </OfferInfoContainer>
                  {currentOffer.businessLines && (
                    <GridNoSSR center>
                      {currentOffer.businessLines.map((businessLine) => (
                        <Button disabled>
                          <span style={{ color: '#666' }}>{businessLine}</span>
                        </Button>
                      ))}
                    </GridNoSSR>
                  )}
                </GridNoSSR>,
              ]}
            />
            <div>
              <Textarea
                id="modal-offer-comment"
                name="modal-offer-comment"
                title="Ecrivez un commentaire à propos de cette opportunité..."
                type="text"
                defaultValue={note}
                onChange={(e) => setNoteBuffer(e.target.value)}
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
                    const { userOpportunity } = currentOffer;
                    userOpportunity.note = noteBuffer;
                    await updateOpportunityUser(userOpportunity);
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
        )}
      </div>
    </div>
  );
};
ModalOffer.propTypes = {
  currentOffer: PropsType.shape({
    title: PropsType.string,
    company: PropsType.string,
    description: PropsType.string,
    recruiterName: PropsType.string,
    isPublic: PropsType.bool,
    recruiterMail: PropsType.string,
    recruiterPhone: PropsType.string,
    businessLines: PropsType.arrayOf(PropsType.string),
    date: PropsType.string,
    location: PropsType.string,
    userOpportunity: PropsType.shape({
      status: PropsType.string,
      bookmarked: PropsType.string,
      note: PropsType.string,
      archived: PropsType.string,
    }),
  }),
  setCurrentOffer: PropsType.func.isRequired,
};
ModalOffer.defaultProps = {
  currentOffer: { userOpportunity: {}, businessLines: [] },
};

export default ModalOffer;
