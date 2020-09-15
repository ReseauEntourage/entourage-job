/* global UIkit */
import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Section } from '../components/utils';
import schemaLogin from '../components/forms/schema/formLogin.json';
import schemaLostPwd from '../components/forms/schema/formLostPwd.json';
import FormWithValidation from '../components/forms/FormWithValidation';
import { UserContext } from '../components/store/UserProvider';
import Api from '../Axios';
import { USER_ROLES } from "../constants";
import StepperModal from "../components/modals/StepperModal";
import SuccessModalContent from "../components/modals/SuccessModalContent";
import { ModalContext } from '../components/store/ModalProvider';

const Login = () => {
  const {
    close,
    setClose,
    next,
    form,
  } = useContext(ModalContext);
  const { login, user } = useContext(UserContext);
  const router = useRouter();

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
              submitText="Se connecter"
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
      <div>
        <StepperModal
          id="modal-lost-pwd"
          title="Mot de passe oublié ?"
          components={[
            <FormWithValidation
              ref={form}
              submitText="Se connecter"
              formSchema={schemaLostPwd}
              onCancel={() => setClose(true)}
              onSubmit={(fields, setError) => {
                Api.post('/api/v1/auth/forgot', { email: email.toLowerCase() })
                  .then(() => next)
                  .catch(() => setError("L'adresse mail ne correspond à aucun utilisateur"));
              }}
            />,
            <SuccessModalContent
              text="Un e-mail vient d'être envoyé à l'adresse indiquée."
            />,
          ]}
        />
      </div>
    </Layout>
  );
};

export default Login;
