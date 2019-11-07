import React from 'react';
import Layout from '../components/Layout';
import { Section } from '../components/utils';
import FromLogin from '../components/forms/FormLogin';
import withValidation from '../components/forms/withValidation';
import rulesLogin from '../components/forms/rulesLogin';

const Login = () => {
  const FromLoginWithValidator = withValidation(
    FromLogin,
    rulesLogin,
    () => {},
    () => {
      console.log('logged');
    }
  );
  return (
    <Layout title="Connexion - Entourage Jobs">
      <Section size="large" style="muted">
        <div className="uk-flex uk-flex-center">
          <div className="uk-width-1-2 uk-card uk-card-default uk-card-body">
            <h1>Connexion</h1>
            <FromLoginWithValidator />
          </div>
        </div>
      </Section>
    </Layout>
  );
};
export default Login;
