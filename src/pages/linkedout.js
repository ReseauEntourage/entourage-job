import React from 'react';
import PropTypes from 'prop-types';
import Layout from 'src/components/Layout';
import { Section, SimpleLink } from 'src/components/utils';
import Grid from 'src/components/utils/Grid';
import Img from 'src/components/utils/Img';

const Chapter = ({ title, content, imgSrc, style, animate, direction }) => {
  return (
    <Section
      container={direction !== 'column' ? 'large' : 'small'}
      style={style}
    >
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top uk-width-1-2@m">
          {title}
        </h2>
        <Grid
          childWidths={[`1-${direction !== 'column' ? '2' : '1'}@m`]}
          center
          middle
          gap="large"
          className={direction === 'left' ? 'uk-flex-row-reverse' : ''}
        >
          <h4 className="uk-margin-remove-top">{content}</h4>
          <div className="uk-overflow-hidden uk-flex uk-flex-center uk-flex-middle">
            {animate ? (
              <div uk-scrollspy="cls: uk-animation-kenburns; delay: 200; target: > img;">
                <Img
                  src={imgSrc}
                  width=""
                  height="600px"
                  alt=""
                  className="uk-animation-reverse uk-height-max-large"
                />
              </div>
            ) : (
              <Img
                src={imgSrc}
                width=""
                height="600px"
                alt=""
                className="uk-height-max-large"
              />
            )}
          </div>
        </Grid>
      </div>
    </Section>
  );
};

Chapter.propTypes = {
  title: PropTypes.element.isRequired,
  content: PropTypes.element.isRequired,
  imgSrc: PropTypes.string.isRequired,
  style: PropTypes.oneOf(['muted', 'default']).isRequired,
  direction: PropTypes.oneOf(['left', 'right', 'column']).isRequired,
  animate: PropTypes.bool.isRequired,
};

const Card = ({ text, number }) => {
  return (
    <div
      key={number}
      uk-scrollspy={`cls:uk-animation-slide-bottom-small; delay: ${
        100 * number
      };`}
      className="uk-flex uk-card uk-card-small uk-card-primary uk-card-body uk-box-shadow-medium"
    >
      <div
        className="uk-text-bold uk-text-primary uk-text-large uk-margin-small-right"
        style={{ fontSize: 46, lineHeight: 1 }}
      >
        {number}
      </div>
      <div className="uk-text-primary uk-margin-small-left">{text}</div>
    </div>
  );
};

Card.propTypes = {
  text: PropTypes.element.isRequired,
  number: PropTypes.number.isRequired,
};

const innovations = [
  {
    text: (
      <div>
        Une approche différente, fondée sur l’humain&nbsp;: assumer les parcours
        de vie compliqués des candidats et leur permettre de se présenter tels
        qu’ils sont, en valorisant leur qualités et compétences, plutôt que de
        camoufler les “trous” dans le CV.
      </div>
    ),
  },
  {
    text: (
      <div>
        Parler à la fibre solidaire des recruteurs&nbsp;: l’inclusion des
        personnes exclues ou précaires dans la société est la responsabilité de
        tous, et les entreprises, plus que quiconques, ont un rôle à
        jouer&nbsp;!
      </div>
    ),
  },
  {
    text: (
      <div>
        Une méthode de mobilisation inédite des citoyens et des recruteurs, via
        la communication grand public et la viralisation des CV.
      </div>
    ),
  },
  {
    text: (
      <div>
        Une posture de coaching bénévole et de proximité, complémentaire à un
        accompagnement professionnel.
      </div>
    ),
  },
  {
    text: (
      <div>
        En plus de l’insertion professionnelle, un réseau d’amitié sur lequel
        compter.
      </div>
    ),
  },
];

const Linkedout = () => {
  const tempInnovations = [...innovations];

  return (
    <Layout title="Pourquoi LinkedOut ? - LinkedOut">
      <Chapter
        style="default"
        title={
          <>
            <span className="uk-text-primary">Pourquoi</span> LinkedOut&nbsp;?
          </>
        }
        content={
          <>
            <span className="uk-text-bold">Un constat simple&nbsp;:</span> quand
            on est en précarité ou exclu, les chances de retrouver un job sont
            proches de zéro, car on est invisible. Or, la précarité n’empêche
            pas le talent&nbsp;: de nombreuses personnes ont des projets et
            l’envie de travailler&nbsp;!
            <br />
            <br />
            Les personnes exclues se heurtent à un frein majeur&nbsp;:{' '}
            <span className="uk-text-bold">
              l’absence de réseau personnel et professionnel.
            </span>{' '}
            Sans réseau, et avec un parcours difficile, il est quasiment
            impossible de retrouver un emploi par ses propres moyens.{' '}
            <span className="uk-text-bold uk-text-primary">
              LinkedOut vise à lever ce frein en donnant un réseau professionnel
              à ceux qui n’en ont pas&nbsp;!
            </span>
            <br />
            <br />
            LinkedOut est un modèle de technologie positive pour insérer les
            personnes très précaires créé en 2019 par l’association Entourage.
            <br />
            <br />
            Depuis 2016, Entourage agit pour l’inclusion sociale des personnes
            très précaires en retissant le lien entre les «inclus» et les «
            exclus » depuis 2016. Parce qu’on ne peut pas s’en sortir seul, la
            vocation d’Entourage est de redonner aux personnes en situation
            d’exclusion les réseaux dont elles ont besoin pour retrouver
            confiance en elles et rebondir&nbsp;!
          </>
        }
        imgSrc="/static/img/why_1.jpg"
        animate
        direction="column"
      />
      <Chapter
        style="muted"
        title={
          <>
            LinkedOut, <span className="uk-text-primary">c&apos;est quoi</span>
            &nbsp;?
          </>
        }
        content={
          <>
            Le réseau social professionnel des personnes exclues&nbsp;!
            <br />
            <br />
            ⅓ des français n’ont pas ou peu de réseau de socialisation et
            300&nbsp;000 sont en situation de mort sociale.
            <br />
            <br />
            En incitant les personnes qui ont du réseau à le partager avec
            celles qui n’en n’ont pas, nous rendons visibles les personnes
            exclues auprès de recruteurs potentiels et leur donnons accès aux
            multiples opportunités dont recèle chacun de nos cercles de
            sociabilité.
            <br />
            <br />
            Le modèle Linkedout repose sur&nbsp;:
            <br />
            <ul
              uk-scrollspy="cls:uk-animation-slide-bottom; target: > li; delay: 200;"
              className="uk-list uk-list-disc"
            >
              <li className="uk-text-primary">
                <span className="uk-text-secondary">
                  <span className="uk-text-bold">
                    la plateforme{' '}
                    <SimpleLink href="/">www.linkedout.fr</SimpleLink>
                  </span>{' '}
                  sur laquelle les citoyens peuvent viraliser les CV de
                  candidats sur leurs réseaux, en un clic pour générer des
                  opportunités d&apos;emploi
                </span>
              </li>
              <li className="uk-text-primary">
                <span className="uk-text-secondary">
                  <span className="uk-text-bold">un soutien de proximité</span>{' '}
                  par des bénévoles-coachs sur la durée
                </span>
              </li>
              <li className="uk-text-primary">
                <span className="uk-text-secondary">
                  <span className="uk-text-bold">des formations courtes</span>{' '}
                  «&nbsp;à la carte&nbsp;» pour acquérir les compétences
                  manquantes et reprendre confiance
                </span>
              </li>
              <li className="uk-text-primary">
                <span className="uk-text-secondary">
                  <span className="uk-text-bold">
                    une communauté d’entraide et d&apos;amitié Entourage
                  </span>{' '}
                  pour faire de nouvelles rencontres et s’intégrer socialement.
                </span>
              </li>
            </ul>
          </>
        }
        imgSrc="/static/img/why_2.jpg"
        animate={false}
        direction="column"
      />
      <Chapter
        style="default"
        title={
          <>
            LinkedOut, <span className="uk-text-primary">pour qui</span>&nbsp;?
          </>
        }
        content={
          <>
            <span className="uk-text-bold">
              LinkedOut touche des publics très divers&nbsp;:
            </span>{' '}
            personnes hébergées en centres d’hébergement, à l&apos;hôtel social,
            réfugiés, jeunes en précarité, personnes issues de parcours
            d’insertion, en situation de handicap,… Le modèle Linkedout repose
            sur&nbsp;:
            <br />
            <ul
              uk-scrollspy="cls:uk-animation-slide-bottom; target: > li; delay: 200;"
              className="uk-list uk-list-disc uk-list-primary"
            >
              <li className="uk-text-primary">
                <span className="uk-text-secondary">
                  Ils sont en{' '}
                  <span className="uk-text-bold uk-text-primary">
                    situation d’exclusion
                  </span>{' '}
                  ou de{' '}
                  <span className="uk-text-bold uk-text-primary">
                    précarité
                  </span>
                  &nbsp;;
                </span>
              </li>
              <li className="uk-text-primary">
                <span className="uk-text-secondary">
                  Sont en{' '}
                  <span className="uk-text-bold uk-text-primary">capacité</span>{' '}
                  de travailler&nbsp;;
                </span>
              </li>
              <li className="uk-text-primary">
                <span className="uk-text-secondary">
                  Et{' '}
                  <span className="uk-text-bold uk-text-primary">motivés</span>{' '}
                  pour retrouver un emploi.
                </span>
              </li>
            </ul>
          </>
        }
        imgSrc="/static/img/why_3.jpg"
        animate={false}
        direction="left"
      />
      <Chapter
        style="muted"
        title={
          <>
            LinkedOut, une{' '}
            <span className="uk-text-primary">brique supplémentaire</span> dans
            l’écosystème de l’inclusion et l’emploi
          </>
        }
        content={
          <>
            LinkedOut vise à agir en collaboration avec les acteurs du retour
            vers l’emploi en proposant une brique complémentaire à l’existant
            (acteurs sociaux publics et associatifs, structures d’insertion,
            structures d’hébergement, job-boards solidaires), fondée sur une
            approche réseau.
            <br />
            <br />
            Pour les personnes sortant de parcours d’insertion, il s’inscrit
            dans la continuité de l’accompagnement socio-professionnel réalisé
            en amont par les travailleurs sociaux et/ou les associations,
            essentiel à la réussite du projet.
          </>
        }
        imgSrc="/static/img/why_4.jpg"
        animate
        direction="right"
      />
      <Section container="small" style="default">
        <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
            Quelle est{' '}
            <span className="uk-text-primary">l&apos;innovation</span> de
            LinkedOut&nbsp;?
          </h2>
          <Grid masonry top left gap="medium" eachWidths={['1-3@m', '2-3@m']}>
            <Card
              key={0}
              text={tempInnovations.splice(0, 1)[0].text}
              number={1}
            />
            <Grid masonry top left gap="medium" childWidths={['1-2@m']}>
              {tempInnovations.map(({ text }, index) => {
                return <Card key={index} text={text} number={index + 2} />;
              })}
            </Grid>
          </Grid>
        </div>
      </Section>
    </Layout>
  );
};

export default Linkedout;
