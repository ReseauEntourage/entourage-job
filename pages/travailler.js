import React from 'react';
import { CONTACT_INFO } from '../constants';
import { Section, SimpleLink } from '../components/utils';
import Layout from '../components/Layout';
import ImageTitle from '../components/sections/ImageTitle';
import HowToJoin from '../components/sections/HowToJoin';
import StepsToJoin from '../components/sections/StepsToJoin';
import Highlights from '../components/sections/Highlights';
import CandidateTestimoniesOrientation from '../components/sections/CandidateTestimoniesOrientation';

const Travailler = () => {
  return (
    <Layout title="Travailler - LinkedOut">
      <ImageTitle
        img="static/img/header_pic_work.jpg"
        id="work-title"
        title={
          <>
            Vous cherchez <span className="uk-text-primary">du travail ?</span>
          </>
        }
        text="Vous êtes dans une situation de précarité ou d’exclusion ? Vous avez un projet professionnel mais vous n’avez pas de réseau ? Vous êtes motivé pour travailler mais il vous manque des opportunités ? Rejoignez le programme LinkedOut."
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
              Vous avez entre <span className="uk-text-bold">18 et 25 ans</span>{' '}
              et vous résidez à{' '}
              <span className="uk-text-bold">Paris, dans le 92 ou le 93</span>
              &nbsp;? Rejoignez le programme dès maintenant&nbsp;!
            </span>
            <br />
            <br />
            <span>
              Vous avez <span className="uk-text-bold">plus de 25 ans</span> et
              vous résidez à{' '}
              <span className="uk-text-bold">Paris, Lille ou Lyon</span>&nbsp;?
              Vous pourrez rejoindre la promotion de Septembre 2021.
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
            href={`tel:${CONTACT_INFO.MAIN_PHONE_NUMBER}`}
          >
            {CONTACT_INFO.MAIN_PHONE_NUMBER}
          </SimpleLink>
        </h4>
      </Section>
    </Layout>
  );
};

export default Travailler;
