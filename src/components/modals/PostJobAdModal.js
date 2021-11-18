import React from 'react';
import schema from 'src/components/forms/schema/formEditOpportunity';
import { mutateFormSchema } from 'src/utils';
import ModalEdit from 'src/components/modals/ModalEdit';
import { usePostOpportunity } from 'src/hooks';

const formId = 'post-job-ad';
export const modalId = `modal-${formId}`;

const PostJobAdModal = () => {
  const { lastFilledForm, postOpportunity } = usePostOpportunity(modalId);

  const mutatedSchema = mutateFormSchema(
    schema,
    [
      {
        fieldId: 'candidatesId',
        props: [
          {
            propName: 'disabled',
            value: true,
          },
          {
            propName: 'hidden',
            value: true,
          },
        ],
      },
      {
        fieldId: 'isPublic',
        props: [
          {
            propName: 'disabled',
            value: true,
          },
          {
            propName: 'hidden',
            value: true,
          },
        ],
      },
      {
        fieldId: 'message',
        props: [
          {
            propName: 'disabled',
            value: true,
          },
          {
            propName: 'hidden',
            value: true,
          },
        ],
      },
    ],
    formId
  );

  return (
    <ModalEdit
      id={modalId}
      title="Proposer une opportunité"
      description="Cet espace est dédié aux potentiels recruteurs qui souhaitent proposer une opportunité visible par tous les candidats."
      submitText="Envoyer"
      defaultValues={{
        isPublic: true,
        ...lastFilledForm,
      }}
      formSchema={mutatedSchema}
      onSubmit={async (fields, closeModal) => {
        await postOpportunity(fields, closeModal);
      }}
    />
  );
};

export default PostJobAdModal;
