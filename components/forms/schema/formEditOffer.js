import {BUSINESS_LINES} from '../../../constants';

export default {
  "id": "form-offer",
  "fields": [
    {
      "id": "firstName",
      "name": "firstName",
      "component": "input",
      "type": "text",
      "title": "Prenom*"
    },
    {
      "id": "lastName",
      "name": "lastName",
      "component": "input",
      "type": "text",
      "title": "Nom*"
    },
    {
      "id": "email",
      "name": "email",
      "component": "input",
      "type": "text",
      "title": "Email*"
    },
    {
      "id": "phone",
      "name": "phone",
      "component": "input",
      "type": "text",
      "title": "Téléphone*"
    },
    {
      "id": "job",
      "name": "job",
      "component": "input",
      "type": "text",
      "title": "Nom du poste proposé*"
    },
    {
      "id": "businessLine",
      "name": "businessLine",
      "title": "Secteur d'activité*",
      "placeholder": "Sélectionnez le secteur d'activité",
      "type": "text",
      "component": "select-request-creatable",
      "options": BUSINESS_LINES
    },
    {
      "id": "company",
      "name": "company",
      "component": "input",
      "type": "text",
      "title": "Entreprise*"
    },
    {
      "id": "localization",
      "name": "localization",
      "component": "input",
      "type": "text",
      "title": "Localisation*"
    },
    {
      "id": "message",
      "name": "message",
      "component": "textarea",
      "type": "text",
      "title": "Votre message*"
    }
  ],
  "rules": [
    {
      "field": "firstName",
      "method": "isEmpty",
      "args": [
        {
          "ignore_whitespace": true
        }
      ],
      "validWhen": false,
      "message": "Obligatoire"
    },
    {
      "field": "lastName",
      "method": "isEmpty",
      "args": [
        {
          "ignore_whitespace": true
        }
      ],
      "validWhen": false,
      "message": "Obligatoire"
    },
    {
      "field": "email",
      "method": "isEmpty",
      "args": [
        {
          "ignore_whitespace": true
        }
      ],
      "validWhen": false,
      "message": "Obligatoire"
    },
    {
      "field": "phone",
      "method": "isEmpty",
      "args": [
        {
          "ignore_whitespace": true
        }
      ],
      "validWhen": false,
      "message": "Obligatoire"
    },
    {
      "field": "businessLine",
      "method": "isEmpty",
      "args": [
        {
          "ignore_whitespace": true
        }
      ],
      "validWhen": false,
      "message": "Obligatoire"
    },
    {
      "field": "company",
      "method": "isEmpty",
      "args": [
        {
          "ignore_whitespace": true
        }
      ],
      "validWhen": false,
      "message": "Obligatoire"
    },
    {
      "field": "job",
      "method": "isEmpty",
      "args": [
        {
          "ignore_whitespace": true
        }
      ],
      "validWhen": false,
      "message": "Obligatoire"
    },
    {
      "field": "localization",
      "method": "isEmpty",
      "args": [
        {
          "ignore_whitespace": true
        }
      ],
      "validWhen": false,
      "message": "Obligatoire"
    },
    {
      "field": "message",
      "method": "isEmpty",
      "args": [
        {
          "ignore_whitespace": true
        }
      ],
      "validWhen": false,
      "message": "Obligatoire"
    }
  ]
}
