import React from 'react';
import { Section } from '../components/utils';
import schemaUsefulInformation from '../components/forms/schema/formEditUsefulInformation';
import schemaStory from '../components/forms/schema/formEditStory';
import schemaCatchphrase from '../components/forms/schema/formEditCatchphrase';
import schemaTestimonial from '../components/forms/schema/formEditTestimonial';
import schemaformEditSkills from '../components/forms/schema/formEditSkills';
import schemaformEditPassions from '../components/forms/schema/formEditPassions';
import schemaformEditExperience from '../components/forms/schema/formEditExperience';
import ModalEdit from '../components/modals/ModalEdit';

const skills = {
  skill1: 'Salto arrière',
};
export default () => (
  <Section size="large" style="default">
    <ModalEdit
      button="modal-story"
      id="modal-story"
      title="Edition - mon histoire"
      formSchema={schemaStory}
      defaultValues={{ story: 'Voici mon histoire....' }}
      onSubmit={console.log}
    />
    <ModalEdit
      button="modal-catchphrase"
      id="modal-catchphrase"
      title="Edition - ma phrase d'accroche"
      formSchema={schemaCatchphrase}
      defaultValues={{ intro: 'Voici mon histoire....' }}
      onSubmit={console.log}
    />
    <ModalEdit
      button="modal-usefulinformation"
      id="modal-usefulinformation"
      title="Edition - informations utiles"
      formSchema={schemaUsefulInformation}
      defaultValues={{
        Contracts: 'CDI / CDD',
        location: 'Paris, France',
        transport: 'Permis B',
      }}
      onSubmit={console.log}
      submitText="Sauvegarder"
    />
    <ModalEdit
      button="modal-testimonial"
      id="modal-testimonial"
      title="Edition - recommandation"
      formSchema={schemaTestimonial}
      onSubmit={console.log}
      submitText="Sauvegarder"
    />
    <ModalEdit
      button="modal-skills"
      id="modal-skills"
      title="Edition - mes atouts (6 maximum)"
      formSchema={schemaformEditSkills}
      defaultValues={skills}
      onSubmit={(fields) => {
        Object.keys(fields).forEach((key, i) => (skills[key] = fields[key]));
      }}
    />
    <ModalEdit
      button="modal-passions"
      id="modal-passions"
      title="Edition - mes passions (6 maximum)"
      formSchema={schemaformEditPassions}
      defaultValues={{
        passion1: 'La dégustation de chocolat',
        passion2: 'Le sport',
      }}
      onSubmit={console.log}
    />
    <ModalEdit
      button="modal-experience"
      id="modal-experience"
      title="Edition - mon expérience"
      formSchema={schemaformEditExperience}
      defaultValues={{
        title: 'La dégustation de chocolat',
        description: 'Le sport',
        'start-month': 2,
        'start-year': 1999,
      }}
      onSubmit={console.log}
    />
  </Section>
);
