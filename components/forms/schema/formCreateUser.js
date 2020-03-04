import axios from '../../../Axios';

export default {
  id: 'form-add-user',
  fields: [
    {
      id: 'firstName',
      name: 'firstName',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez le prénom',
      title: 'Prénom*',
    },
    {
      id: 'lastName',
      name: 'lastName',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez le nom',
      title: 'Nom*',
    },
    {
      id: 'gender',
      title: 'Genre*',
      name: 'gender',
      component: 'select',
      options: [
        { value: null, text: 'Choisissez un genre' },
        { value: 0, text: 'Homme' },
        { value: 1, text: 'Femme' },
      ],
    },
    {
      id: 'email',
      name: 'email',
      type: 'email',
      component: 'input',
      placeholder: 'Tapez votre adresse mail',
      title: 'Adresse mail*',
    },
    {
      id: 'role',
      title: 'Role*',
      name: 'role',
      component: 'select',
      options: [
        { value: null, text: 'Choisissez un role' },
        { value: 'Candidat', text: 'Candidat' },
        { value: 'Coach', text: 'Coach' },
        { value: 'Admin', text: 'Admin' },
      ],
    },
    {
      id: 'userToCoach',
      name: 'userToCoach',
      type: 'text',
      component: 'select-request-async',
      cacheOptions: false,
      disable: (getValue) =>
        getValue('role') !== 'Candidat' && getValue('role') !== 'Coach',
      loadOptions: (inputValue, callback, getValue) => {
        if (inputValue.length > 0) {
          const role = getValue('role') === 'Coach' ? 'Candidat' : 'Coach';
          axios
            .get('api/v1/user/search', {
              params: {
                query: inputValue,
                role, // un certain role
              },
            })
            .then(({ data }) =>
              data.map((u) => ({
                value: u.id,
                label: `${u.firstName} ${u.lastName}`,
              }))
            )
            .then((m) => {
              console.log(m);
              return m;
            })
            .then(callback);
        } else {
          callback([]);
        }
      },
      placeholder: 'Tapez si candidat son coach et si coach son candidat',
      title: 'Coach ou candidat lié',
    },
  ],
  rules: [
    {
      field: 'email',
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
      field: 'email',
      method: 'isEmail',
      validWhen: true,
      message: 'Adresse e-mail invalide',
    },
  ],
};
