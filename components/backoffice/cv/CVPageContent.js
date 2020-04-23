/* global UIkit */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Api from '../../../Axios';
import { GridNoSSR, Button, IconNoSSR } from '../../utils';
import { CVFicheEdition, CVBackground, CVFiche } from '../../cv';
import { UserContext } from '../../store/UserProvider';
import ButtonPost from './ButtonPost';
import ErrorMessage from './ErrorMessage';
import LoadingScreen from './LoadingScreen';

function translate(status) {
  switch (status) {
    case 'Pending':
      return 'En attente';
    case 'Published':
      return 'Publié';
    case 'New':
      return 'Nouveau';
    case 'Draft':
      return 'Brouillon';
    default:
      return status;
  }
}
function translateStatus(status) {
  switch (status) {
    case 'Draft':
      return 'warning';
    case 'Published':
      return 'success';
    case 'New':
      return 'info';
    default:
      return 'muted';
  }
}

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
          user.role === 'Candidat'
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
          {user.role === 'Coach' && !user.userToCoach && (
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
          {(user.role === 'Admin' ||
            user.role === 'Candidat' ||
            (user.role === 'Coach' && user.userToCoach)) && (
            <>
              <h2 className="uk-text-bold">
                <span className="uk-text-primary">Aucun CV</span> n&apos;est
                rattaché à ce compte.
              </h2>
              <Button
                style="primary"
                onClick={() =>
                  Api.post(`${process.env.SERVER_URL}/api/v1/cv`, {
                    cv: { userId: candidatId, status: 'Pending' },
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
  // affichage du CV
  return (
    <div>
      <GridNoSSR between middle>
        <GridNoSSR column gap="collapse">
          <div>
            Statut :{' '}
            <span className={`uk-text-${translateStatus(cv.status)}`}>
              {translate(cv.status)}
            </span>
          </div>
          {(user.role === 'Admin' || user.role === 'Coach') && (
            <div>Version : {cv.version}</div>
          )}
        </GridNoSSR>

        <GridNoSSR row gap="small">
          <Button toggle="target: #preview-modal" style="default">
            Prévisualiser
          </Button>
          {user.role === 'Candidat' && (
            <ButtonPost
              style="primary"
              action={() => postCV('Pending')}
              text="Soumettre"
            />
          )}
          {(user.role === 'Admin' || user.role === 'Coach') && (
            <ButtonPost
              style="default"
              action={() => postCV('Pending')}
              text="Sauvegarder"
            />
          )}
          {(user.role === 'Admin' || user.role === 'Coach') && (
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
        disablePicture={user.role === 'Candidat' || user.role === 'Coach'}
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
            <h2 className="uk-modal-title">Previsualisation du cv</h2>
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
