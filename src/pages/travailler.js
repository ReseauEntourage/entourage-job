import React from 'react';
import { CONTACT_INFO } from 'src/constants';
import { Section, SimpleLink } from 'src/components/utils';
import Layout from 'src/components/Layout';
import ImageTitle from 'src/components/partials/ImageTitle';
import HowToJoin from 'src/components/partials/HowToJoin';
import StepsToJoin from 'src/components/partials/StepsToJoin';
import Highlights from 'src/components/partials/Highlights';
import CandidateTestimoniesOrientation from 'src/components/partials/CandidateTestimoniesOrientation';

const Travailler = () => {
  return (
    <Layout title="Travailler - LinkedOut">
      <ImageTitle
        img="static/img/header_pic_work.jpg"
        id="work-title"
        title={
          <>
            Vous cherchez{' '}
            <span className="uk-text-primary">du travail&nbsp;?</span>
          </>
        }
        text={
          <>
            <span>
              Vous êtes dans une situation de précarité ou d’exclusion&nbsp;?
            </span>
            <br />
            <span>
              Vous avez un projet professionnel mais vous n’avez pas de
              réseau&nbsp;?
            </span>
            <br />
            <span>
              Vous êtes motivé pour travailler mais il vous manque des
              opportunités&nbsp;?
            </span>
            <br />
            <span>Rejoignez le programme LinkedOut.</span>
          </>
        }
      />
      <Section id="introWork" container="small" style="muted">
        <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <h4
            className="uk-align-center uk-text-center"
            uk-scrollspy="cls:uk-animation-slide-bottom; target: > span; delay: 200;"
          >
            <span>
              LinkedOut vous propose{' '}
              <span className="uk-text-bold uk-text-primary">
                un parcours sur 6 mois
              </span>{' '}
              pour vous aider à trouver un emploi.
            </span>
            <br />
            <br />
            <span>
              Candidatez au programme à Paris, dans le 92 et 93, à Lille et
              Lyon.
            </span>
          </h4>
        </div>
      </Section>
      <Highlights />
      <HowToJoin />
      <StepsToJoin />
      <CandidateTestimoniesOrientation style="muted" />
      <Section className="uk-padding-remove-top" style="muted">
        <h4 className="uk-text-center">
          Si vous avez des questions, écrivez-nous à <br />
          <SimpleLink
            isExternal
            className="uk-link-text uk-text-primary"
            target="_blank"
            rel="noopener"
            href={`mailto:${process.env.MAILJET_CONTACT_EMAIL}`}
          >
            {process.env.MAILJET_CONTACT_EMAIL}
          </SimpleLink>{' '}
          ou appelez nous au{' '}
          <SimpleLink
            isExternal
            className="uk-link-text uk-text-primary"
            target="_blank"
            rel="noopener"
            href={`tel:${CONTACT_INFO.MOBILE_PHONE_NUMBER}`}
          >
            {CONTACT_INFO.MOBILE_PHONE_NUMBER}
          </SimpleLink>
        </h4>
      </Section>
    </Layout>
  );
};

export default Travailler;
