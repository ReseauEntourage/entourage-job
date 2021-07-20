import React from 'react';
import Img from '../utils/Img';
import { Section } from '../utils';

const AnnouncementPartial = () => {
  return (
    <Section container="small" style="muted" className="uk-padding-remove-top">
      <Img
        width="1440"
        height="420"
        src="/static/img/redstar.png"
        alt="Partenariat RedStar"
      />
    </Section>
  );
};

export default AnnouncementPartial;
