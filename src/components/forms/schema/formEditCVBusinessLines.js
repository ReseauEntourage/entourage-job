import { BUSINESS_LINES } from 'src/constants';

export default {
  id: 'form-cv-businesslines',
  fields: [
    {
      id: 'businessLines',
      name: 'businessLines',
      type: 'text',
      title: "Secteurs d'activité",
      component: 'select-request',
      options: BUSINESS_LINES,
      isMulti: true,
    },
  ],
  rules: [
    {
      field: 'languages',
      method: 'isLength',
      args: [
        {
          max: 100,
        },
      ],
      validWhen: true,
      message: '100 caractères maximum',
    },
  ],
};
