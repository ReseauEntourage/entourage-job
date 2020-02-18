// import axios from '../../../Axios';

export default {
  id: 'form-offer',
  fields: [
    {
      id: 'title',
      name: 'title',
      component: 'input',
      type: 'text',
      title: 'Titre du poste proposé**',
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
      type: 'text',
      title: 'Adresse mail du recruteur*',
    },
    {
      id: 'recruiterPhone',
      name: 'recruiterPhone',
      component: 'input',
      type: 'text',
      title: 'Téléphone du recruteur',
    },
    {
      id: 'businessLines',
      name: 'businessLines',
      title: "Secteur d'activité*",
      placeholder: "Selectionnez les secteurs d'activité",
      type: 'text',
      component: 'select-request',
      isMulti: true,
      options: [
        {
          value: 'Accueil',
          label: 'Accueil',
        },
        {
          value: 'Administratif',
          label: 'Administratif',
        },
        {
          value: 'Animalier',
          label: 'Animalier',
        },
        {
          value: 'Artisanat',
          label: 'Artisanat',
        },
        {
          value: 'Associatif',
          label: 'Associatif',
        },
        {
          value: 'Assurance/Banque',
          label: 'Assurance/Banque',
        },
        {
          value: 'BTP',
          label: 'BTP',
        },
        {
          value: 'Communication',
          label: 'Communication',
        },
        {
          value: 'Culture',
          label: 'Culture',
        },
        {
          value: 'Informatique',
          label: 'Informatique',
        },
        {
          value: 'Interpréterait',
          label: 'Interpréterait',
        },
        {
          value: 'Médico-social',
          label: 'Médico-social',
        },
        {
          value: 'Restauration',
          label: 'Restauration',
        },
        {
          value: 'Social',
          label: 'Social',
        },
        {
          value: 'Transports',
          label: 'Transports',
        },
        {
          value: 'Vente / Commerce',
          label: 'Vente / Commerce',
        },
      ],
    },
    {
      id: 'company',
      name: 'company',
      component: 'input',
      type: 'text',
      title: 'Entreprise',
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
      title: 'Votre description',
    },
    {
      id: 'isPublic',
      name: 'isPublic',
      component: 'checkbox',
      title: "L'offre est elle générale ?",
    },
    // {
    //   id: 'linkedUser',
    //   name: 'linkedUser',
    //   isMulti: true,
    //   type: 'text',
    //   title: 'Si oui, tapez la candidat lié',
    //   placeholder: 'Tapez un candidat',
    //   component: 'select-request-async',
    //   loadOptions: (inputValue, callback) => {
    //     axios
    //       .get('api/v1/user/search', {
    //         params: {
    //           query: inputValue,
    //           role: 'Candidat',
    //         },
    //       })
    //       .then(({ data }) =>
    //         data.map((u) => ({
    //           value: u.id,
    //           label: `${u.firstName} ${u.lastName}`,
    //         }))
    //       )
    //       .then(callback);
    //   },
    // },
  ],
  rules: [
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
  ],
};
