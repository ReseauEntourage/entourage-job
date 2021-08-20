/* global UIkit */

import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Pusher from 'pusher-js';
import Api from 'src/Axios';
import { GridNoSSR, Button } from 'src/components/utils';
import { CVFicheEdition, CVBackground, CVFiche } from 'src/components/cv';
import { UserContext } from 'src/components/store/UserProvider';
import ButtonPost from 'src/components/backoffice/cv/ButtonPost';
import ErrorMessage from 'src/components/backoffice/cv/ErrorMessage';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';

import { CV_STATUS, USER_ROLES, SOCKETS } from 'src/constants';
import NoCV from 'src/components/backoffice/cv/NoCV';
import ButtonDownload from 'src/components/backoffice/cv/ButtonDownload';

const pusher = new Pusher(process.env.PUSHER_API_KEY, {
  cluster: 'eu',
  forceTLS: true,
});

const CVPageContent = ({ candidatId }) => {
  const [cv, setCV] = useState(undefined);
  const [cvVersion, setCvVersion] = useState(undefined);
  const [imageUrl, setImageUrl] = useState(undefined);
  const [previewGenerating, setPreviewGenerating] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    return () => {
      pusher.unsubscribe(SOCKETS.CHANNEL_NAMES.CV_PREVIEW);
      pusher.unsubscribe(SOCKETS.CHANNEL_NAMES.CV_PDF);
    };
  }, []);

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
          } else {
            setCV(null);
            console.log('pas de cv');
          }
        })
        .catch((err) => {
          console.error(err);
          setError('Une erreur est survenue durant le chargement du CV.');
        })
        .finally(() => {
          return setLoading(false);
        });
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
      // eslint-disable-next-line no-alert
      if (Router.asPath !== url && unsavedChanges && !window.confirm(message)) {
        Router.events.emit('routeChangeError');
        Router.replace(Router, Router.asPath);

        // Keep this string error to stop Next.js from navigating
        // eslint-disable-next-line no-throw-literal
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

  useEffect(() => {
    if (!previewGenerating && cv) {
      // Use hash to reload image if an update is done
      const previewHash = Date.now();
      setImageUrl(
        `${process.env.AWSS3_URL}${process.env.AWSS3_IMAGE_DIRECTORY}${cv.UserId}.${cv.status}.jpg?${previewHash}`
      );
    }
  }, [cv, previewGenerating]);

  const saveUserData = (modifiedCv) => {
    return new Promise((res, rej) => {
      if (
        (modifiedCv.email || modifiedCv.phone || modifiedCv.address) &&
        (modifiedCv.email !== cv.user.candidat.email ||
          modifiedCv.phone !== cv.user.candidat.phone ||
          modifiedCv.address !== cv.user.candidat.address)
      ) {
        const userData = {
          email: modifiedCv.email,
          address: modifiedCv.address,
          phone: modifiedCv.phone,
        };

        Api.put(`/api/v1/user/${candidatId}`, userData)
          .then(({ newUserData }) => {
            res(newUserData);
          })
          .catch((err) => {
            rej(err);
          });
      } else {
        res();
      }
    });
  };

  const postCV = (status) => {
    const channelPreview = pusher.subscribe(SOCKETS.CHANNEL_NAMES.CV_PREVIEW);
    const channelPDF = pusher.subscribe(SOCKETS.CHANNEL_NAMES.CV_PDF);

    setPreviewGenerating(true);
    setPdfGenerating(true);

    channelPreview.bind(SOCKETS.EVENTS.CV_PREVIEW_DONE, (data) => {
      if (data.candidatId === candidatId) {
        setPreviewGenerating(false);
        pusher.unsubscribe(SOCKETS.CHANNEL_NAMES.CV_PREVIEW);
      }
    });

    channelPDF.bind(SOCKETS.EVENTS.CV_PDF_DONE, (data) => {
      if (data.candidatId === candidatId) {
        setPdfGenerating(false);
        pusher.unsubscribe(SOCKETS.CHANNEL_NAMES.CV_PDF);
      }
    });

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
      status: CV_STATUS.Progress.value,
      profileImage: undefined,
    };
    delete obj.id;
    formData.append('cv', JSON.stringify(obj));
    formData.append('autoSave', true);
    // post
    return saveUserData(obj)
      .then(() => {
        return Api.post(`${process.env.SERVER_URL}/api/v1/cv`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      })
      .then(({ data }) => {
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
      <NoCV
        candidatId={candidatId}
        user={user}
        setCV={(cvData) => {
          setCV(cvData);
          setCvVersion(cvData.version);
        }}
      />
    );
  }

  const cvStatus = CV_STATUS[cv.status]
    ? CV_STATUS[cv.status]
    : CV_STATUS.Unknown;

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
          {user.role === USER_ROLES.ADMIN && (
            <div>
              Version&nbsp;:&nbsp;
              {cvVersion}
            </div>
          )}
        </GridNoSSR>

        <GridNoSSR row gap="small">
          <ButtonDownload
            pdfGenerating={pdfGenerating}
            candidatId={cv.UserId}
            firstName={cv.user.candidat.firstName}
            lastName={cv.user.candidat.lastName}
          />
          <Button toggle="target: #preview-modal" style="default">
            Prévisualiser
          </Button>
          <ButtonPost
            style="primary"
            action={async () => {
              return postCV(CV_STATUS.Progress.value);
            }}
            text="Sauvegarder"
          />
          {user.role === USER_ROLES.COACH && (
            <ButtonPost
              style="primary"
              action={async () => {
                return postCV(CV_STATUS.Pending.value);
              }}
              text="Soumettre"
            />
          )}
          {user.role === USER_ROLES.ADMIN && (
            <ButtonPost
              style="primary"
              action={async () => {
                return postCV(CV_STATUS.Published.value);
              }}
              text="Publier"
            />
          )}
        </GridNoSSR>
      </GridNoSSR>
      <CVFicheEdition
        gender={cv.user.candidat.gender}
        email={cv.email || cv.user.candidat.email}
        phone={cv.phone || cv.user.candidat.phone}
        address={cv.address || cv.user.candidat.address}
        cv={cv}
        previewGenerating={previewGenerating}
        disablePicture={
          user.role === USER_ROLES.CANDIDAT || user.role === USER_ROLES.COACH
        }
        onChange={async (fields) => {
          await autoSaveCV({ ...cv, ...fields });
          setCV({ ...cv, ...fields, status: CV_STATUS.Draft.value });
        }}
        userZone={cv.user.candidat.zone}
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
                  cv.profileImageObjectUrl ? cv.profileImageObjectUrl : imageUrl
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
