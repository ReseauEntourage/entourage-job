import Api from 'src/Axios';
import { USER_ROLES } from 'src/constants';

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
        { value: -1, label: 'Choisissez un role' },
        { value: USER_ROLES.CANDIDAT, label: USER_ROLES.CANDIDAT },
        { value: USER_ROLES.COACH, label: USER_ROLES.COACH },
        { value: USER_ROLES.ADMIN, label: USER_ROLES.ADMIN },
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
          Api.get('api/v1/user/search', {
            params: {
              query: inputValue,
              role, // un certain role
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
