import React from 'react';
import PropTypes from 'prop-types';
import Grid from '../utils/Grid';
import SimpleLink from '../utils/SimpleLink';
import { event } from '../../lib/gtag';
import TAGS from '../../constants/tags';
import { addPrefix } from '../../utils';

const LogoList = ({ logos }) => {
  return (
    <Grid
      childWidths={[`1-${Math.floor(logos.length / 2 + 1)}@m`, 'auto']}
      match
      middle
      center
      gap="small"
      items={logos.map(({ key, link, bis }) => {
        return (
          <SimpleLink
            className="uk-flex uk-flex-center"
            isExternal
            target="_blank"
            onClick={() => {
              return event(TAGS.FOOTER_PARTENAIRE_CLIC);
            }}
            href={link}
          >
            <div
              className="uk-background-center-center uk-background-contain uk-width-small uk-height-small"
              style={{
                maxHeight: 100,
                backgroundImage: `url(${addPrefix(
                  `/static/img/partners/${key}/logo.png)`
                )}`,
              }}
            />
            {bis && (
              <div
                className="uk-background-center-center uk-background-contain uk-width-small uk-height-small"
                style={{
                  maxHeight: 100,
                  backgroundImage: `url(${addPrefix(
                    `/static/img/partners/${key}/logo_bis.png)`
                  )}`,
                }}
              />
            )}
          </SimpleLink>
        );
      })}
    />
  );
};

LogoList.propTypes = {
  logos: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default LogoList;
