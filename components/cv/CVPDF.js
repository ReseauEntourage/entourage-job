import React from 'react';
import PropTypes from 'prop-types';

import {GridNoSSR} from '../utils/Grid';
import {IconNoSSR, SimpleLink} from "../utils";
import {formatParagraph, sortExperiences, sortReviews} from "../../utils";

const CVPDF = ({cv, page}) => {
  const experiences = cv.experiences && cv.experiences.length > 0 ? sortExperiences(cv.experiences) : [];

  const pages = [
    <div style={{
      height: 1122,
      width: 794,
    }} className="uk-background-muted uk-flex uk-flex-column">
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
        <div className="uk-flex-1 uk-flex uk-flex-column uk-card uk-card-default uk-padding uk-background-default">
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
      height: 1122,
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
              <img
                alt="logo linkedout"
                className="uk-width-small"
                src="/static/img/linkedout_logo_orange_small.png"
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
