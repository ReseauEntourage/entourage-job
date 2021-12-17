import { getAllFilters } from 'src/utils';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';

export default {
  id: 'form-usefullinformation',
  fields: [
    {
      id: 'email',
      name: 'email',
      type: 'email',
      component: 'input',
      placeholder: "Tapez l'adresse mail",
      title: 'Adresse mail',
    },
    {
      id: 'phone',
      name: 'phone',
      component: 'input',
      type: 'phone',
      placeholder: 'Tapez le numéro de téléphone',
      title: 'Numéro de téléphone',
    },
    {
      id: 'address',
      name: 'address',
      component: 'input',
      type: 'text',
      placeholder: "Tapez l'adresse postale",
      title: 'Adresse postale',
    },
    {
      id: 'private',
      name: 'private',
      component: 'text',
      title:
        "L'adresse mail, le numéro de téléphone et l'adresse postale ne seront visibles que sur la version PDF du CV",
    },
    {
      id: 'contracts',
      name: 'contracts',
      title: 'Type de contrat recherché',
      type: 'text',
      component: 'select-request-creatable',
      isMulti: true,
    },
    {
      id: 'locations',
      name: 'locations',
      type: 'text',
      title: 'Lieu de travail souhaité',
      component: 'select-request',
      options: getAllFilters(DEPARTMENTS_FILTERS),
      isMulti: true,
    },
    {
      id: 'availability',
      name: 'availability',
      component: 'input',
      type: 'text',
      title: 'Disponibilités de travail possibles',
    },
    {
      id: 'languages',
      name: 'languages',
      type: 'text',
      title: 'Langues parlées',
      component: 'select-request-creatable',
      isMulti: true,
    },
    {
      id: 'transport',
      name: 'transport',
      component: 'input',
      type: 'text',
      title: 'Permis de conduire',
    },
  ],
  rules: [
    {
      field: 'contracts',
      method: 'isLength',
      args: [
        {
          max: 120,
        },
      ],
      validWhen: true,
      message: '120 caractères maximum',
    },
    {
      field: 'location',
      method: 'isLength',
      args: [
        {
          max: 100,
        },
      ],
      validWhen: true,
      message: '100 caractères maximum',
    },
    {
      field: 'availability',
      method: 'isLength',
      args: [
        {
          max: 40,
        },
      ],
      validWhen: true,
      message: '40 caractères maximum',
    },
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
    {
      field: 'transport',
      method: 'isLength',
      args: [
        {
          max: 100,
        },
      ],
      validWhen: true,
      message: '100 caractères maximum',
    },
    {
      field: 'email',
      method: 'isEmail',
      validWhen: true,
      message: 'Adresse e-mail invalide',
    },
    {
      field: 'phone',
      method: 'isLength',
      args: [
        {
          max: 30,
        },
      ],
      validWhen: true,
      message: '30 caractères maximum',
    },
  ],
};
