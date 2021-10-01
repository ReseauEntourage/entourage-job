import { CONTRACTS } from 'src/constants';
import moment from 'moment';

export default {
  id: 'form-edit-employed',
  fields: [
    {
      id: 'contract',
      title: 'Contrat*',
      name: 'contract',
      component: 'select',
      options: [{ value: -1, label: 'Choisissez un contrat' }, ...CONTRACTS],
      fieldsToReset: ['endOfContract'],
    },
    {
      id: 'endOfContract',
      title: 'Date de fin de contrat',
      name: 'endOfContract',
      component: 'datepicker',
      min: moment().format('YYYY-MM-DD'),
      disable: (getValue) => {
        const contract = CONTRACTS.find((contractConst) => {
          return contractConst.value === getValue('contract');
        });
        return !contract || !contract.end;
      },
    },
  ],
  rules: [
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
      method: 'isBefore',
      args: [moment().format('YYYY-MM-DD')],
      validWhen: false,
      message: "Date antérieure à aujourd'hui",
    },
  ],
};
