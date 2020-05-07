/* global UIkit */

import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Api from '../../../Axios';
import { GridNoSSR, Button, IconNoSSR } from '../../utils';
import { CVFicheEdition, CVBackground, CVFiche } from '../../cv';
import { UserContext } from '../../store/UserProvider';
import ButtonPost from './ButtonPost';
import ErrorMessage from './ErrorMessage';
import LoadingScreen from './LoadingScreen';

import {CV_STATUS, USER_ROLES} from "../../../constants";

const CVPageContent = ({ candidatId }) => {
  const [cv, setCV] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // fetch CV
    if (candidatId) {
      setLoading(true);
      Api.get(`${process.env.SERVER_URL}/api/v1/cv/`, {
        params: {
          userId: candidatId,
        },
      })
        .then(({ data }) => {
          if (data) {
            setCV(data);
          } else {
            setCV(null);
            console.log('pas de cv');
          }
        })
        .catch((err) => {
          console.error(err);
          setError('Une erreur est survenue durant le chargement du CV.');
        })
        .finally(() => setLoading(false));
    } else {
      setCV(null);
      setLoading(false);
    }
  }, [candidatId]);

  useEffect(() => {
    const unsavedChanges = cv && cv.status === 'Draft';
    const message =
      "Voulez-vous quitter l'édition du CV? \nLes modifications que vous avez apportées ne seront peut-être pas enregistrées.";
    // 'Voulez-vous sauvegarder les modifications que vous avez apportées ?\nvos modifications seront perdues si vous ne les sauvegardez pas.';
    const routeChangeStart = (url) => {
      if (Router.asPath !== url && unsavedChanges && !window.confirm(message)) {
        Router.events.emit('routeChangeError');
        Router.replace(Router, Router.asPath);
        throw new Error('Abort route change. Please ignore this error.');
      }
    };

    const beforeunload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', beforeunload);
    Router.events.on('routeChangeStart', routeChangeStart);

    return () => {
      window.removeEventListener('beforeunload', beforeunload);
      Router.events.off('routeChangeStart', routeChangeStart);
    };
  }, [cv]);

  const postCV = (status) => {
    // prepare data
    const formData = new FormData();
    const obj = {
      ...cv,
      status,
      version: cv.version + 1,
      profileImage: undefined,
    };
    delete obj.id;
    formData.append('cv', JSON.stringify(obj));
    formData.append('profileImage', cv.profileImage);
    // post
    return Api.post(`${process.env.SERVER_URL}/api/v1/cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() =>
        Api.get(`${process.env.SERVER_URL}/api/v1/cv/`, {
          params: {
            userId: candidatId,
          },
        })
      )
      .then(({ data }) => {
        setCV(data);
        UIkit.notification(
          user.role === USER_ROLES.CANDIDAT
            ? 'Votre demande de modification a bien été envoyée'
            : 'Le profil a été mis à jour',
          'success'
        );
      })
      .catch((err) => {
        console.error(err);
        UIkit.notification("Une erreur s'est produite", 'danger');
      });
  };

  if (user === null) return null;

  // chargement
  if (loading) {
    return <LoadingScreen />;
  }
  // erreur pendant la requete
  if (error) {
    return <ErrorMessage error={error} />;
  }
  // aucun CV
  if (cv === null) {
    return (
      <GridNoSSR column middle>
        <div>
          {user.role === USER_ROLES.COACH && !user.candidatId && (
            <>
              <h2 className="uk-text-bold">
                <span className="uk-text-primary">Aucun candidat</span>{' '}
                n&apos;est rattaché à ce compte coach.
              </h2>
              <p>
                Il peut y avoir plusieurs raisons à ce sujet. Contacte
                l&apos;équipe LinkedOut pour en savoir plus.
              </p>
            </>
          )}
          {(user.role === USER_ROLES.ADMIN ||
            user.role === USER_ROLES.CANDIDAT ||
            (user.role === USER_ROLES.COACH && user.candidatId)) && (
            <>
              <h2 className="uk-text-bold">
                <span className="uk-text-primary">Aucun CV</span> n&apos;est
                rattaché à ce compte.
              </h2>
              <Button
                style="primary"
                onClick={() =>
                  Api.post(`${process.env.SERVER_URL}/api/v1/cv`, {
                    cv: { userId: candidatId, status: CV_STATUS.New.value },
                  }).then(({ data }) => setCV(data))
                }
              >
                Creer le CV
              </Button>
            </>
          )}
        </div>
      </GridNoSSR>
    );
  }

  const cvStatus = CV_STATUS[cv.status] ? CV_STATUS[cv.status] : CV_STATUS.Unkown;

  // affichage du CV
  return (
    <div>
      <GridNoSSR between middle>
        <GridNoSSR column gap="collapse">
          <div>
            Statut :{' '}
            <span className={`uk-text-${cvStatus.style}`}>
              {cvStatus.label}
            </span>
          </div>
          {(user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.COACH) && (
            <div>Version : {cv.version}</div>
          )}
        </GridNoSSR>

        <GridNoSSR row gap="small">
          <Button toggle="target: #preview-modal" style="default">
            Prévisualiser
          </Button>
          {user.role === USER_ROLES.CANDIDAT && (
            <ButtonPost
              style="primary"
              action={() => postCV('Pending')}
              text="Soumettre"
            />
          )}
          {(user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.COACH) && (
            <ButtonPost
              style="default"
              action={() => postCV('Pending')}
              text="Sauvegarder"
            />
          )}
          {(user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.COACH) && (
            <ButtonPost
              style="primary"
              action={() => postCV('Published')}
              text="Publier"
            />
          )}
        </GridNoSSR>
      </GridNoSSR>
      <CVFicheEdition
        gender={cv.user.candidat.gender}
        cv={cv}
        disablePicture={user.role === USER_ROLES.CANDIDAT || user.role === USER_ROLES.COACH}
        onChange={(fields) => setCV({ ...cv, ...fields, status: 'Draft' })}
      />

      {/* preview modal */}
      <div id="preview-modal" className="uk-modal-container" data-uk-modal>
        <div className="uk-modal-dialog">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            aria-label="close"
          />
          <div className="uk-modal-header">
            <h2 className="uk-modal-title">Prévisualisation du CV</h2>
          </div>
          <div
            className="uk-modal-body uk-background-muted"
            data-uk-overflow-auto
          >
            {cv.urlImg && (
              <CVBackground
                url={
                  cv.profileImageObjectUrl
                    ? cv.profileImageObjectUrl
                    : process.env.AWSS3_URL + cv.urlImg
                }
              />
            )}
            <CVFiche cv={cv} actionDisabled />
          </div>
          <div className="uk-modal-footer uk-text-right">
            <Button className="uk-modal-close" style="default">
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
CVPageContent.propTypes = {
  candidatId: PropTypes.string.isRequired,
};

export default CVPageContent;
