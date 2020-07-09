import axios from '../../../Axios';
import {USER_ROLES, BUSINESS_LINES} from "../../../constants";

export default {
  id: 'form-offer',
  fields: [
    {
      id: 'title',
      name: 'title',
      component: 'input',
      type: 'text',
      title: 'Titre du poste proposé*',
    },
    {
      id: 'recruiterName',
      name: 'recruiterName',
      component: 'input',
      type: 'text',
      title: 'Nom du recruteur*',
    },
    {
      id: 'recruiterMail',
      name: 'recruiterMail',
      component: 'input',
      type: 'email',
      title: 'Adresse mail du recruteur*',
    },
    {
      id: 'recruiterPhone',
      name: 'recruiterPhone',
      component: 'input',
      type: 'tel',
      title: 'Téléphone du recruteur*',
    },
    {
      id: 'businessLines',
      name: 'businessLines',
      title: "Secteur d'activité*",
      placeholder: "Sélectionnez les secteurs d'activité",
      type: 'text',
      component: "select-request-creatable",
      isMulti: true,
      options: BUSINESS_LINES
    },
    {
      id: 'company',
      name: 'company',
      component: 'input',
      type: 'text',
      title: 'Entreprise*',
    },
    {
      id: 'location',
      name: 'location',
      component: 'input',
      type: 'text',
      title: 'Localisation*',
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      type: 'text',
      title: 'Votre description*',
    },
    {
      id: 'isPublic',
      name: 'isPublic',
      component: 'checkbox',
      title: "J'adresse cette offre à tous les candidats",
    },
    {
      id: 'candidatId',
      name: 'candidatId',
      // isMulti: true,
      type: 'text',
      title: "Si non, renseignez le candidat à qui l'adresser",
      placeholder: 'Tapez un candidat',
      component: 'select-request-async',
      disable: (getValue) => getValue('isPublic') === true,
      loadOptions: (inputValue, callback) => {
        axios
          .get('api/v1/user/search', {
            params: {
              query: inputValue,
              role: USER_ROLES.CANDIDAT,
            },
          })
          .then(({ data }) =>
            data.map((u) => ({
              value: u.id,
              label: `${u.firstName} ${u.lastName}`,
            }))
          )
          .then(callback);
      },
    },
  ],
  rules: [
    {
      field: 'title',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'recruiterName',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'recruiterMail',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'recruiterMail',
      method: 'isEmail',
      validWhen: true,
      message: 'Invalide',
    },
    {
      field: 'recruiterPhone',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'recruiterPhone',
      method: 'isMobilePhone',
      args: [
        'fr-FR'
      ],
      validWhen: true,
      message: 'Invalide',
    },
    {
      field: 'businessLines',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'company',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'location',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'description',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
  ],
};
