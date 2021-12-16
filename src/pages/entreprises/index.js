import React from 'react';
import LogoList from 'src/components/partials/LogoList';
import WhatItBringsToCompanies from 'src/components/partials/WhatItBringsToCompanies';
import Layout from 'src/components/Layout';
import { Button, Section } from 'src/components/utils';
import ImageTitle from 'src/components/partials/ImageTitle';
import HireCTA from 'src/components/partials/HireCTA';
import Reviews from 'src/components/partials/Reviews';
import HowToCommitDifferently from 'src/components/partials/HowToCommitDifferently';
import NewsletterPartial from 'src/components/partials/NewsletterPartial';
import PARTNERS from 'src/constants/partners';
import ModalGeneric from 'src/components/modals/ModalGeneric';
import { IconNoSSR } from 'src/components/utils/Icon';
import { openModal } from 'src/components/modals/Modal';

const Entreprises = () => {
  return (
    <Layout title="Entreprises - LinkedOut">
      <ImageTitle
        img="static/img/header_pic_hire.jpg"
        id="hire-title"
        title={
          <>
            Entreprises,
            <br />
            <span className="uk-text-primary">recrutez avec LinkedOut</span>
          </>
        }
      />
      <Section id="makeADifference" style="muted" container="small">
        <h4 className="uk-align-center uk-text-center">
          Bienvenue chez LinkedOut. Ici, vous pouvez concilier vos besoins de
          recrutement et{' '}
          <span className="uk-text-bold">
            votre engagement pour l’inclusion
          </span>
          &nbsp;! Les candidats LinkedOut ont des histoires de vie difficiles.
          Ils ont tous un point commun&nbsp;:{' '}
          <span className="uk-text-bold">la capacité à travailler</span> et{' '}
          <span className="uk-text-bold">l’envie de s’en sortir</span>.<br />
          Vous pouvez <span className="uk-text-bold">changer leur vie</span> en
          les recrutant&nbsp;: alors qu’attendez-vous&nbsp;? L&apos;équipe
          LinkedOut{' '}
          <span className="uk-text-bold">
            vous accompagne à toutes les étapes.
          </span>
        </h4>
      </Section>
      <Section container="small">
        <h2 className="uk-text-center uk-text-bold">
          Vous souhaitez vous engager vers un recrutement{' '}
          <span className="uk-text-primary">plus inclusif&nbsp;?</span>
        </h2>
        <h4 className="uk-text-center uk-margin-remove-top">
          Contactez le référent LinkedOut de votre région pour échanger sur
          votre projet avant de vous lancer&nbsp;!
        </h4>
        <div className="uk-flex uk-flex-center">
          <Button
            onClick={() => {
              openModal(
                <ModalGeneric>
                  <iframe
                    className="airtable-embed"
                    src={`${process.env.AIRTABLE_LINK_COMPANY_HELP}?backgroundColor=blue`}
                    frameBorder="0"
                    title="modal-company-help"
                    width="100%"
                    height="533"
                    style={{
                      background: 'transparent',
                      border: '1px solid #ccc;',
                    }}
                  />
                </ModalGeneric>
              );
            }}
            style="secondary"
            className="uk-margin-small-top"
          >
            Contacter un référent&nbsp;
            <IconNoSSR name="chevron-right" />
          </Button>
        </div>
      </Section>
      <HireCTA />
      <WhatItBringsToCompanies />
      <Section style="muted">
        <h2 className="uk-text-center uk-text-bold">
          Ils ont <span className="uk-text-primary">déjà recruté</span>
        </h2>
        <LogoList logos={PARTNERS.hired} />
      </Section>
      <Reviews />
      <HowToCommitDifferently />
      <NewsletterPartial style="default" />
    </Layout>
  );
};

export default Entreprises;
