import React from 'react';
import Layout from '../components/Layout';
import ImageTitle from "../components/sections/ImageTitle";
import HowToJoin from "../components/sections/HowToJoin";
import StepsToJoin from "../components/sections/StepsToJoin";
import Highlights from "../components/sections/Highlights";

const JeVeuxTravailler = () => {
  return (
    <Layout title="Je veux travailler - LinkedOut">
      <ImageTitle
        img='static/img/header_pic_work.jpg'
        id="work-title"
        title={<>Vous cherchez <span className="uk-text-primary">un travail ?</span></>}
        text="LinkedOut s’adresse à toute personne en situation d’exclusion ou de précarité, dans une démarche d’insertion professionnelle, motivée et en capacité de travailler." />
      <Highlights />
      <HowToJoin />
      <StepsToJoin />
    </Layout>
  );
};

export default JeVeuxTravailler;
