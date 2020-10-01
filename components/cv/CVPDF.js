import React from 'react';
import PropTypes from 'prop-types';

import {GridNoSSR} from '../utils/Grid';
import {IconNoSSR, ImgNoSSR, SimpleLink} from "../utils";
import {formatParagraph, sortExperiences, sortReviews} from "../../utils";
import Img from "../utils/Img";

const CVPDF = ({cv, page}) => {
  const experiences = cv.experiences && cv.experiences.length > 0 ? sortExperiences(cv.experiences) : [];

  const pages = [
    <div style={{
      height: 1121,
      width: 794,
    }} className="uk-background-muted uk-flex uk-flex-column page-break">
      {
        cv.urlImg &&
        <div
          style={{
            position: 'relative',
            height: 200
          }}>
          <div
            className="uk-background-cover uk-background-center uk-flex uk-flex-middle uk-flex-center"
            style={{height: 200}}>
            <img
              style={{marginTop: 100}}
              className="uk-box-shadow-small uk-width-expand"
              src={process.env.AWSS3_URL + cv.urlImg || '/static/img/arthur-background.jpg'}
              alt="" />
          </div>
        </div>
      }
      <div className="uk-flex-1 uk-flex uk-padding uk-position-relative">
        <div className="uk-flex-1 uk-flex uk-flex-column uk-card uk-card-default uk-padding uk-background-default page-break">
          <GridNoSSR childWidths={['1-1']} gap="small">
            <div className="uk-flex uk-flex-column uk-flex-middle uk-margin-small-bottom">
              <h1 className="uk-text-bold uk-text-primary">
                {cv.user.candidat.firstName} {cv.user.candidat.lastName}
              </h1>
              {cv.catchphrase && (
                <div
                  className="uk-width-xlarge uk-text-center uk-flex uk-flex-center uk-flex-middle">
                  <p
                    className="uk-text-small uk-position-relative">
                    <IconNoSSR
                      className="uk-text-primary ent-quote-after"
                      name="quote-right"
                      ratio={1}
                      flip
                    />
                    <span className="uk-margin-small-left uk-margin-small-right">{cv.catchphrase}</span>
                    <IconNoSSR
                      className="uk-text-primary ent-quote-before"
                      name="quote-right"
                      ratio={0.8}
                    />
                  </p>
                </div>
              )}
              {/* uk-text-emphasis uk-text-bold */}
              {
                cv.ambitions && cv.ambitions.length > 0 &&
                <p className="uk-text-bold uk-width-xxlarge uk-text-center uk-margin-small-bottom uk-margin-small-top">
                  J&apos;aimerais beaucoup travailler dans{' '}
                  <span
                    className="uk-label uk-text-lowercase"
                    style={{
                      lineHeight: 'unset',
                      verticalAlign: 'bottom',
                      fontSize: 'inherit',
                    }}>
                      {cv.ambitions[0]}
                  </span>
                  {cv.ambitions.length > 1 ? (
                    <>
                      {' '}
                      ou{' '}
                      <span
                        className="uk-label uk-text-lowercase"
                        style={{
                          lineHeight: 'unset',
                          verticalAlign: 'bottom',
                          fontSize: 'inherit',
                        }}
                      >
                    {cv.ambitions[1]}
                  </span>
                    </>
                  ) : (
                    ''
                  )}
                  {cv.careerPathOpen ? (
                    <>
                      {
                        ` mais reste ${
                          cv.user.candidat.gender === 1 ? 'ouverte' : 'ouvert'
                        } à toutes autres propositions.`}
                    </>
                  ) : (
                    '.'
                  )}
                </p>
              }
            </div>
            <GridNoSSR className="uk-flex" eachWidths={['2-3', '1-3']}>
              <GridNoSSR column gap='medium'>
                {experiences && experiences.length > 0 && (
                  <div className="">
                    <h5 className="uk-margin-small-bottom">Mes expériences et compétences</h5>
                    <hr className="uk-divider-small uk-margin-remove-top" />
                    <dl className="uk-description-list uk-margin-remove">
                      {experiences.map((exp, i) => (
                        <>
                          {exp.skills && (
                            <dt key={i} style={{display: 'block'}}>
                              {exp.skills.map((name, key) => (
                                <span
                                  key={key}
                                  className="uk-label uk-text-lowercase uk-margin-small-right">
                                  {name}
                                </span>
                              ))}
                            </dt>
                          )}
                          <dd className="uk-text-small uk-margin-small-top">
                            {formatParagraph(exp.description)}
                          </dd>
                        </>
                      ))}
                    </dl>
                  </div>
                )}
              </GridNoSSR>
              <GridNoSSR column gap='medium'>
                {cv.businessLines && cv.businessLines.length > 0 && (
                  <div className="">
                    <h5 className="uk-margin-small-bottom">Mes secteurs d&apos;activité</h5>
                    <hr className="uk-divider-small uk-margin-remove-top" />
                    <div className="uk-flex uk-flex-left uk-flex-wrap uk-flex-1">
                      {
                        cv.businessLines.map((line, index) =>
                          <div
                            key={index} className="uk-flex uk-flex-center uk-flex-middle" style={{
                            paddingRight: 5,
                            paddingTop: 5,
                            paddingBottom: 5
                          }}>
                            <span className="uk-badge uk-text-small">{line}</span>
                          </div>
                        )
                      }
                    </div>
                  </div>
                )}
                {
                  (cv.contracts || cv.locations || cv.availability || cv.languages || cv.transport) &&
                  <div className="">
                    <h5 className="uk-margin-small-bottom">Mes infos pratiques</h5>
                    <hr className="uk-divider-small uk-margin-remove-top" />
                    <ul className="uk-list uk-margin-remove-bottom uk-text-small">
                      {cv.contracts && cv.contracts.length > 0 && (
                        <li className="uk-flex uk-flex-middle">
                          <IconNoSSR className="uk-text-primary uk-margin-small-right" name="file-text" style={{width: 20}} />{' '}
                          <span className="uk-flex-1">{cv.contracts.join(' / ')}</span>
                        </li>
                      )}
                      {cv.locations && cv.locations.length > 0 && (
                        <li className="uk-flex uk-flex-middle">
                          <IconNoSSR className="uk-text-primary uk-margin-small-right" name="location" style={{width: 20}} />{' '}
                          <span className="uk-flex-1">{cv.locations.join(' / ')}</span>
                        </li>
                      )}
                      {cv.availability && cv.availability.length > 0 && (
                        <li className="uk-flex uk-flex-middle">
                          <IconNoSSR className="uk-text-primary uk-margin-small-right" name="calendar" style={{width: 20}}/>{' '}
                          <span className="uk-flex-1">{cv.availability}</span>
                        </li>
                      )}
                      {cv.languages && cv.languages.length > 0 && (
                        <li className="uk-flex uk-flex-middle">
                          <IconNoSSR className="uk-text-primary uk-margin-small-right" name="users" style={{width: 20}}/>{' '}
                          <span className="uk-flex-1">{cv.languages.join(' / ')}</span>
                        </li>
                      )}
                      {cv.transport && cv.transport.length > 0 && (
                        <li className="uk-flex uk-flex-middle">
                          <IconNoSSR className="uk-text-primary uk-margin-small-right" name="car" style={{width: 20}}/>{' '}
                          <span className="uk-flex-1">{cv.transport}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                }
              </GridNoSSR>
            </GridNoSSR>
          </GridNoSSR>
        </div>
      </div>
    </div>,
    <div style={{
      height: 1121,
      width: 794,
    }} className="uk-background-muted uk-flex">
      <div className="uk-flex-1 uk-flex cv-fiche uk-padding uk-position-relative">
        <div className="uk-flex-1 uk-flex uk-flex-column uk-card uk-card-default uk-padding uk-background-default">
          <GridNoSSR childWidths={['1-1']} gap="small">
            <GridNoSSR className="uk-flex" eachWidths={['2-3', '1-3']}>
              <GridNoSSR column gap='medium'>
                {cv.story && (
                  <div className="">
                    <h5 className="uk-margin-small-bottom">Mon histoire</h5>
                    <hr className="uk-divider-small uk-margin-remove-top" />
                    <p className="uk-text-small uk-margin-remove-bottom">
                      {formatParagraph(cv.story)}
                    </p>
                  </div>
                )}
                {/* cv.reviews */}
                {cv.reviews && cv.reviews.length > 0 && (
                  <div className="">
                    <h5 className="uk-margin-small-bottom">
                      Ils me recommandent
                    </h5>
                    <hr className="uk-divider-small uk-margin-remove-top" />
                    <ul className="uk-list uk-margin-remove-bottom">
                      {sortReviews(cv.reviews).map((review, i) => (
                        <li key={i}>
                          <IconNoSSR
                            flip
                            className="uk-text-primary uk-margin-small-bottom"
                            name="quote-right"
                            ratio={1}
                          />
                          <p className="uk-text-small uk-margin-remove">{formatParagraph(review.text)}</p>
                          <GridNoSSR
                            className="uk-margin-small-top"
                            eachWidths={['expand', 'auto']}
                            between
                            row
                          >
                            <p className="uk-text-small uk-text-meta uk-margin-remove-top">
                                  <span className="uk-text-bold">
                                    {review.name}
                                  </span>
                              , {review.status}
                            </p>
                            <IconNoSSR
                              className="uk-text-muted uk-width-1-1 uk-text-right"
                              name="quote-right"
                              ratio={0.8} />
                          </GridNoSSR>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </GridNoSSR>
              <GridNoSSR column gap='medium'>
                {cv.skills && cv.skills.length > 0 && (
                  <div className="">
                    <h5 className="uk-margin-small-bottom">Mes atouts</h5>
                    <hr className="uk-divider-small uk-margin-remove-top" />
                    <ul className="uk-list uk-margin-remove-bottom uk-text-small">
                      {cv.skills.map((item, i) => (
                        <li id={i} key={i}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {cv.passions && cv.passions.length > 0 && (
                  <div className="">
                    <h5 className="uk-margin-small-bottom">Mes passions</h5>
                    <hr className="uk-divider-small uk-margin-remove-top" />
                    <ul className="uk-list uk-margin-remove-bottom uk-text-small">
                      {cv.passions.map((item, i) => (
                        <li id={i} key={i}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </GridNoSSR>
            </GridNoSSR>
          </GridNoSSR>
          <div className="uk-flex-1 uk-flex uk-flex-column uk-flex-right">
            <hr className="uk-margin-small-bottom"/>
            <GridNoSSR column middle gap='medium'>
              <p className="uk-text-small uk-text-center uk-text-meta uk-width-xlarge@m uk-margin-remove">
                Je suis accompagné(e) dans ma recherche d&apos;emploi et mon
                intégration en entreprise par le projet LinkedOut. Pour plus
                d&apos;information, contactez&nbsp;:
                <br />
                <SimpleLink
                  className="uk-link-text uk-text-primary"
                  isExternal
                  newTab
                  href={`mailto:${process.env.MAILJET_CONTACT_EMAIL}`}
                >
                  {process.env.MAILJET_CONTACT_EMAIL}
                </SimpleLink>
              </p>
              <Img
                alt="logo linkedout"
                className="uk-width-small"
                src="data:image/png;base64,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"
              />
            </GridNoSSR>
          </div>
        </div>
      </div>
    </div>
  ];

  return (
    <div className="uk-flex uk-flex-middle uk-flex-column">
      {
        page && page >= 0 && page < 2 ?
          pages[Math.floor(page)]
          :
          pages.map((p) => p)
      }
    </div>
  );
};

CVPDF.propTypes = {
  cv: PropTypes.shape().isRequired,
  page: PropTypes.number
};

CVPDF.defaultProps = {
  page: null
};

export default CVPDF;
