import axios from '../../../Axios';

export default {
  id: 'form-edit-linked-user',
  fields: [
    {
      id: 'role',
      title: 'Role*',
      name: 'role',
      component: 'select',
      disabled: true,
      hidden: true,
      options: [
        { value: null, text: 'Choisissez un role' },
        { value: 'Candidat', text: 'Candidat' },
        { value: 'Coach', text: 'Coach' },
        { value: 'Admin', text: 'Admin' },
      ],
    },
    {
      id: 'linkedUser',
      name: 'linkedUser',
      type: 'text',
      component: 'select-request-async',
      cacheOptions: false,
      loadOptions: (inputValue, callback, getValue) => {
        if (inputValue.length > 0) {
          const role = getValue('role');
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
      placeholder: "Tapez le nom d'un utilisateur",
      title: 'Coach ou candidat lié',
    },
  ],
  rules: [],
};
