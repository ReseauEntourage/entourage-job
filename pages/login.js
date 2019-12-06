import React, { useContext } from 'react';
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
              formSchema={schema}
              onSubmit={({ email, password }, setError) => {
                login(email, password)
                  .then(() => console.log('Connexion réussie'))
                  .catch((error) => {
                    console.error(error);
                    setError(error);
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
