import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../components/Layout';
import {IconNoSSR, Section, SimpleLink} from "../components/utils";
import Grid from "../components/utils/Grid";
import SimpleSection from "../components/sections/SimpleSection";
import Img from "../components/utils/Img";
import MultipleCTA from "../components/partials/MultipleCTA";
import Button from "../components/utils/Button";

const Chapter = ({title, content, imgSrc, style, animate, direction}) => {
  return (
    <Section container={direction !== 'column' ? 'large' : 'small'} style={style}>
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top uk-width-1-2@m">
          {title}
        </h2>
        <Grid
          childWidths={[`1-${direction !== 'column' ? '2' : '1'}@m`]}
          center
          middle
          gap='large'
          className={direction === 'left' ? 'uk-flex-row-reverse' : ''}>
          <h4 className="uk-margin-remove-top">
            {content}
          </h4>
          <div className="uk-overflow-hidden uk-flex uk-flex-center uk-flex-middle">
            {animate ?
              <img
                uk-scrollspy="cls: uk-animation-kenburns; delay: 200;"
                src={imgSrc}
                width=""
                height=""
                alt=""
                className="uk-animation-reverse"
                style={{maxHeight: 600}} />
              :
              <img
                src={imgSrc}
                width=""
                height=""
                alt=""
                style={{maxHeight: 600}} />
            }
          </div>
        </Grid>

      </div>
    </Section>
  )
};

Chapter.propTypes = {
  title: PropTypes.element.isRequired,
  content: PropTypes.element.isRequired,
  imgSrc: PropTypes.string.isRequired,
  style: PropTypes.oneOf(['muted', 'default']).isRequired,
  direction: PropTypes.oneOf(['left', 'right', 'column']).isRequired,
  animate: PropTypes.bool.isRequired,
};


const JeVeuxOrienter = () => {

  return (
    <Layout title="Je veux orienter ? - LinkedOut">
      <SimpleSection
        title={<>LinkedOut, un programme de <span className="uk-text-primary">l&apos;association Entourage</span></>}
        text={
          <>
            Avec l’association Entourage, chaque citoyen est appelé à changer son regard et son comportement envers les personnes isolées et en précarité, pour leur redonner estime de soi et chaleur humaine. Et ce, en complémentarité du travail de l’action sociale. LinkedOut est né dans cette même veine, pour favoriser l’inclusion professionnelle des “exclus” par la mobilisation de tout un chacun.
          </>
        }
        id="entourage"
        style='default'>
        <div className="uk-width-medium uk-padding uk-padding-remove-vertical">
          <Img src='../static/img/logo-entourage.png' alt='Logo Entourage' />
        </div>
      </SimpleSection>
      <SimpleSection
        style="muted"
        container="large"
        title={<>Quels sont les <span className="uk-text-primary">points communs</span> des candidats LinkedOut&nbsp;?</>}
        text={
          <>
            <Img src='../static/img/candidats.jpg' alt='' className="uk-padding-large uk-padding-remove-vertical"/>
          </>
        }
        id="common">
        <h3 className="uk-margin-remove uk-align-center uk-text-center ">
          <ul
            uk-scrollspy="cls:uk-animation-slide-bottom; target: > li, hr; delay: 200;"
            className="uk-list uk-list-primary uk-margin-remove">
            <li className="uk-text-primary">
              <span className="uk-text-secondary">Ils sont en <span className="uk-text-bold uk-text-primary">situation d’exclusion</span> ou de <span className="uk-text-bold uk-text-primary">précarité</span>&nbsp;;</span></li>
            <hr className="uk-divider-small"/>
            <li className="uk-text-primary">
              <span className="uk-text-secondary">Ils sont en <span className="uk-text-bold uk-text-primary">capacité</span> de travailler et sont éligibles à un contrat de travail en France&nbsp;;</span>
            </li>
            <hr className="uk-divider-small"/>
            <li className="uk-text-primary">
              <span className="uk-text-secondary">Et sont <span className="uk-text-bold uk-text-primary">motivés</span> pour retrouver un emploi.</span>
            </li>
          </ul>
        </h3>
      </SimpleSection>
      <SimpleSection
        style="default"
        title={<><span className="uk-text-primary">Comment</span> ça marche&nbsp;?</>}
        text={
          <>
            Le dispositif LinkedOut est un tremplin vers l’emploi, qui s’inscrit dans la continuité de l’accompagnement socio-professionnel réalisé en amont par les associations et structures d’insertion.
            <br />
            <br />
            Le site <span className="uk-text-bold"><SimpleLink href="/">www.linkedout.fr</SimpleLink></span> permet à chaque citoyen de partager le CV d’un candidat LinkeOut sur son propre réseau LinkedIn, Facebook, Twitter... pour le rendre visible auprès de potentiels recruteurs et déclencher de nouvelles opportunités d’emploi.
          </>
        }
        button={{
          label: "Télécharger le kit du dispositif",
          modal: ""
        }}
        id="howItWorks" />
      <Section id="also" style="muted" container="small">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
          <span className="uk-text-primary">LinkedOut&nbsp;?</span> c&apos;est aussi&nbsp;:
        </h2>
        <MultipleCTA data={[
          {
            img: '/static/img/illustrations/how2.png',
            text: <div>Un soutien moral <span className="uk-text-bold">par un bénévole-coach</span> pendant la recherche d’emploi et après l’intégration en entreprise.</div>,
          },
          {
            img: '/static/img/illustrations/how3.png',
            text: <div><span className="uk-text-bold">Des formations courtes</span> à la carte proposées par nos partenaires associatifs (entretiens, numérique...)</div>,
          },
          {
            img: '/static/img/illustrations/how4.png',
            text: <div>La chaleur humaine de la <span className="uk-text-bold">communauté Entourage</span>, réseau d’entraide et de bienveillance pour entourer le candidat.</div>,
          },
        ]}
        animate />
        <hr className="uk-divider-small"/>
        <div className="uk-flex uk-flex-top uk-flex-center uk-padding-small">
          <Button
            style="secondary"
            className="uk-margin-medium-top"
            isExternal
            href={process.env.AIRTABLE_LINK_JOIN_LINKEDOUT}
          >Je souhaite être informé de l’ouverture de la prochaine promotion LinkedOut<IconNoSSR name="chevron-right" /></Button>
        </div>
      </Section>
    </Layout>
  )
};


export default JeVeuxOrienter;
