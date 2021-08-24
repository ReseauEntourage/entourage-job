import _ from 'lodash';
import axios from '../../../Axios';
import { USER_ROLES } from '../../../constants';
import { ADMIN_ZONES } from '../../../constants/departements';

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
      placeholder: "Tapez l'adresse mail",
      title: 'Adresse mail*',
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
      id: 'zone',
      title: 'Zone*',
      name: 'zone',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez une zone' },
        { value: ADMIN_ZONES.PARIS, label: _.capitalize(ADMIN_ZONES.PARIS) },
        { value: ADMIN_ZONES.LILLE, label: _.capitalize(ADMIN_ZONES.LILLE) },
        { value: ADMIN_ZONES.LYON, label: _.capitalize(ADMIN_ZONES.LYON) },
        { value: ADMIN_ZONES.HZ, label: _.capitalize(ADMIN_ZONES.HZ) },
      ],
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
      disable: (getValue) => {
        return (
          getValue('role') !== USER_ROLES.CANDIDAT &&
          getValue('role') !== USER_ROLES.COACH
        );
      },
      loadOptions: (inputValue, callback, getValue) => {
        if (inputValue.length > 0) {
          const role =
            getValue('role') === USER_ROLES.COACH
              ? USER_ROLES.CANDIDAT
              : USER_ROLES.COACH;
          axios
            .get('api/v1/user/search', {
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
      placeholder: 'Tapez le nom du coach ou candidat à lier',
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
    {
      field: 'zone',
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
