/* global UIkit */

import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Api from '../../../Axios';
import { GridNoSSR, Button } from '../../utils';
import { CVFicheEdition, CVBackground, CVFiche } from '../../cv';
import { UserContext } from '../../store/UserProvider';
import ButtonPost from './ButtonPost';
import ErrorMessage from './ErrorMessage';
import LoadingScreen from './LoadingScreen';

import {CV_STATUS, USER_ROLES} from "../../../constants";
import NoCV from "./NoCV";
import ButtonDownload from "./ButtonDownload";

let originalStatus = CV_STATUS.Progress.value;

const CVPageContent = ({ candidatId }) => {
  const [cv, setCV] = useState(undefined);
  const [cvVersion, setCvVersion] = useState(undefined);
  const [imageUrl, setImageUrl] = useState(undefined);

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
            setCvVersion(data.version);
            setImageUrl(`${process.env.AWSS3_URL}${data.urlImg}`);
            originalStatus = data.status;
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
    const unsavedChanges = cv && cv.status === CV_STATUS.Draft.value;
    const message =
      "Voulez-vous quitter l'édition du CV? \nLes modifications que vous avez apportées ne seront peut-être pas enregistrées.";
    const routeChangeStart = (url) => {
      if (Router.asPath !== url && unsavedChanges && !window.confirm(message)) {
        Router.events.emit('routeChangeError');
        Router.replace(Router, Router.asPath);

        // Keep this string error to stop Next.js from navigating
        throw 'Abort route change. Please ignore this error.';
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
      .then(({ data }) => {
        setCV(data);
        setCvVersion(data.version);
        // Use hash to reload image if an update is done
        const previewHash = Date.now();
        setImageUrl(
          `${process.env.AWSS3_URL}${process.env.AWSS3_IMAGE_DIRECTORY}${data.UserId}.${data.status}.jpg?${previewHash}`
        );

        UIkit.notification(
          user.role === USER_ROLES.CANDIDAT
            ? 'Votre CV a bien été sauvegardé'
            : 'Le profil a été mis à jour',
          'success'
        );
      })
      .catch((err) => {
        console.error(err);
        UIkit.notification("Une erreur s'est produite", 'danger');
      });
  };

  const autoSaveCV = (tempCV) => {
    const formData = new FormData();
    const obj = {
      ...tempCV,
      status: originalStatus,
      profileImage: undefined,
    };
    delete obj.id;
    formData.append('cv', JSON.stringify(obj));
    formData.append('autoSave', true);
    // post
    return Api.post(`${process.env.SERVER_URL}/api/v1/cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(({data}) => {
        console.log('Auto-save succeeded.');
        setCvVersion(data.version);
      })
      .catch(() => {
        console.log('Auto-save failed.');
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
      <NoCV candidatId={candidatId} user={user} setCV={(cvData) => {
        setCV(cvData);
        setCvVersion(cvData.version);
      }} />
    );
  }

  const cvStatus = CV_STATUS[cv.status] ? CV_STATUS[cv.status] : CV_STATUS.Unknown;

  // affichage du CV
  return (
    <div>
      <GridNoSSR between middle>
        <GridNoSSR column gap="collapse">
          <div>
            Statut&nbsp;:{' '}
            <span className={`uk-text-${cvStatus.style}`}>
              {cvStatus.label}
            </span>
          </div>
          {(user.role === USER_ROLES.ADMIN) && (
            <div>Version&nbsp;: {cvVersion}</div>
          )}
        </GridNoSSR>

        <GridNoSSR row gap="small">
          <ButtonDownload
            candidatId={cv.UserId}
            firstName={cv.user.candidat.firstName}
            lastName={cv.user.candidat.lastName} />
          <Button toggle="target: #preview-modal" style="default">
            Prévisualiser
          </Button>
          <ButtonPost
            style="primary"
            action={() => postCV(CV_STATUS.Progress.value)}
            text="Sauvegarder"
          />
          {(user.role === USER_ROLES.COACH) && (
            <ButtonPost
              style="primary"
              action={() => postCV(CV_STATUS.Pending.value)}
              text="Soumettre"
            />
          )}
          {(user.role === USER_ROLES.ADMIN) && (
            <ButtonPost
              style="primary"
              action={() => postCV(CV_STATUS.Published.value)}
              text="Publier"
            />
          )}
        </GridNoSSR>
      </GridNoSSR>
      <CVFicheEdition
        gender={cv.user.candidat.gender}
        cv={cv}
        disablePicture={user.role === USER_ROLES.CANDIDAT || user.role === USER_ROLES.COACH}
        onChange={(fields) => {
          autoSaveCV({...cv, ...fields});
          setCV({ ...cv, ...fields, status: CV_STATUS.Draft.value });
        }}
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
                    : imageUrl
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
