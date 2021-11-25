import { BUSINESS_LINES, CONTRACTS, USER_ROLES } from 'src/constants';
import { FORMATTED_DEPARTMENTS } from 'src/constants/departements';
import Api from 'src/Axios';
import moment from 'moment';
import { findContractType } from 'src/utils';

export default {
  id: 'form-offer',
  fields: [
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
      title: "Renseignez le(s) candidat(s) à qui adresser l'offre",
      placeholder: 'Tapez un candidat',
      component: 'select-request-async',
      disable: (getValue) => {
        return getValue('isPublic') === true;
      },
      hide: (getValue) => {
        return getValue('isPublic') === true;
      },
      loadOptions: (inputValue, callback) => {
        Api.get('api/v1/user/search/candidates', {
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
      id: 'message',
      name: 'message',
      component: 'textarea',
      type: 'text',
      title: 'Message personnalisé pour le(s) candidat(s)',
      disable: (getValue) => {
        return getValue('isPublic') === true;
      },
      hide: (getValue) => {
        return getValue('isPublic') === true;
      },
    },
    {
      id: 'company',
      name: 'company',
      component: 'input',
      type: 'text',
      title: 'Nom de votre entreprise*',
    },
    {
      id: 'recruiterFirstName',
      name: 'recruiterFirstName',
      component: 'input',
      type: 'text',
      title: 'Votre prénom*',
    },
    {
      id: 'recruiterName',
      name: 'recruiterName',
      component: 'input',
      type: 'text',
      title: 'Votre nom*',
    },
    {
      id: 'recruiterPosition',
      name: 'recruiterPosition',
      component: 'input',
      type: 'text',
      title: 'Votre fonction*',
    },
    {
      id: 'recruiterMail',
      name: 'recruiterMail',
      component: 'input',
      type: 'email',
      title: 'Votre adresse mail*',
    },
    {
      id: 'recruiterPhone',
      name: 'recruiterPhone',
      component: 'input',
      type: 'tel',
      title: 'Votre numéro de téléphone*',
    },
    {
      id: 'title',
      name: 'title',
      component: 'input',
      type: 'text',
      title: 'Titre du poste proposé*',
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
      id: 'department',
      name: 'department',
      title: 'Département*',
      placeholder: 'Sélectionnez le département',
      type: 'text',
      component: 'select',
      options: FORMATTED_DEPARTMENTS,
    },
    {
      id: 'companyDescription',
      name: 'companyDescription',
      component: 'textarea',
      type: 'text',
      title: "Présentez l'entreprise en quelques mots",
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      type: 'text',
      title: "Présentez l'opportunité en quelques mots*",
    },
    {
      id: 'skills',
      name: 'skills',
      component: 'textarea',
      type: 'text',
      title: 'Écrivez 3 compétences importantes pour ce poste*',
    },
    {
      id: 'prerequisites',
      name: 'prerequisites',
      component: 'textarea',
      type: 'text',
      title: "Est-ce qu'il y a des pré-requis pour exercer cet emploi\xa0?",
    },
    {
      id: 'contract',
      name: 'contract',
      component: 'select',
      options: [{ value: -1, label: 'Choisissez un contrat' }, ...CONTRACTS],
      title: 'Type de contrat*',
      fieldsToReset: ['endOfContract'],
    },
    {
      id: 'startEndContract',
      component: 'fieldgroup',
      fields: [
        {
          id: 'startOfContract',
          name: 'startOfContract',
          title: 'Date de début de contrat',
          component: 'datepicker',
          min: moment().format('YYYY-MM-DD'),
        },
        {
          id: 'endOfContract',
          name: 'endOfContract',
          title: 'Date de fin de contrat',
          component: 'datepicker',
          min: moment().format('YYYY-MM-DD'),
          disable: (getValue) => {
            const contract = findContractType(getValue('contract'));
            return !contract || !contract.end;
          },
        },
      ],
    },
    {
      id: 'isPartTime',
      name: 'isPartTime',
      component: 'checkbox',
      title: 'Temps partiel',
    },
    {
      id: 'numberOfPositions',
      name: 'numberOfPositions',
      component: 'input',
      type: 'number',
      min: 1,
      title: 'Nombre de postes disponibles sur cette offre',
    },
    {
      id: 'beContacted',
      name: 'beContacted',
      component: 'checkbox',
      title:
        "Souhaitez-vous qu'un référent LinkedOut échange avec vous sur votre projet de recrutement inclusif\xa0?",
    },
    {
      id: 'disclaimer',
      name: 'disclaimer',
      component: 'text',
      title:
        "Les offres font l'objet d'une validation par LinkedOut avant d'être transmises aux candidats",
    },
    {
      id: 'openNewForm',
      name: 'openNewForm',
      component: 'checkbox',
      title: 'Créer une offre similaire après validation de cette offre',
    },
  ],
  rules: [
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
      field: 'recruiterFirstName',
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
      field: 'recruiterPosition',
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
    {
      field: 'skills',
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
      field: 'contract',
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
      field: 'endOfContract',
      method: (fieldValue, state) => {
        return (
          !!fieldValue &&
          !!state.startOfContract &&
          moment(fieldValue, 'YYYY-MM-DD').isBefore(
            moment(state.startOfContract, 'YYYY-MM-DD')
          )
        );
      },
      args: [],
      validWhen: false,
      message: 'Date antérieure à la date de début',
    },
    {
      field: 'candidatesId',
      args: [],
      method: (fieldValue, state) => {
        return !fieldValue && state.isPublic === false;
      },
      validWhen: false,
      message: 'Obligatoire si offre privée',
    },
  ],
};

export const adminMutation = {
  fieldId: 'candidatesId',
  props: [
    {
      propName: 'loadOptions',
      value: (inputValue, callback) => {
        Api.get('api/v1/user/search', {
          params: {
            query: inputValue,
            role: USER_ROLES.CANDIDAT,
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
  ],
};
