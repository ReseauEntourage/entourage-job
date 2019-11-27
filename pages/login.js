import React, { useContext } from 'react';
import Router from 'next/router';
import Layout from '../components/Layout';
import { Section } from '../components/utils';
import schema from '../components/forms/schema/formLogin';
import FormWithValidation from '../components/forms/FormWithValidation';
import { UserContext } from '../components/store/UserProvider';

const Login = () => {
  const { login } = useContext(UserContext);
  return (
    <Layout title="Connexion - Entourage Jobs">
      <Section size="large" style="muted">
        <div className="uk-flex uk-flex-center">
          <div className="uk-width-1-2 uk-card uk-card-default uk-card-body">
            <h1>Connexion</h1>
            <FormWithValidation
              formData={schema}
              onSubmit={({ email, password }, setError) => {
                login(email, password)
                  .then(() => Router.push('/'))
                  .catch((error) => {
                    console.error(error);
                    setError("Une erreur s'est produite");
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
