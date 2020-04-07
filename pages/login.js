/* global UIkit */
import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Section } from '../components/utils';
import schema from '../components/forms/schema/formLogin';
import FormWithValidation from '../components/forms/FormWithValidation';
import { UserContext } from '../components/store/UserProvider';

const Login = () => {
  const { login, user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        router.push('/backoffice/admin/offres');
      }
      if (user.role === 'Candidat' || user.role === 'Coach') {
        router.push('/backoffice/candidat/offres');
      }
    }
  }, [user]);

  return (
    <Layout title="Connexion - LinkedOut">
      <Section size="large" style="muted">
        <div className="uk-flex uk-flex-center">
          <div className="uk-width-1-2@m uk-card uk-card-default uk-card-body">
            <h1>Connexion</h1>
            <FormWithValidation
              formSchema={schema}
              onSubmit={({ email, password }, setError) => {
                login(email, password).catch(() => {
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
  );
};

export default Login;
