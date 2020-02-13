/* global UIkit */
import React, { useContext, useEffect, useState } from 'react';
import { CVFicheEdition } from '../../../components/cv';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import Api from '../../../Axios';
import CVEditNoCandidat from '../../../components/cv/CVEditNoCandidat';
import { Section, Button, GridNoSSR } from '../../../components/utils';
import CVEditWelcome from '../../../components/cv/CVEditWelcome';
import { UserContext } from '../../../components/store/UserProvider';

function translate(status) {
  if (status === 'Pending') {
    return 'En attente';
  }
  if (status === 'Published') {
    return 'Publié';
  }
  if (status === 'New') {
    return 'Nouveau';
  }
  return status;
}

const toUpperFirstLetter = (text) => {
  if (typeof text !== 'string' || text === '') {
    return text;
  }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const Content = ({ id }) => {
  const [cv, setCV] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEdit = async () => {
      try {
        const { data } = await Api.get(
          `${process.env.SERVER_URL}/api/v1/cv/edit`
        );
        if (data) {
          setCV(data);
        } else {
          setCV(null);
        }
      } catch (err) {
        console.error(err);
        setError('Une erreur est survenue durant le chargement du CV.');
      }
    };
    fetchEdit();
  }, []);

  const submitCV = async () => {
    setLoading(true);
    try {
      const { data } = await Api.post(`${process.env.SERVER_URL}/api/v1/cv`, {
        ...cv,
        id: undefined,
        status: 'Pending',
        version: cv.version + 1,
      });
      console.log(data);
      setCV(data);
      UIkit.notification('Le profil a été mis à jour', {
        pos: 'bottom-center',
        status: 'info',
      });
    } catch (err) {
      console.error(err);
      UIkit.notification("Une erreur s'est produite", {
        pos: 'bottom-center',
        status: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };
  // aucun CV
  if (cv === null) {
    return (
      <>
        <Section>
          <div className="uk-width-1-1" data-uk-height-viewport="expand: true">
            <div
              className="uk-position-absolute uk-transform-center uk-text-center"
              style={{ left: '50%', top: '50%' }}
            >
              <h2 className="uk-text-bold">
                <span className="uk-text-primary">Aucun candidat</span>{' '}
                n&apos;est rattaché à ton compte coach.
              </h2>
              <p>
                Il peut y avoir plusieurs raisons à ce sujet. Contacte
                l&apos;équipe LinkedOut pour en savoir plus.
              </p>
              <Button
                style="primary"
                onClick={() =>
                  Api.post(`${process.env.SERVER_URL}/api/v1/cv`, {
                    userId: id,
                  }).then(({ data }) => setCV(data))
                }
              >
                Creer votre CV
              </Button>
            </div>
          </div>
        </Section>
      </>
    );
  }
  // erreur pendant la requete
  if (error) {
    return (
      <div className="uk-width-1-1" data-uk-height-viewport="expand: true">
        <div
          className="uk-position-absolute uk-transform-center uk-text-center"
          style={{ left: '50%', top: '50%' }}
        >
          <div className="ukuk-width-xlarge">
            <h2 className="uk-text-bold uk-margin-remove">{error}</h2>
            <p>
              Contacte{' '}
              <span className="uk-text-primary">l&apos;équipe LinkedOut</span>{' '}
              pour en savoir plus.
            </p>
          </div>
        </div>
      </div>
    );
  }
  // chargement
  if (cv === undefined) {
    return (
      <div className="uk-width-1-1" data-uk-height-viewport="expand: true">
        <div
          className="uk-position-absolute uk-transform-center uk-text-center"
          style={{ left: '50%', top: '50%' }}
        >
          <h2 className="uk-text-bold">loading ...</h2>
          <div data-uk-spinner />
        </div>
      </div>
    );
  }
  // affichage du CV
  return (
    <>
      <CVEditWelcome cv={cv} />
      <GridNoSSR between middle>
        <div>Statut : {translate(cv.status)}</div>
        <GridNoSSR>
          <Button style="default">Prévisualiser la page</Button>
          <Button
            style="primary"
            onClick={() => {
              if (!loading) submitCV();
            }}
          >
            <div className="uk-flex uk-flex-middle">
              Soumettre
              {loading ? (
                <div
                  className="uk-margin-small-left"
                  data-uk-spinner="ratio: .5"
                />
              ) : null}
            </div>
          </Button>
        </GridNoSSR>
      </GridNoSSR>
      <CVFicheEdition
        cv={cv}
        onChange={(fields) => {
          setCV({ ...cv, ...fields });
        }}
      />
    </>
  );
};

const Edit = () => {
  const { user } = useContext(UserContext);

  return (
    <LayoutBackOffice title="Edition du CV">
      <Section>
        <Content id={user.id} />
      </Section>
    </LayoutBackOffice>
  );
};
export default Edit;
