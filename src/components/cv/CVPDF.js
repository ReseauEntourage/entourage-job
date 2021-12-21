import React from 'react';
import PropTypes from 'prop-types';

import { Grid, SimpleLink } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';

import {
  addPrefix,
  formatParagraph,
  sortExperiences,
  sortReviews,
} from 'src/utils';

const CVPDF = ({ cv, page }) => {
  const experiences =
    cv.experiences && cv.experiences.length > 0
      ? sortExperiences(cv.experiences)
      : [];

  // Function to estimate where to divide the experiences between both pages
  const averageCharsPerLine = 59;
  const averageSkillsPerLine = 2;
  const estimatedMaxLinesOnTheFirstPage = 29;

  let indexToSplitAt = experiences.length;
  experiences.reduce((acc, curr, index) => {
    const lines = curr.description.replace(/\n\n/g, '\n').split(/\n/g);
    let numberOfLines = lines.reduce((a, c) => {
      return Math.floor(c.length / averageCharsPerLine) + a + 1;
    }, 0);
    numberOfLines += Math.floor(curr.skills.length / averageSkillsPerLine) + 1;

    if (
      acc + numberOfLines > estimatedMaxLinesOnTheFirstPage &&
      index < indexToSplitAt
    ) {
      indexToSplitAt = index > 0 ? index : 1;
    }
    return acc + numberOfLines;
  }, 0);

  const firstExperiences = experiences.slice(0, indexToSplitAt);
  const restOfExperiences = experiences.slice(indexToSplitAt);

  const pages = [
    // First Page
    <div
      style={{
        height: 1122,
        width: 794,
      }}
      className="uk-background-muted uk-flex uk-flex-column"
    >
      {cv.urlImg && (
        <div
          style={{
            position: 'relative',
            height: 150,
          }}
        >
          <div
            className="uk-background-cover uk-background-center uk-flex uk-flex-middle uk-flex-center"
            style={{ height: 150 }}
          >
            {/* Can't use <Img /> component because doesn't work for PDF */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              style={{ marginTop: 75 }}
              className="uk-box-shadow-small uk-width-expand"
              src={
                process.env.AWSS3_URL + cv.urlImg ||
                addPrefix('/static/img/arthur-background.jpg')
              }
              alt=""
            />
          </div>
        </div>
      )}
      <div className="uk-flex-1 uk-flex uk-padding uk-position-relative">
        <div className="uk-flex-1 uk-flex uk-flex-column uk-card uk-card-default uk-padding uk-background-default">
          <Grid childWidths={['1-1']} gap="small">
            <div className="uk-flex uk-flex-column uk-flex-middle uk-margin-remove-bottom">
              <h1 className="uk-text-bold uk-text-primary">
                {cv.user.candidat.firstName} {cv.user.candidat.lastName}
              </h1>
              {cv.catchphrase && (
                <div className="uk-width-xlarge uk-text-center uk-flex uk-flex-center uk-flex-middle">
                  <p className="uk-text-small uk-position-relative">
                    <IconNoSSR
                      className="uk-text-primary ent-quote-after"
                      name="quote-right"
                      ratio={1}
                      flip
                    />
                    <span className="uk-margin-small-left uk-margin-small-right uk-text-italic">
                      {cv.catchphrase}
                    </span>
                    <IconNoSSR
                      className="uk-text-primary ent-quote-before"
                      name="quote-right"
                      ratio={0.8}
                    />
                  </p>
                </div>
              )}
              {/* uk-text-emphasis uk-text-bold */}
              {cv.ambitions && cv.ambitions.length > 0 && (
                <p className="uk-text-bold uk-width-xxlarge uk-text-center uk-margin-small-bottom uk-margin-remove-top">
                  J&apos;aimerais beaucoup travailler dans{' '}
                  <span
                    className="uk-label uk-text-lowercase"
                    style={{
                      lineHeight: 'unset',
                      verticalAlign: 'bottom',
                      fontSize: 'inherit',
                    }}
                  >
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
                      {` mais reste ${
                        cv.user.candidat.gender === 1 ? 'ouverte' : 'ouvert'
                      } à toutes autres propositions.`}
                    </>
                  ) : (
                    '.'
                  )}
                </p>
              )}
            </div>
            <Grid className="uk-flex" eachWidths={['2-3', '1-3']}>
              <Grid column gap="medium">
                {firstExperiences && firstExperiences.length > 0 && (
                  <div className="">
                    <h5 className="uk-margin-small-bottom">
                      Mes expériences et compétences
                    </h5>
                    <hr className="uk-divider-small uk-margin-remove-top" />
                    <dl className="uk-description-list uk-margin-remove">
                      {firstExperiences.map((exp, i) => {
                        return (
                          <>
                            {exp.skills && (
                              <dt key={i} style={{ display: 'block' }}>
                                {exp.skills.map((name, key) => {
                                  return (
                                    <span
                                      key={key}
                                      className="uk-label uk-text-lowercase uk-margin-small-right"
                                    >
                                      {name}
                                    </span>
                                  );
                                })}
                              </dt>
                            )}
                            <dd className="uk-text-small uk-margin-small-top">
                              {formatParagraph(exp.description, true)}
                            </dd>
                          </>
                        );
                      })}
                    </dl>
                  </div>
                )}
              </Grid>
              <Grid column gap="medium">
                {(cv.contracts ||
                  cv.locations ||
                  cv.availability ||
                  cv.languages ||
                  cv.transport) && (
                  <div className="">
                    <h5 className="uk-margin-small-bottom">
                      Mes infos pratiques
                    </h5>
                    <hr className="uk-divider-small uk-margin-remove-top" />
                    <ul className="uk-list uk-margin-remove-bottom uk-text-small">
                      {cv.user.candidat.address &&
                        cv.user.candidat.address.length > 0 && (
                          <li className="uk-flex uk-flex-middle">
                            <IconNoSSR
                              className="uk-text-primary uk-margin-small-right"
                              name="home"
                              style={{ width: 20 }}
                            />{' '}
                            <span className="uk-flex-1">
                              {cv.user.candidat.address}
                            </span>
                          </li>
                        )}
                      {cv.user.candidat.email &&
                        cv.user.candidat.email.length > 0 && (
                          <li className="uk-flex uk-flex-middle">
                            <IconNoSSR
                              className="uk-text-primary uk-margin-small-right"
                              name="mail"
                              style={{ width: 20 }}
                            />{' '}
                            <span className="uk-flex-1">
                              {cv.user.candidat.email}
                            </span>
                          </li>
                        )}
                      {cv.user.candidat.phone &&
                        cv.user.candidat.phone.length > 0 && (
                          <li className="uk-flex uk-flex-middle">
                            <IconNoSSR
                              className="uk-text-primary uk-margin-small-right"
                              name="phone"
                              style={{ width: 20 }}
                            />{' '}
                            <span className="uk-flex-1">
                              {cv.user.candidat.phone}
                            </span>
                          </li>
                        )}
                      {cv.contracts && cv.contracts.length > 0 && (
                        <li className="uk-flex uk-flex-middle">
                          <IconNoSSR
                            className="uk-text-primary uk-margin-small-right"
                            name="file-text"
                            style={{ width: 20 }}
                          />{' '}
                          <span className="uk-flex-1">
                            {cv.contracts.join(' / ')}
                          </span>
                        </li>
                      )}
                      {cv.locations && cv.locations.length > 0 && (
                        <li className="uk-flex uk-flex-middle">
                          <IconNoSSR
                            className="uk-text-primary uk-margin-small-right"
                            name="location"
                            style={{ width: 20 }}
                          />{' '}
                          <span className="uk-flex-1">
                            {cv.locations.join(' / ')}
                          </span>
                        </li>
                      )}
                      {cv.availability && cv.availability.length > 0 && (
                        <li className="uk-flex uk-flex-middle">
                          <IconNoSSR
                            className="uk-text-primary uk-margin-small-right"
                            name="calendar"
                            style={{ width: 20 }}
                          />{' '}
                          <span className="uk-flex-1">{cv.availability}</span>
                        </li>
                      )}
                      {cv.languages && cv.languages.length > 0 && (
                        <li className="uk-flex uk-flex-middle">
                          <IconNoSSR
                            className="uk-text-primary uk-margin-small-right"
                            name="users"
                            style={{ width: 20 }}
                          />{' '}
                          <span className="uk-flex-1">
                            {cv.languages.join(' / ')}
                          </span>
                        </li>
                      )}
                      {cv.transport && cv.transport.length > 0 && (
                        <li className="uk-flex uk-flex-middle">
                          <IconNoSSR
                            className="uk-text-primary uk-margin-small-right"
                            name="car"
                            style={{ width: 20 }}
                          />{' '}
                          <span className="uk-flex-1">{cv.transport}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                {cv.skills && cv.skills.length > 0 && (
                  <div className="">
                    <h5 className="uk-margin-small-bottom">Mes atouts</h5>
                    <hr className="uk-divider-small uk-margin-remove-top" />
                    <ul className="uk-list uk-margin-remove-bottom uk-text-small">
                      {cv.skills.map((item, i) => {
                        return (
                          <li id={i} key={i}>
                            {item}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>,

    // Second Page
    <div
      style={{
        height: 1122,
        width: 794,
      }}
      className="uk-background-muted uk-flex"
    >
      <div className="uk-flex-1 uk-flex cv-fiche uk-padding uk-position-relative">
        <div className="uk-flex-1 uk-flex uk-flex-column uk-card uk-card-default uk-padding uk-background-default">
          <Grid childWidths={['1-1']} gap="small" style={{ scale: 0.9 }}>
            <Grid className="uk-flex" eachWidths={['2-3', '1-3']}>
              <Grid column gap="medium">
                {restOfExperiences && restOfExperiences.length > 0 && (
                  <div className="">
                    <dl className="uk-description-list uk-margin-remove">
                      {restOfExperiences.map((exp, i) => {
                        return (
                          <>
                            {exp.skills && (
                              <dt key={i} style={{ display: 'block' }}>
                                {exp.skills.map((name, key) => {
                                  return (
                                    <span
                                      key={key}
                                      className="uk-label uk-text-lowercase uk-margin-small-right"
                                    >
                                      {name}
                                    </span>
                                  );
                                })}
                              </dt>
                            )}
                            <dd className="uk-text-small uk-margin-small-top">
                              {formatParagraph(exp.description, true)}
                            </dd>
                          </>
                        );
                      })}
                    </dl>
                  </div>
                )}
                {cv.story && (
                  <div className="">
                    <h5 className="uk-margin-small-bottom">Mon histoire</h5>
                    <hr className="uk-divider-small uk-margin-remove-top" />
                    <p className="uk-text-small uk-margin-remove-bottom">
                      {formatParagraph(cv.story, true)}
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
                      {sortReviews(cv.reviews).map((review, i) => {
                        return (
                          <li key={i}>
                            <IconNoSSR
                              flip
                              className="uk-text-primary uk-margin-small-bottom"
                              name="quote-right"
                              ratio={1}
                            />
                            <p className="uk-text-small uk-margin-remove">
                              {formatParagraph(review.text, true)}
                            </p>
                            <Grid
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
                                ratio={0.8}
                              />
                            </Grid>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </Grid>
              <Grid column gap="medium">
                {cv.passions && cv.passions.length > 0 && (
                  <div className="">
                    <h5 className="uk-margin-small-bottom">Mes passions</h5>
                    <hr className="uk-divider-small uk-margin-remove-top" />
                    <ul className="uk-list uk-margin-remove-bottom uk-text-small">
                      {cv.passions.map((item, i) => {
                        return (
                          <li id={i} key={i}>
                            {item}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>
          <div className="uk-flex-1 uk-flex uk-flex-column uk-flex-right">
            <hr className="uk-margin-small-bottom" />
            <Grid column middle gap="small">
              <p className="uk-text-small uk-text-center uk-text-meta uk-width-xlarge@m uk-margin-remove">
                Je suis accompagné(e) dans ma recherche d&apos;emploi et mon
                intégration en entreprise par le projet LinkedOut. Pour plus
                d&apos;information, contactez&nbsp;:{' '}
                <SimpleLink
                  className="uk-link-text uk-text-primary"
                  isExternal
                  newTab
                  href={`mailto:${process.env.MAILJET_CONTACT_EMAIL}`}
                >
                  {process.env.MAILJET_CONTACT_EMAIL}
                </SimpleLink>
              </p>
              {/* Can't use <Img /> component because doesn't work for PDF */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Logo linkedout"
                className="uk-width-small"
                src={addPrefix('/static/img/linkedout_logo_orange_small.png')}
              />
            </Grid>
          </div>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="uk-flex uk-flex-middle uk-flex-column">
      {page && page >= 0 && page < 2
        ? pages[Math.floor(page)]
        : pages.map((p) => {
            return p;
          })}
    </div>
  );
};

CVPDF.propTypes = {
  cv: PropTypes.shape().isRequired,
  page: PropTypes.number,
};

CVPDF.defaultProps = {
  page: null,
};

export default CVPDF;
