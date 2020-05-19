import React from 'react';
import Layout from '../components/Layout';
import {Button, GridNoSSR, Section} from '../components/utils';
import HowItWorks from '../components/sections/HowItWorks';
import {ContactPartial, DiscoverPartial, SharePartial} from '../components/partials';
import SituationCard from '../components/cards/SituationCard';
import ModalContactUs from '../components/modals/ModalContactUs';
import ImageTitle from "../components/sections/ImageTitle";
import SubHeader from "../components/sections/SubHeader";
import MultipleCTA from "../components/sections/MultipleCTA";
import SimpleCTA from "../components/sections/SimpleCTA";
import HowToJoin from "../components/sections/HowToJoin";
import StepsToJoin from "../components/sections/StepsToJoin";

const JeVeuxTravailler = () => {
  const ccm = [
    {
      description: "Contactez-nous et recevez de l'aide.",
      imgSrc: '/static/img/illustrations/entourage_meet.png',
    },
    {
      description: 'Vous êtes coachés pour retrouver un poste.',
      imgSrc: '/static/img/illustrations/entourage_coaching.png',
    },
    {
      description: 'Nous vous aidons à créer un CV clair et convaincant.',
      imgSrc: '/static/img/illustrations/entourage_papers.png',
    },
    {
      description: 'Vous augmentez les chances de vous faire repérer.',
      imgSrc: '/static/img/illustrations/entourage_phone.png',
    },
  ];

  return (
    <Layout title="Je veux travailler - LinkedOut">
      <ImageTitle id="work-title" title={<>Vous cherchez <span className="uk-text-primary">un travail ?</span></>} text="LinkedOut s’adresse à toute personne en situation d’exclusion ou de précarité, dans une démarche d’insertion professionnelle, motivée et en capacité de travailler." />
      <HowToJoin />
      <StepsToJoin />
    </Layout>
  );
};

export default JeVeuxTravailler;
