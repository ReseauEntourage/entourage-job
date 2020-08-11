import React from 'react';
import Layout from '../components/Layout';
import PARTNERS from '../constants/partners';
import Grid from "../components/utils/Grid";
import {ImgNoSSR, Section} from "../components/utils";

const LesPartenaires = () => (
  <Layout title="Les partenaires - LinkedOut">
      <div className="uk-inline uk-cover-container uk-flex uk-flex-center uk-flex-middle" style={{height: 'calc(100vh - 80px)'}}>
        <div className="uk-animation-kenburns uk-animation-reverse uk-position-cover uk-background uk-background-cover uk-background-center-center" style={{backgroundImage: 'url(/static/img/partners.jpg)'}}/>
        <div className="uk-overlay-primary uk-position-cover" />
        <div className="uk-overlay uk-position-center">
          <Section style='default' className="uk-box-shadow-medium">
            <div uk-scrollspy="cls: uk-animation-fade; delay: 200;">
              <h1
                className="uk-text-bold uk-align-center uk-text-center uk-margin-remove">
                Ils construisent le projet <span className="uk-text-primary">avec nous</span>
              </h1>
            </div>
          </Section>
        </div>
      </div>
      {
        PARTNERS.strategy.map(({title, desc, question, answer, author, key, bis}, index) => {
          const reverse = index%2 !== 0;
          const firstDirection = reverse ? 'left' : 'right';
          const secondDirection = reverse ? 'right' : 'left';
          return (
            <Section container='large' style={index%2 === 0 ? 'muted' : 'default'}>
              <div uk-scrollspy="target: .animate; cls: uk-animation-fade; delay: 200;">
                <Grid
                  className="animate"
                  style={{minHeight: 'calc(100vh - 220px)'}}
                  eachWidths={['1-3@m', '2-3@m']}
                  match
                  middle
                  center
                  gap="large"
                  reverse={reverse}
                >
                  <div
                    className="uk-flex uk-flex-column uk-flex-middle uk-flex-center">
                    <img src={`/static/img/partners/${key}/logo.png`} width="" height="" alt="" />
                    {
                      bis &&
                      <img src={`/static/img/partners/${key}/logo_bis.png`} width="" height="" alt="" />
                    }
                  </div>
                  <div className="uk-flex uk-flex-column uk-flex-middle">
                    <h1
                      className="uk-text-primary uk-text-center uk-text-bold uk-margin-large-bottom">{title}</h1>
                    <div
                      className="animate uk-flex uk-flex-column"
                      uk-scrollspy-class={`uk-animation-slide-${secondDirection}`}>
                      <h3 className={`uk-margin-medium-bottom uk-text-${secondDirection}`}>{desc}</h3>
                    </div>
                    <hr className="uk-divider-small"/>
                    <div
                      className={`animate uk-flex uk-flex-column uk-flex-stretch uk-margin-large-${secondDirection} uk-margin-medium-top`}
                      uk-scrollspy-class={`uk-animation-slide-${firstDirection}`}>
                      {
                        question &&
                        <h4 className={`uk-flex-1 uk-text-${secondDirection} uk-text-bold`}>{question}</h4>
                      }
                      <div className="uk-flex">
                        <div className="uk-flex uk-flex-top">
                          <ImgNoSSR alt="" width="27" height="21" src="static/img/guillemets.png" className='uk-margin-small-right' />
                        </div>
                        <div className="uk-flex-1">
                          <h4 className={`uk-text-${firstDirection} uk-text-italic uk-margin-small-top uk-margin-small-bottom`}>
                            {answer}
                          </h4>
                          {
                            author &&
                            <div className={`uk-flex-1 uk-text-${firstDirection} uk-margin-small-top`}><span className="uk-text-bold">{author.name}</span>, {author.status}</div>
                          }
                        </div>
                        <div className="uk-flex uk-flex-bottom">
                          <ImgNoSSR alt="" width="15" height="12" src="static/img/guillemetsPetits.png" className='uk-margin-small-left' />
                        </div>
                      </div>

                    </div>
                  </div>
                </Grid>
              </div>
            </Section>
          );
        })
      }
      <Grid
        childWidths={[`1-${PARTNERS.strategy.length}@m`]}
        match
        middle
        items={PARTNERS.strategy.map(({key, bis}, index) => {
          return (
            <>
              <div className="uk-width-small">
                <img src={`/static/img/partners/${key}/small.png`} width="" height="" alt="" />
              </div>
              {
                bis &&
                <div className="uk-width-small">
                  <img src={`/static/img/partners/${key}/small_bis.png`} width="" height="" alt="" />
                </div>
              }
            </>
          );
        })}
      />
    {/*  <h4
        className="uk-text-primary uk-text-bold uk-margin-large-top">
        Avec le soutien précieux de
      </h4>
      <Grid
        childWidths={[`1-${PARTNERS.finance.length}@m`]}
        match
        middle
        items={PARTNERS.finance.map(({key}, index) => {
          return (
            <div className="uk-width-small">
              <img src={`/static/img/partners/${key}/small.png`} width="" height="" alt="" />
            </div>
          );
        })}
      />*/}
  </Layout>
);


export default LesPartenaires;
