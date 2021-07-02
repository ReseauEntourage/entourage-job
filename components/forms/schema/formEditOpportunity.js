import axios from '../../../Axios';
import { USER_ROLES, BUSINESS_LINES } from '../../../constants';
import { FORMATTED_DEPARTMENTS } from '../../../constants/departements';

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
      component: 'select-request',
      isMulti: true,
      options: BUSINESS_LINES,
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
      title: 'Addresse postale*',
    },
    {
      id: 'department',
      name: 'department',
      title: 'Département*',
      placeholder: 'Sélectionnez le département',
      type: 'text',
      component: 'select',
      options: FORMATTED_DEPARTMENTS,
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      type: 'text',
      title: 'Votre description*',
    },
    {
      id: 'prerequisites',
      name: 'prerequisites',
      component: 'textarea',
      type: 'text',
      title:
        'Quels sont les pré-requis fondamentaux pour exercer cet emploi\xa0?',
    },
    {
      id: 'isPublic',
      name: 'isPublic',
      component: 'checkbox',
      title: 'Adresser cette offre à tous les candidats',
    },
    {
      id: 'candidatesId',
      name: 'candidatesId',
      isMulti: true,
      type: 'text',
      title: "Si non, renseignez le(s) candidat(s) à qui l'adresser",
      placeholder: 'Tapez un candidat',
      component: 'select-request-async',
      disable: (getValue) => {
        return getValue('isPublic') === true;
      },
      loadOptions: (inputValue, callback) => {
        axios
          .get('api/v1/user/search/candidates', {
            params: {
              query: inputValue,
            },
          })
          .then(({ data }) => {
            return data.map((u) => {
              return {
                value: u.id,
                label: `${u.firstName} ${u.lastName}`,
              };
            });
          })
          .then(callback);
      },
    },
    {
      id: 'disclaimer',
      name: 'disclaimer',
      component: 'text',
      title:
        "* Les offres font l'objet d'une validation par Entourage avant de devenir publiques",
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
      method: 'isLength',
      args: [
        {
          min: 10,
          max: 13,
        },
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
      field: 'department',
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
