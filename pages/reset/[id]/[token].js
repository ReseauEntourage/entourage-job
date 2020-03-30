import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { Section, IconNoSSR } from '../../../components/utils';
import schema from '../../../components/forms/schema/formResetPassword.json';
import FormWithValidation from '../../../components/forms/FormWithValidation';
import Api from '../../../Axios';

const ResetPasswordPage = () => {
  const router = useRouter();

  const [valide, setValide] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.query.id && router.query.token) {
      Api.get(`/api/v1/auth/reset/${router.query.id}/${router.query.token}`)
        .then(() => {
          setValide(true);
          setLoading(false);
        })
        .catch(() => {
          console.log('Lien non valide');
          /* router.push('/login'); */
        });
    }
  });

  return (
    <Layout title="Réinitialisation de mot de passe - LinkedOut">
      <Section size="large" style="muted">
        <div className="uk-flex uk-flex-center">
          {loading && (
            <div className="uk-flex uk-flex-center">
              <div className="uk-text-center">
                <div data-uk-spinner />
              </div>
            </div>
          )}
          {valide ? (
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
          ) : (
            <div className="uk-card uk-card-body uk-text-center">
              <IconNoSSR name="ban" ratio={4} className="uk-text-primary" />
              <p className="uk-text-lead">
                Ce lien ne semble pas valide. Veuillez contacter l&apos;équipe
                Linkedout.
              </p>
              <button
                type="button"
                className="uk-button uk-button-primary"
                onClick={() => router.push('/')}
              >
                Retourner à l&apos;accueil
              </button>
            </div>
          )}
        </div>
      </Section>
    </Layout>
  );
};

export default ResetPasswordPage;
