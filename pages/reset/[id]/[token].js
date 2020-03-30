import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { Section } from '../../../components/utils';
import schema from '../../../components/forms/schema/formResetPassword.json';
import FormWithValidation from '../../../components/forms/FormWithValidation';
import Api from '../../../Axios';

const ResetPasswordPage = () => {
  const router = useRouter();

  const [valide, setValide] = useState(false);

  useEffect(() => {
    Api.get(`/api/v1/auth/reset/${router.query.id}/${router.query.token}`)
      .then(() => setValide(true))
      .catch(() => {
        console.log('Lien non valide');
        router.push('/login');
      });
  });

  return valide ? (
    <Layout title="Réinitialisation de mot de passe - LinkedOut">
      <Section size="large" style="muted">
        <div className="uk-flex uk-flex-center">
          <div className="uk-width-1-2@m uk-card uk-card-default uk-card-body">
            <h1>Réinitialisation de mot de passe</h1>
            <FormWithValidation
              formSchema={schema}
              onSubmit={({ newPassword, confirmPassword }, setError) => {
                Api.post(
                  `/api/v1/auth/reset/${router.query.id}/${router.query.token}`,
                  { newPassword, confirmPassword }
                )
                  .then(() => {
                    router.push('/login');
                  })
                  .catch(() => {
                    setError(
                      'Erreur de connexion. Identifiant ou mot de passe invalide.'
                    );
                  });
              }}
            />
          </div>
        </div>
      </Section>
    </Layout>
  ) : (
    <div className="uk-text-center">
      <div data-uk-spinner />
    </div>
  );
};

export default ResetPasswordPage;
