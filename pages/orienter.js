/* global UIkit */

import React from 'react';
import Layout from '../components/Layout';
import {IconNoSSR, Section, SimpleLink} from "../components/utils";
import SimpleSection from "../components/sections/SimpleSection";
import Img from "../components/utils/Img";
import MultipleCTA from "../components/partials/MultipleCTA";
import Button from "../components/utils/Button";
import ModalEdit from "../components/modals/ModalEdit";
import schemaGetEmail from '../components/forms/schema/formGetEmail.json';
import Axios from "../Axios";
import ImageTitle from "../components/sections/ImageTitle";
import Carousel from "../components/utils/Carousel";
import PARTNERS from "../constants/partners";
import ModalInterestLinkedOut from "../components/modals/ModalInterestLinkedOut";

const Orienter = () => {

  return (
    <Layout title="Orienter - LinkedOut">
      <ImageTitle
        img='static/img/header_pic_guide.jpg'
        id="guide-title"
        title={<>Vous souhaitez nous <span className="uk-text-primary">orienter des candidats&nbsp;?</span></>} />
      <SimpleSection
        title={<>LinkedOut, un programme de <span className="uk-text-primary">l&apos;association Entourage</span></>}
        text="Avec l’association Entourage, chaque citoyen est appelé à changer son regard et son comportement envers les personnes isolées et en précarité, pour leur redonner estime de soi et chaleur humaine. Et ce, en complémentarité du travail de l’action sociale. LinkedOut est né dans cette même veine, pour favoriser l’inclusion professionnelle des “exclus” par la mobilisation de tout un chacun."
        id="entourage"
        style='muted'
        fontSize='small'>
        <div className="uk-width-medium uk-padding uk-padding-remove-vertical">
          <Img src='../static/img/logo-entourage.png' alt='Logo Entourage' />
        </div>
      </SimpleSection>
      <SimpleSection
        style="default"
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
            <li>
              Ils sont en <span className="uk-text-bold uk-text-primary">situation d’exclusion</span> ou de <span className="uk-text-bold uk-text-primary">précarité</span>&nbsp;;
            </li>
            <hr className="uk-divider-small"/>
            <li>
              Ils sont en <span className="uk-text-bold uk-text-primary">capacité</span> de travailler et sont éligibles à un contrat de travail en France&nbsp;;
            </li>
            <hr className="uk-divider-small"/>
            <li>
              Et sont <span className="uk-text-bold uk-text-primary">motivés</span> pour retrouver un emploi.
            </li>
          </ul>
        </h3>
      </SimpleSection>
      <SimpleSection
        style="muted"
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
          href: `${process.env.AWSS3_URL}${process.env.KIT_FILE}`,
          external: true,
          newTab: true
        }}
        id="howItWorks"
        fontSize="small">
        <MultipleCTA
          className="uk-margin-large-top"
          spacing='medium'
          data={[
            {
              title: "Vous accompagnez une personne en démarche d'insertion professionnelle\xa0?",
              button: {
                label: "Nous l'orienter",
                href: process.env.AIRTABLE_LINK_PROFESSIONAL_REINTEGRATION,
                external: true
              }
            },
            {
              title: "Vous souhaitez coopérer avec LinkedOut\xa0?",
              button: {
                label: "Nous écrire",
                modal: "target: #modal-interest-linkedOut"
              }
            }
          ]}
          showVerticalDividers/>
      </SimpleSection>
      <Section style="default" container="small">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
          <span className="uk-text-primary">LinkedOut</span>, c&apos;est aussi&nbsp;:
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
        <div className="uk-margin-large-top uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <hr className="uk-divider-small uk-margin-remove"/>
          <h3 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-top uk-margin-small-bottom">
            Vous souhaitez être informé de l’ouverture de la prochaine promotion LinkedOut&nbsp;?
          </h3>
          <Button
            style="secondary"
            className="uk-margin-medium-top"
            toggle="#modal-get-info">
            S&apos;abonner à la newsletter&nbsp;<IconNoSSR name="chevron-right" />
          </Button>
        </div>
      </Section>
      <Section style="muted" container="small">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top uk-width-1-2@m">
          <span className="uk-text-primary">Ils nous ont orienté</span> des candidats
        </h2>
        <div className="uk-width-expand">
          <div className="uk-container-small">
            <Carousel containerClasses="uk-child-width-1-1">
              {PARTNERS.associations.map(({key, link}, index) => {
                return (
                  <SimpleLink
                    isExternal
                    target="_blank"
                    href={link}
                    key={index}
                    className="uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-padding-large">
                    <div className="uk-width-large uk-flex uk-flex-center uk-flex-middle">
                      <img src={`/static/img/partners/${key}/logo.png`} width="" height="" alt="" className='uk-height-max-small' />
                    </div>
                  </SimpleLink>
                )
              })}
            </Carousel>
          </div>
        </div>
      </Section>
      <div>
        <ModalEdit
          formSchema={schemaGetEmail}
          onSubmit={({email}, closeModal) => {
            Axios.post('/api/v1/cv/share', { email })
              .then(() => {
                closeModal();
                UIkit.notification('Votre inscription à la newsletter a bien été prise en compte !', 'success');
              })
              .catch(() =>
                UIkit.notification('Une erreur est survenue', 'danger')
              );
          }}
          title="S'abonner à la newsletter LinkedOut"
          submitText="S'abonner"
          id='modal-get-info' />
      </div>
      <ModalInterestLinkedOut />
    </Layout>
  )
};


export default Orienter;
