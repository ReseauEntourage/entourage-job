/* global UIkit */
import React, { useState, useEffect, useRef, useContext } from 'react';
import PropsType from 'prop-types';
import moment from 'moment';
import Api from '../../Axios';
import schema from '../forms/schema/formEditOpportunity';
import FormWithValidation from '../forms/FormWithValidation';
import { GridNoSSR, Button, SimpleLink, IconNoSSR } from '../utils';
import ButtonIcon from '../utils/ButtonIcon';
import { CloseButtonNoSSR } from '../utils/CloseButton';
import { translateCategory, OfferInfoContainer, List } from './ModalOffer';
import { useResetForm } from "../../hooks";
import { ModalContext } from '../store/ModalProvider';

const ModalOfferAdmin = ({
  currentOffer,
  setCurrentOffer,
  id: modalId
}) => {
  if (!currentOffer) {
    currentOffer = {
      userOpportunity: [],
      businessLines: []
    };
  }

  const {
    setClose,
    form,
    resetForm,
    close,
  } = useContext(ModalContext);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // const [form, resetForm] = useResetForm();

  const updateOpportunity = async opportunity => {
    setError(false);
    setLoading(true);

    try {
      const {
        data
      } = await Api.put(`/api/v1/opportunity/`, opportunity);
      setCurrentOffer(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError(false);
    setIsEditing(false);
  }, [currentOffer]);

  const contentBuilder = () => {
    // error
    if (error) {
      return <div>Une erreur c&lsquo;est produite</div>;
    } // loading


    if (loading) {
      return <div className="uk-height-medium uk-flex uk-flex-middle uk-flex-center">
        <div data-uk-spinner="" />
      </div>;
    } // edit


    if (isEditing) {
      return <div>
        <h3>Modification de l&apos;offres d&apos;emploi</h3>
        <FormWithValidation ref={form} formSchema={schema} defaultValues={{
          ...currentOffer,
          candidatId: !currentOffer.isPublic && currentOffer.userOpportunity && currentOffer.userOpportunity[0] && currentOffer.userOpportunity[0].User && currentOffer.userOpportunity[0].User.firstName ? {
            value: currentOffer.userOpportunity[0].User.id,
            label: `${currentOffer.userOpportunity[0].User.firstName} ${currentOffer.userOpportunity[0].User.lastName}`
          } : undefined
        }} onCancel={() => setIsEditing(false)} onSubmit={fields => {
          const tmpOpportunity = {
            ...currentOffer,
            ...fields
          };

          if (fields.candidatId) {
            tmpOpportunity.usersId = [fields.candidatId.value ? fields.candidatId.value : fields.candidatId];
          }

          updateOpportunity(tmpOpportunity);
          setIsEditing(false);
        }} submitText="Mettre à jour" />
      </div>;
    } // view


    return <div>
      <GridNoSSR gap="small" between middle>
        <GridNoSSR gap="collapse" column>
          <h3 className="uk-text-bold uk-margin-remove-bottom">
            {currentOffer.title}
          </h3>
          <span>{translateCategory(currentOffer.isPublic)}</span>
        </GridNoSSR>
        <List className="uk-iconnav uk-grid-medium">
          <ButtonIcon name="pencil" onClick={() => {
            setIsEditing(true);
          }} />
        </List>
      </GridNoSSR>
      <hr />
      <GridNoSSR className="uk-margin-bottom" eachWidths={['1-3@s', '2-3@s']}>
        <GridNoSSR column gap="medium">
          <OfferInfoContainer>
            {(() => {
              let className = ' uk-label-warning';
              let content = 'En attente';

              if (currentOffer.isValidated) {
                content = 'Validé';
                className = ' uk-label-success';
              }

              if (currentOffer.isArchived) {
                content = 'Archivé';
                className = ' uk-label-danger';
              }

              return <div className={`uk-label${className}`}>{content}</div>;
            })()}
          </OfferInfoContainer>
          <OfferInfoContainer icon="hashtag" title="Entreprise">
            {currentOffer.company}
          </OfferInfoContainer>
          <OfferInfoContainer icon="user" title="Recruteur">
            {currentOffer.recruiterName}
            <SimpleLink href={`mailto:${currentOffer.recruiterMail}`} className="uk-link-muted" isExternal>
              <span>{currentOffer.recruiterMail}</span>
              <IconNoSSR name="mail" ratio={0.8} />
            </SimpleLink>
            <SimpleLink href={`tel:${currentOffer.recruiterPhone}`} className="uk-link-muted" isExternal>
              <span>{currentOffer.recruiterPhone}</span>
              <IconNoSSR name="phone" ratio={0.8} />
            </SimpleLink>
            <span className="uk-text-italic">
              offre soumise le{' '}
              {moment(currentOffer.date).format('DD/MM/YYYY')}
            </span>
          </OfferInfoContainer>
          <OfferInfoContainer icon="location" title={currentOffer.location} />
          {!currentOffer.isPublic && <OfferInfoContainer icon="users" title="Candidat lié">
            {currentOffer.userOpportunity && currentOffer.userOpportunity.map(({
              User: {
                firstName,
                lastName,
                id
              }
            }) => <SimpleLink as={`/backoffice/admin/membres/${id}`} href="/backoffice/admin/membres/[id]" className="uk-link-muted" target="_blank">
                <span>{`${firstName} ${lastName}`}</span>
                <IconNoSSR name="link" ratio={0.8} />
              </SimpleLink>)}
          </OfferInfoContainer>}
        </GridNoSSR>
        <GridNoSSR gap="medium">
          <OfferInfoContainer icon="comment" title="Message">
            {currentOffer.description}
          </OfferInfoContainer>
          {currentOffer.businessLines && <GridNoSSR center>
            {currentOffer.businessLines.map(businessLine => <Button disabled>
              <span style={{
                color: '#666'
              }}>{businessLine}</span>
            </Button>)}
          </GridNoSSR>}
        </GridNoSSR>
      </GridNoSSR>
      <GridNoSSR className="uk-flex-right" row>
        {!currentOffer.isArchived ? <Button style="default" onClick={() => updateOpportunity({
          ...currentOffer,
          isValidated: false,
          isArchived: true
        })}>
          Refuser l&apos;offre
            </Button> : <Button style="default" onClick={() => updateOpportunity({
          ...currentOffer,
          isValidated: false,
          isArchived: false
        })}>
            Retirer l&apos;offre des archives
              </Button>}
        {!currentOffer.isValidated && <Button style="primary" onClick={() => updateOpportunity({
          ...currentOffer,
          isValidated: true,
          isArchived: false
        })}>
          Valider l&apos;offre
            </Button>}
      </GridNoSSR>
    </div>;
  }; // Modal


  return <div id={modalId} className="uk-modal" data-uk-modal="bg-close:false">
    <div className={`uk-modal-dialog uk-width-1-1 uk-width-3-4@m uk-width-2-3@l uk-width-1-2@xl ${currentOffer.isArchived && 'uk-light uk-background-secondary'}`}>
      <CloseButtonNoSSR onClick={() => {
        if (isEditing) {
          setIsEditing(false);
        }
        setClose(true);
      }} />
      <div className="uk-modal-body">{contentBuilder()}</div>
    </div>
  </div>;
};

ModalOfferAdmin.propTypes = {
  id: PropsType.string.isRequired,
  currentOffer: PropsType.shape({
    businessLines: PropsType.arrayOf(PropsType.string),
    company: PropsType.string,
    date: PropsType.string,
    description: PropsType.string,
    isArchived: PropsType.bool,
    isPublic: PropsType.bool,
    isValidated: PropsType.bool,
    recruiterName: PropsType.string,
    location: PropsType.string,
    recruiterMail: PropsType.string,
    recruiterPhone: PropsType.string,
    title: PropsType.string,
    userOpportunity: PropsType.arrayOf(PropsType.shape({
      status: PropsType.string,
      bookmarked: PropsType.string,
      note: PropsType.string,
      archived: PropsType.string
    }))
  }),
  setCurrentOffer: PropsType.func.isRequired
};
ModalOfferAdmin.defaultProps = {
  currentOffer: {
    userOpportunity: {},
    businessLines: []
  }
};
export default ModalOfferAdmin;