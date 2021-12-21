import React from 'react';
import { Button, Grid, Section } from 'src/components/utils';
import { NewsletterPartial, SharePartial } from 'src/components/partials';
import { EXTERNAL_LINKS } from 'src/constants';
import Layout from 'src/components/Layout';
import ImageTitle from 'src/components/partials/ImageTitle';
import { event } from 'src/lib/gtag';
import TAGS from 'src/constants/tags';
import { IconNoSSR } from 'src/components/utils/Icon';

const Aider = () => {
  return (
    <Layout title="Aider - LinkedOut">
      <ImageTitle
        img="/static/img/header_pic_help.jpg"
        alt="vous souhaitez aider"
        id="help-title"
        title={
          <>
            Vous souhaitez <span className="uk-text-primary">aider&nbsp;?</span>
          </>
        }
      />
      <Section style="muted">
        <div className="uk-flex uk-flex-column uk-flex-middle uk-width-1-2@m uk-margin-auto">
          <h3 className="uk-text-bold uk-text-center">
            Partagez votre réseau avec ceux qui n’en n’ont pas
          </h3>
          <hr className="uk-divider-small uk-margin-remove-vertical" />
          <p className="uk-text-center uk-padding-small uk-padding-remove-top">
            Partager un CV dans vos réseaux donne une visibilité inédite à un
            candidat auprès de potentiels recruteurs et permet de générer des
            opportunités d’emploi. Votre partage peut tout changer&nbsp;!
          </p>
          <div className="uk-flex-center uk-flex uk-flex-middle">
            <Button
              href={{ pathname: '/candidats', query: { employed: false } }}
              style="secondary"
            >
              Partager un CV <IconNoSSR name="chevron-right" />
            </Button>
          </div>
        </div>
      </Section>
      <Section style="default">
        <div className="uk-flex uk-flex-column uk-flex-middle uk-width-1-2@m uk-margin-auto">
          <h3 className="uk-text-bold uk-text-center">
            Soutenez LinkedOut, faites un don
          </h3>
          <hr className="uk-divider-small uk-margin-remove-vertical" />
          <p className="uk-text-center uk-padding-small uk-padding-remove-top">
            Vous souhaitez soutenir financièrement le projet LinkedOut et
            participer à la construction d’une société plus inclusive.
          </p>
          <div className="uk-flex-center uk-flex uk-flex-middle">
            <Button
              href={EXTERNAL_LINKS.DONATION}
              isExternal
              newTab
              style="secondary"
              onClick={() => {
                return event(TAGS.PAGE_AIDER_DON_CLIC);
              }}
            >
              Faire un don&nbsp;
              <IconNoSSR name="chevron-right" />
            </Button>
          </div>
        </div>
      </Section>
      <Section style="muted">
        <div className="uk-flex uk-flex-column uk-flex-middle uk-width-1-2@m uk-margin-auto">
          <h3 className="uk-text-bold uk-text-center">
            Coacher un candidat vers l’emploi
          </h3>
          <hr className="uk-divider-small uk-margin-remove-vertical" />
          <p className="uk-text-center uk-padding-small uk-padding-remove-top">
            Vous souhaitez donner de votre temps pour tisser une relation de
            proximité avec un candidat et le coacher dans son retour à
            l’emploi&nbsp;? LinkedOut vous forme à la mission de coach et vous
            donne les outils.
          </p>
          <div className="uk-flex-center uk-flex uk-flex-middle">
            <Button
              href={EXTERNAL_LINKS.ARTICLE_BC}
              isExternal
              newTab
              style="secondary"
              onClick={() => {
                return event(TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC);
              }}
            >
              Devenir coach LinkedOut&nbsp;
              <IconNoSSR name="chevron-right" />
            </Button>
          </div>
        </div>
      </Section>
      <Section style="default">
        <Grid gap="large" column>
          <NewsletterPartial padding={false} />
          <SharePartial />
        </Grid>
      </Section>
    </Layout>
  );
};

export default Aider;
