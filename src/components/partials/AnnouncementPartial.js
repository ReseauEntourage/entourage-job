import React from 'react';
import SimpleLink from 'src/components/utils/SimpleLink';
import { EXTERNAL_LINKS } from 'src/constants';
import Img from 'src/components/utils/Img';
import { Section } from 'src/components/utils';

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
