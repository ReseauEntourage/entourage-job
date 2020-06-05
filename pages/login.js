/* global UIkit */
import React, {useContext, useEffect, useRef} from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Section } from '../components/utils';
import schemaLogin from '../components/forms/schema/formLogin.json';
import schemaLostPwd from '../components/forms/schema/formLostPwd.json';
import FormWithValidation from '../components/forms/FormWithValidation';
import { UserContext } from '../components/store/UserProvider';
import Api from '../Axios';
import {USER_ROLES} from "../constants";
import StepperModal from "../components/modals/StepperModal";
import SuccessModalContent from "../components/modals/SuccessModalContent";

const Login = () => {
  const { login, user } = useContext(UserContext);
  const router = useRouter();

  const form = useRef(null);

  const resetForm = () => {
    form.current.resetForm();
  };

  useEffect(() => {
    if (user) {
      if (user.role === USER_ROLES.ADMIN) {
        router.push('/backoffice/admin/offres');
      }
      if (user.role === USER_ROLES.CANDIDAT || user.role === USER_ROLES.COACH) {
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
              formSchema={schemaLogin}
              onSubmit={({ email, password }, setError) => {
                login(email, password).catch(() => {
                  setError(
                    'Erreur de connexion. Identifiant ou mot de passe invalide.'
                  );
                });
              }}
            />
            <a
              className="uk-text-small uk-margin-remove"
              href="#"
              data-uk-toggle="target: #modal-lost-pwd"
            >
              Mot de passe oublié ?
            </a>
          </div>
        </div>
      </Section>
      <StepperModal
        id="modal-lost-pwd"
        title="Mot de passe oublié ?"
        resetForm={resetForm}
        composers={[
          (closeModal, nextStep) => (
            <FormWithValidation
              ref={form}
              submitText="Envoyer"
              formSchema={schemaLostPwd}
              onCancel={closeModal}
              onSubmit={(fields, setError) => {
                Api.post('/api/v1/auth/forgot', fields)
                  .then(() => nextStep())
                  .catch(() => setError("Une erreur s'est produite"));
              }}
            />
          ),
          (closeModal) => (
            <SuccessModalContent
              closeModal={closeModal}
              text="Un e-mail vient d'être envoyé à l'adresse indiquée."
            />
          ),
        ]}
      />
    </Layout>
  );
};

export default Login;
