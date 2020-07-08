import axios from '../../../Axios';
import {USER_ROLES} from "../../../constants";

export default {
  id: 'form-edit-user',
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
        { value: -1, label: 'Choisissez un genre' },
        { value: 0, label: 'Homme' },
        { value: 1, label: 'Femme' },
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
        { value: -1, label: 'Choisissez un role' },
        { value: USER_ROLES.CANDIDAT, label: USER_ROLES.CANDIDAT },
        { value: USER_ROLES.COACH, label: USER_ROLES.COACH },
        { value: USER_ROLES.ADMIN, label: USER_ROLES.ADMIN },
      ],
    },
    {
      id: 'userToCoach',
      name: 'userToCoach',
      type: 'text',
      component: 'select-request-async',
      cacheOptions: false,
      disable: (getValue) =>
        getValue('role') !== USER_ROLES.CANDIDAT && getValue('role') !== USER_ROLES.COACH,
      loadOptions: (inputValue, callback, getValue) => {
        if (inputValue.length > 0) {
          const role = getValue('role') === USER_ROLES.COACH ? USER_ROLES.CANDIDAT : USER_ROLES.COACH;
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
      field: 'firstName',
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
      field: 'lastName',
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
      field: 'gender',
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
      field: 'role',
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
