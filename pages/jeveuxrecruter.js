import React from 'react';
import Layout from '../components/Layout';
import { Section, IconNoSSR } from '../components/utils';
import { DiscoverPartial } from '../components/partials';
import ImageTitle from "../components/sections/ImageTitle";
import HireSteps from "../components/sections/HireSteps";
import WhatItBrings from "../components/sections/WhatItBrings";
import WaysToJoin from "../components/sections/WaysToJoin";

const JeVeuxRecruter = () => {

  return (
    <Layout title="Je veux recruter - LinkedOut">
      <ImageTitle
        img='static/img/header_pic_hire.jpg'
        id="hire-title"
        title={<>Vous souhaitez <span className="uk-text-primary">recruter un candidat LinkedOut ?</span></>}
        text={"La précarité et l'exclusion n'empêchent pas le talent\xa0!"} />
      <Section
        id="makeADifference"
        style="muted"
        container="small">
        <h4 className="uk-align-center uk-text-center">
          Recruteurs, plus qui quiconque, faites la différence&nbsp;! Soyez des acteurs essentiels du projet LinkedOut en donnant la chance à un ou plusieurs candidats correspondant aux compétences que vous recherchez.
        </h4>
      </Section>
      <Section
        id="whereTheyComeFrom"
        style="default">
        <div className="uk-flex uk-flex-column uk-flex-middle">
          <div className="uk-container-small uk-flex uk-flex-column uk-flex-middle">
            <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-small-bottom uk-margin-remove-top">
              D&apos;où viennent les candidats <span className="uk-text-primary">LinkedOut&nbsp;?</span>
            </h2>
            <h3 className="uk-align-center uk-text-center">
              LinkedOut s&apos;adresse à des profils diversifiés ayant comme points communs la capacité et la motivation pour travailler&nbsp;:
            </h3>
          </div>
        </div>
        <div className="uk-margin-medium-top">
          <img src="../static/img/candidats.jpg" alt="" />
            <div className="uk-background-primary uk-light uk-padding uk-flex uk-flex-center">
              <div className="uk-container-small">
                <h4 className="uk-align-center uk-text-center uk-margin-remove">
                  <IconNoSSR name="triangle-right"/>Personnes ayant connu des parcours de rue
                  <br/>
                  <br/>
                  <IconNoSSR name="triangle-right"/>Personnes accueillies dans des structures d&apos;hébergement temporaire (hôtels sociaux, centres d&apos;hébergement d&apos;urgence, etc.)
                  <br/>
                  <br/>
                  <IconNoSSR name="triangle-right"/>Personnes sortant de parcours d&apos;insertion, jeunes en précarité&nbsp;...
                </h4>
              </div>
            </div>
        </div>
      </Section>
      <WaysToJoin />
      <HireSteps />
      <WhatItBrings />
      {/*
        TODO Unhide when we'll have real testimonies
        <Reviews />
      */}
      <DiscoverPartial style='default'/>
    </Layout>
  );
};

export default JeVeuxRecruter;
