import React from 'react';
import Layout from 'src/components/Layout';
import PARTNERS from 'src/constants/partners';
import Grid from 'src/components/utils/Grid';
import { Img, Section } from 'src/components/utils';
import { addPrefix, formatParagraph } from 'src/utils';
import Carousel from 'src/components/utils/Carousel';
import ModalInterestLinkedOut from 'src/components/modals/ModalInterestLinkedOut';
import SimpleSection from 'src/components/partials/SimpleSection';
import SimpleLink from 'src/components/utils/SimpleLink';
import { event } from 'src/lib/gtag';
import TAGS from 'src/constants/tags';
import { openModal } from 'src/components/modals/Modal';

const Partenaires = () => {
  const viewportHeightWithoutHeader = 'calc(100vh - 80px)';
  const viewportHeightWithoutHeaderAndPadding = 'calc(100vh - 220px)';

  const renderTitle = (title, overlay, inverse = false) => {
    return (
      <div
        className="uk-inline uk-cover-container uk-flex uk-flex-center uk-flex-middle"
        style={{ minHeight: viewportHeightWithoutHeader }}
      >
        <div
          className="uk-position-cover uk-background uk-background-cover uk-background-center-center"
          style={{
            backgroundImage: `url("${addPrefix('/static/img/partners.jpg')}")`,
          }}
          uk-scrollspy="cls: uk-animation-kenburns uk-animation-reverse; delay: 200;"
        />
        <div className={`uk-overlay-${overlay} uk-position-cover`} />
        <div className="uk-overlay uk-position-center">
          <Section
            style={inverse ? 'secondary' : 'default'}
            preserveColor
            className="uk-box-shadow-medium"
          >
            <div uk-scrollspy="cls: uk-animation-fade; delay: 200;">
              <h1 className="uk-text-bold uk-align-center uk-text-center uk-margin-remove">
                {title}
              </h1>
            </div>
          </Section>
        </div>
      </div>
    );
  };

  const renderPartner = (
    title,
    desc,
    question,
    answer,
    author,
    key,
    bis,
    link,
    index
  ) => {
    const reverse = index % 2 !== 0;
    const firstDirection = reverse ? 'left' : 'right';
    const secondDirection = reverse ? 'right' : 'left';
    return (
      <Section
        container="large"
        style={index % 2 === 0 ? 'muted' : 'default'}
        key={index}
      >
        <div
          className="uk-flex uk-flex-center uk-flex-middle"
          uk-scrollspy="target: .animate; cls: uk-animation-fade; delay: 200;"
          style={{ minHeight: viewportHeightWithoutHeaderAndPadding }}
        >
          <SimpleLink
            className="animate uk-flex uk-flex-column uk-flex-center uk-flex-middle"
            isExternal
            target="_blank"
            href={link}
          >
            <h2 className="uk-text-primary uk-text-center uk-text-bold uk-margin-large-bottom">
              {title}
            </h2>
            <Grid
              eachWidths={['1-3@m', '2-3@m']}
              match
              middle
              center
              gap="large"
              reverse={reverse}
            >
              <div className="uk-flex uk-flex-column uk-flex-middle uk-flex-center">
                <Img
                  src={`/static/img/partners/${key}/logo.png`}
                  width=""
                  height=""
                  alt=""
                />
                {bis && (
                  <Img
                    src={`/static/img/partners/${key}/logo_bis.png`}
                    width=""
                    height=""
                    alt=""
                  />
                )}
              </div>
              <div className="uk-flex uk-flex-column uk-flex-middle">
                <div
                  className="animate uk-flex uk-flex-column"
                  uk-scrollspy-class={`uk-animation-slide-${secondDirection}`}
                >
                  <h4
                    className={`${
                      answer ? 'uk-margin-medium-bottom' : ''
                    } uk-text-${secondDirection}`}
                  >
                    {formatParagraph(desc)}
                  </h4>
                </div>
                {answer && <hr className="uk-divider-small" />}
                {answer && (
                  <div
                    className={`uk-text-secondary animate uk-flex uk-flex-column uk-flex-stretch uk-margin-large-${secondDirection} uk-margin-medium-top`}
                    uk-scrollspy-class={`uk-animation-slide-${firstDirection}`}
                  >
                    {question && (
                      <p
                        className={`uk-flex-1 uk-text-${secondDirection} uk-text-bold`}
                      >
                        {question}
                      </p>
                    )}
                    <div className="uk-flex">
                      <div className="uk-flex uk-flex-top">
                        <Img
                          alt=""
                          width="27"
                          height="21"
                          src="/static/img/guillemets.png"
                          className="uk-margin-small-right"
                        />
                      </div>
                      <div className="uk-flex-1">
                        <p
                          className={`uk-text-${firstDirection} uk-text-italic uk-margin-small-top uk-margin-small-bottom`}
                        >
                          {answer}
                        </p>
                        {author && (
                          <div
                            className={`uk-flex-1 uk-text-${firstDirection} uk-margin-small-top uk-text-secondary`}
                          >
                            <span className="uk-text-bold">{author.name}</span>,
                            &nbsp;{author.status}
                          </div>
                        )}
                      </div>
                      <div className="uk-flex uk-flex-bottom">
                        <Img
                          alt=""
                          width="15"
                          height="12"
                          src="/static/img/guillemetsPetits.png"
                          className="uk-margin-small-left"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Grid>
          </SimpleLink>
        </div>
      </Section>
    );
  };

  return (
    <Layout title="Les partenaires - LinkedOut">
      {renderTitle(
        <>
          <span className="uk-light">
            <span className="uk-text-primary">Ils construisent le projet</span>
          </span>{' '}
          <span className="uk-text-primary">avec nous</span>
        </>,
        'default',
        true
      )}
      {PARTNERS.strategy.map(
        ({ title, desc, question, answer, author, key, bis, link }, index) => {
          return renderPartner(
            title,
            desc,
            question,
            answer,
            author,
            key,
            bis,
            link,
            index
          );
        }
      )}
      <div
        className="uk-inline uk-cover-container uk-flex uk-flex-center uk-flex-middle"
        style={{ minHeight: viewportHeightWithoutHeader }}
      >
        <div
          className="uk-position-cover uk-background uk-background-cover uk-background-center-center"
          style={{
            backgroundImage: `url(${addPrefix('/static/img/partners.jpg')})`,
          }}
          uk-scrollspy="cls: uk-animation-kenburns uk-animation-reverse; delay: 200;"
        />
        <div
          className="uk-overlay-primary uk-position-cover"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        />
        <div className="uk-overlay uk-position-center">
          <Section
            style="muted"
            preserveColor
            className="uk-box-shadow-medium uk-padding-large"
          >
            <div uk-scrollspy="cls: uk-animation-fade; delay: 200;">
              <h1 className="uk-text-bold uk-align-center uk-text-center">
                Ils nous donnent{' '}
                <span className="uk-text-primary">les moyens d&apos;agir</span>
              </h1>
              <div className="uk-width-expand">
                <div className="uk-container-small uk-flex uk-flex-center">
                  <div className="uk-width-large">
                    <Carousel containerClasses="uk-child-width-1-1">
                      {PARTNERS.finance.map(({ key, link }, index) => {
                        return (
                          <SimpleLink
                            isExternal
                            target="_blank"
                            href={link}
                            key={index}
                            className="uk-flex uk-flex-column uk-flex-middle uk-flex-center uk-padding-large"
                          >
                            <div className="uk-width-large uk-flex uk-flex-center uk-flex-middle">
                              <Img
                                src={`/static/img/partners/${key}/logo.png`}
                                width=""
                                height=""
                                alt=""
                                className="uk-height-max-small"
                              />
                            </div>
                          </SimpleLink>
                        );
                      })}
                    </Carousel>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
      {renderTitle(
        <>
          Ils se mobilisent <span className="uk-text-primary">à nos côtés</span>
        </>,
        'primary'
      )}
      {PARTNERS.associations.map(
        ({ title, desc, question, answer, author, key, bis, link }, index) => {
          return renderPartner(
            title,
            desc,
            question,
            answer,
            author,
            key,
            bis,
            link,
            index
          );
        }
      )}
      <SimpleSection
        title={
          <>
            Rejoignez <span className="uk-text-primary">LinkedOut&nbsp;!</span>
          </>
        }
        text="Vous êtes intéressé(e) par l’approche de LinkedOut et souhaitez coopérer avec nous ? Contactez-nous pour devenir partenaire !"
        id="give"
        style="muted"
        button={{
          label: 'Nous écrire',
          onClick: () => {
            openModal(<ModalInterestLinkedOut />);
            event(TAGS.PAGE_PARTENAIRES_NOUS_ECRIRE_CLIC);
          },
        }}
      />
    </Layout>
  );
};

export default Partenaires;
