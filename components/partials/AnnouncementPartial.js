import React from 'react';
import SimpleLink from '../utils/SimpleLink';
import { EXTERNAL_LINKS } from '../../constants';
import Img from '../utils/Img';
import { Section } from '../utils';

const AnnouncementPartial = () => {
  return (
    <Section container="small" style="muted" className="uk-padding-remove-top">
      <SimpleLink href={EXTERNAL_LINKS.REDSTAR} isExternal target="_blank">
        <Img
          width="1440"
          height="420"
          src="/static/img/redstar.png"
          alt="Partenariat RedStar"
        />
      </SimpleLink>
    </Section>
  );
};

export default AnnouncementPartial;
