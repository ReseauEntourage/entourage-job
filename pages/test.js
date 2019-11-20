import React from 'react';
import Layout from '../components/Layout';
import { Section } from '../components/utils';
import schemaUsefulInformation from '../components/forms/schema/formEditUsefulInformation';
import schemaStory from '../components/forms/schema/formEditStory';
import schemaCatchphrase from '../components/forms/schema/formEditCatchphrase';
import schemaTestimonial from '../components/forms/schema/formEditTestimonial';
import schemaformEditSkills from '../components/forms/schema/formEditSkills';
import schemaformEditPassions from '../components/forms/schema/formEditPassions';
import ModalEdit from '../components/modals/ModalEdit';

export default () => {
  return (
    <Layout title="Test - Entourage Jobs">
      <Section size="large" style="default">
        <ModalEdit
          id="modal-story"
          title="Edition - mon histoire"
          formSchema={schemaStory}
          defaultValues={['Voici mon histoire....']}
          onSubmit={console.log}
        />
        <ModalEdit
          id="modal-catchphrase"
          title="Edition - ma phrase d'accroche"
          formSchema={schemaCatchphrase}
          defaultValues={["Voici ma phrase d'accroche...."]}
          onSubmit={console.log}
        />
        <ModalEdit
          id="modal-usefulinformation"
          title="Edition - informations utiles"
          formSchema={schemaUsefulInformation}
          defaultValues={['CDI / CDD', 'Paris, France', '', '', 'Non']}
          onSubmit={console.log}
        />
        <ModalEdit
          id="modal-testimonial"
          title="Edition - recommandation"
          formSchema={schemaTestimonial}
          onSubmit={console.log}
        />
        <ModalEdit
          id="modal-skills"
          title="Edition - mes atouts (6 maximum)"
          formSchema={schemaformEditSkills}
          defaultValues={['Salto arrière']}
          onSubmit={console.log}
        />
        <ModalEdit
          id="modal-passions"
          title="Edition - mes passions (6 maximum)"
          formSchema={schemaformEditPassions}
          defaultValues={['La dégustation de chocolat', 'Le sport']}
          onSubmit={console.log}
        />
      </Section>
    </Layout>
  );
};
