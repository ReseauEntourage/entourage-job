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
  return status;
}

const toUpperFirstLetter = (text) => {
  if (typeof text !== 'string' || text === '') {
    return text;
  }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const Edit = () => {
  const { user } = useContext(UserContext);
  const [cv, setCV] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await Api.get(
          `${process.env.SERVER_URL}/api/v1/cv/edit`
        );
        setCV(data || null);
      } catch (err) {
        console.error(err);
        setError('Une erreur est survenue durant le chargement du CV');
      }
    })();
  }, []);

  const submitCV = () => {
    setLoading(true);

    Api.post(`${process.env.SERVER_URL}/api/v1/cv`, {
      ...cv,
      id: undefined,
      status: 'Pending',
      version: cv.version + 1,
    })
      .then((res) => {
        console.log(res);
        setCV(res.data);
        UIkit.notification('Le profil a été mis à jour', {
          pos: 'bottom-center',
          status: 'info',
        });
      })
      .catch((err) => {
        console.error(err);
        UIkit.notification("Une erreur s'est produite", {
          pos: 'bottom-center',
          status: 'danger',
        });
      })
      .finally(() => setLoading(false));
  };

  function content() {
    if (cv === null) {
      return (
        <>
          <CVEditNoCandidat />
          <Button
            onClick={() =>
              Api.post(`${process.env.SERVER_URL}/api/v1/cv`, {
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                gender: user.gender,
              }).then(({ data }) => setCV(data))
            }
          >
            Creer votre CV
          </Button>
        </>
      );
    }
    if (error) {
      return (
        <div className="uk-width-1-1" data-uk-height-viewport="expand: true">
          <div
            className="uk-position-absolute uk-transform-center uk-text-center"
            style={{ left: '50%', top: '50%' }}
          >
            <h2 className="uk-text-bold">{error}</h2>
          </div>
        </div>
      );
    }
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
                Publier
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
  }

  return (
    <LayoutBackOffice title="Edition du CV">
      <Section>{content()}</Section>
    </LayoutBackOffice>
  );
};
export default Edit;
