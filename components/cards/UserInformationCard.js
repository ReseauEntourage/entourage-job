/* global UIkit */
import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { GridNoSSR, IconNoSSR, SimpleLink, Card } from '../utils';
import ButtonIcon from '../utils/ButtonIcon';
import ModalEdit from '../modals/ModalEdit';
import schema from '../forms/schema/formEditLinkedUser';
import axios from '../../Axios';
import {USER_ROLES} from "../../constants";

// userId du candidat ou coach lié
const UserInformationCard = ({ user, onChange }) => {
  // données du candidat ou coach lié
  const [linkedUser, setLinkedUser] = useState();
  const [userCandidat, setUserCandidat] = useState();

  const [loading, setLoading] = useState(false);

  const assignUser = (userToAssign) => {
    if (userToAssign.role === USER_ROLES.COACH) {
      if (userToAssign.coach) {
        setLinkedUser(userToAssign.coach.candidat);
        setUserCandidat(userToAssign.coach);
      } else {
        setLinkedUser(null);
        setUserCandidat(null);
      }
      // customisation du schema en fonction de l'utilisateur
      schema.fields[1].title = 'Candidat lié';
    }
    if (userToAssign.role === USER_ROLES.CANDIDAT) {
      if (userToAssign.candidat) {
        setLinkedUser(userToAssign.candidat.coach);
        setUserCandidat(userToAssign.candidat);
      } else {
        setLinkedUser(null);
        setUserCandidat(null);
      }
      schema.fields[1].title = 'Coach lié';
    }
  };

  useEffect(() => {
    if (user) {
      assignUser(user);
    }
  }, [user]);

  // si membre lié ou non
  const cardContent = linkedUser ? (
    <GridNoSSR column gap="small">
      <GridNoSSR row gap="small">
        <IconNoSSR name="user" />
        <span>{`${linkedUser.firstName} ${linkedUser.lastName}`}</span>
      </GridNoSSR>

      <SimpleLink
        href={`mailto:${linkedUser.email}`}
        className="uk-link-muted"
        isExternal
      >
        <GridNoSSR row gap="small">
          <IconNoSSR name="mail" />
          <span>{linkedUser.email}</span>
        </GridNoSSR>
      </SimpleLink>
      {linkedUser.phone ? (
        <SimpleLink
          href={`tel:${linkedUser.phone}`}
          className="uk-link-muted"
          isExternal
        >
          <GridNoSSR row gap="small">
            <IconNoSSR name="phone" />
            <span>{linkedUser.phone}</span>
          </GridNoSSR>
        </SimpleLink>
      ) : (
        <GridNoSSR row gap="small">
          <IconNoSSR name="phone" />
          <span className="uk-text-italic">
            Numéro de téléphone non renseigné
          </span>
        </GridNoSSR>
      )}
      {user.role === USER_ROLES.COACH && userCandidat && (
        <SimpleLink
          className="uk-link-muted"
          target="_blank"
          href={`/cv/${userCandidat.url}`}
        >
          <GridNoSSR row gap="small">
            <IconNoSSR name="link" />
            <span className="uk-text-italic">{userCandidat.url}</span>
          </GridNoSSR>
        </SimpleLink>
      )}
      {user.role === USER_ROLES.COACH && userCandidat && (
        <GridNoSSR row gap="small">
          <IconNoSSR name="cog" />
          <span className="uk-text-italic">
            {userCandidat.hidden ? 'CV caché' : 'CV visible'}
          </span>
        </GridNoSSR>
      )}
      {user.role === USER_ROLES.COACH && userCandidat && (
        <GridNoSSR row gap="small">
          <IconNoSSR name="cog" />
          <span className="uk-text-italic">
            {userCandidat.employed
              ? 'A retrouvé un emploi'
              : "N'a pas retrouvé d'emploi"}
          </span>
        </GridNoSSR>
      )}
    </GridNoSSR>
  ) : (
    <span className="uk-text-italic">Aucun membre lié</span>
  );

  return (
    <>
      <Card
        style="secondary"
        title={`Information du${
          user.role === USER_ROLES.COACH ? ' candidat' : ' coach'
        }`}
        badge={
          loading ? (
            <div data-uk-spinner="ratio: .8" />
          ) : (
            <ButtonIcon
              name="pencil"
              onClick={() => UIkit.modal(`#modal-edit-linked-user`).show()}
            />
          )
        }
      >
        {cardContent}
      </Card>
      <ModalEdit
        submitText="Envoyer"
        id="modal-edit-linked-user"
        title={user.role === USER_ROLES.CANDIDAT ? 'Bénévole coach lié' : 'Candidat lié'}
        defaultValues={{
          role: user.role === USER_ROLES.COACH ? USER_ROLES.CANDIDAT : USER_ROLES.COACH,
          linkedUser: linkedUser
            ? {
                value: linkedUser.id,
                label: `${linkedUser.firstName} ${linkedUser.lastName}`,
              }
            : undefined,
        }}
        formSchema={schema}
        onSubmit={({ linkedUser: linkedUserId }, closeModal) => {
          setLoading(true);
          let promise = null;
          if (user.role === USER_ROLES.CANDIDAT) {
            // on lui assigne ou eleve un coach
            promise = axios.put(`api/v1/user/candidat/${user.id}`, {
              coachId: linkedUserId || null,
            });
          }
          if (user.role === USER_ROLES.COACH) {
            // on l'assigne à un candidat
            if (linkedUserId) {
              promise = axios.put(`api/v1/user/candidat/${linkedUserId}`, {
                coachId: user.id,
              });
            } else {
              // on lui enleve son candidat
              promise = axios.put(`api/v1/user/candidat/${linkedUser.id}`, {
                coachId: null,
              });
            }
          }
          if (promise) {
            promise
              .then(() => axios.get(`/api/v1/user/${user.id}`))
              .then(({ data }) => {
                closeModal();
                assignUser(data);
                onChange(data);
                UIkit.notification('Le membre a bien été lié', 'success');
              })
              .catch((error) => {
                console.error(error);
                UIkit.notification(
                  "Une erreur c'est produite lors du lien etre les membres",
                  'danger'
                );
              })
              .finally(() => setLoading(false));
          }
        }}
      />
    </>
  );
};
UserInformationCard.propTypes = {
  user: PropTypes.shape.isRequired,
  onChange: PropTypes.func,
};

UserInformationCard.defaultProps = {
  onChange: () => {},
};

export default UserInformationCard;
