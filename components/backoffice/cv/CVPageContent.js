/* global UIkit */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Api from '../../../Axios';
import { GridNoSSR, Button } from '../../utils';
import { CVFicheEdition } from '../../cv';
import { UserContext } from '../../store/UserProvider';
import ButtonPost from './ButtonPost';
import ErrorMessage from './ErrorMessage';
import LoadingScreen from './LoadingScreen';
import NoCV from './NoCV';
import CandidatHeader from './CandidatHeader';

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
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // fetch CV
    setLoading(true);
    if (candidatId) {
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
          {
            pos: 'bottom-center',
            status: 'info',
          }
        );
      })
      .catch((err) => {
        console.error(err);
        UIkit.notification("Une erreur s'est produite", {
          pos: 'bottom-center',
          status: 'danger',
        });
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
                    cv: { userId: candidatId },
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
          <Button disabled style="default">
            Prévisualiser la page
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
        cv={cv}
        disablePicture={user.role === 'Candidat' || user.role === 'Coach'}
        onChange={(fields) => setCV({ ...cv, ...fields, status: 'Draft' })}
      />
    </div>
  );
};
CVPageContent.propTypes = {
  candidatId: PropTypes.string.isRequired,
};

export default CVPageContent;
