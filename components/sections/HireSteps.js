/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Section } from '../utils';
import TAGS from '../../constants/tags';
import MultipleCTA from '../partials/MultipleCTA';
import { event } from '../../lib/gtag';
import PostJobAdModal, { modalId } from '../modals/PostJobAdModal';

const HireSteps = () => {
  const content = [
    {
      img: '/static/img/illustrations/hire1.png',
      title: 'Repérez un candidat',
      text: (
        <div>
          Repérez le candidat LinkedOut qui correspond aux compétences que vous
          cherchez et envoyez-lui votre offre
        </div>
      ),
    },
    {
      img: '/static/img/illustrations/hire2.png',
      title: 'Le candidat vous recontacte',
      text: (
        <div>
          Le candidat étudie votre offre avec son bénévole-coach puis vous
          recontacte, vous le rencontrez
        </div>
      ),
    },
    {
      img: '/static/img/illustrations/hire3.png',
      title: 'LinkedOut vous accompagne',
      text: (
        <div>
          L&apos;équipe LinkedOut vous accompagne et vous donne les outils pour
          accueillir et intégrer au mieux le candidat
        </div>
      ),
    },
  ];

  return (
    <Section id="hireSteps" style="muted">
      <MultipleCTA data={content} showNumbers showHorizontalDividers animate />
      <p className="uk-text-bold uk-margin-medium-top uk-text-center">
        Votre offre peut concerner plusieurs candidats LinkedOut&nbsp;?{' '}
        <a
          style={{ textDecoration: 'underline' }}
          data-uk-toggle={`#${modalId}`}
          onClick={() => {
            return event(TAGS.PAGE_RECRUTER_DEPOSER_OFFRE_CLIC);
          }}
        >
          Publiez-la ici !
        </a>
      </p>
      <PostJobAdModal />
    </Section>
  );
};

export default HireSteps;
