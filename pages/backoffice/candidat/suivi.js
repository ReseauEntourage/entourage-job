/* global UIkit */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useContext, useEffect, useState } from 'react';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import axios from '../../../Axios';
import { Section, GridNoSSR, Button } from '../../../components/utils';
import { UserContext } from '../../../components/store/UserProvider';
import HeaderBackoffice from '../../../components/headers/HeaderBackoffice';

const Suivi = () => {
  const { user } = useContext(UserContext);
  const [defaultValue, setDefaultValue] = useState('');
  const [labelClass, setLabelClass] = useState('');
  const [value, setValue] = useState();

  const updateValue = (text) => {
    setLabelClass(text.length > 0 && ' stay-small');
    setValue(text);
  };
  const updateSuivi = (text) => {
    axios
      .put('/api/v1/...', {
        text,
      })
      .then(() => {
        UIkit.notification('Mis à jour', 'success');
      })
      .catch(() => {
        UIkit.notification('Erreur lors de la mise à jour du suivi', 'danger');
      });
  };

  useEffect(() => {
    if (user) {
      axios
        .get('/api/v1/...')
        .then(({ data }) => {
          setDefaultValue(data.text);
          updateValue(data.text);
        })
        .catch(() => {
          UIkit.notification('Erreur lors du chargement du suivi', 'danger');
        });
    }
  }, [user]);

  if (!user) return null;
  return (
    <LayoutBackOffice title="Mon suivi">
      <Section>
        <HeaderBackoffice
          title="Mon suivi"
          description="Vous pouvez prendre des notes sur la progression de vos recherches, noter vos différents rendez-vous, etc. Profitez de cet espace d'écriture libre qui vous est dédié."
        />
        <div className="uk-form-controls uk-padding-small uk-padding-remove-left uk-padding-remove-right">
          <label
            className={`uk-form-label ${labelClass}`}
            htmlFor="textarea-suivi"
          >
            Mon suivi
          </label>
          <textarea
            id="textarea-suivi"
            name="text"
            rows={10}
            placeholder="Tapez votre texte"
            // maxLength={maxLength}
            value={value}
            onChange={(event) => updateValue(event.target.value)}
            className="uk-textarea uk-form-large"
          />
        </div>
        <GridNoSSR>
          <Button
            style="default"
            onClick={() => {
              updateValue(defaultValue);
            }}
          >
            Annuler
          </Button>
          <Button
            style="primary"
            onClick={({ text }) => {
              updateSuivi(text);
            }}
          >
            Sauvegarder
          </Button>
        </GridNoSSR>
      </Section>
    </LayoutBackOffice>
  );
};
export default Suivi;
