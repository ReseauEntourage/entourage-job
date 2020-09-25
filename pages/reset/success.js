import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import {Section, IconNoSSR, Button} from '../../components/utils';

const ResetSuccessPage = () => {
  const router = useRouter();

  return (
    <Layout title="Réinitialisation de mot de passe - LinkedOut">
      <Section size="large" style="muted">
        <div className="uk-flex uk-flex-center">
          <div className="uk-card uk-card-body uk-text-center">
            <IconNoSSR name="check" ratio={4} className="uk-text-primary" />
            <p className="uk-text-lead">
              Votre mot de passe a bien été réinitialisé.
            </p>
            <div className="uk-flex uk-flex-center">
              <Button
                style='primary'
                onClick={() => router.push('/login')}
              >
                Se connecter
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default ResetSuccessPage;
