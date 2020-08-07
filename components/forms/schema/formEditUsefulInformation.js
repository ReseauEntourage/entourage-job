import {LOCATIONS} from '../../../constants';
import {getAllFilters} from "../../../utils";


export default {
  "id": "form-usefullinformation",
  "fields": [
    {
      "id": "contracts",
      "name": "contracts",
      "title": "Type de contrat recherché",
      "type": "text",
      "component": "select-request-creatable",
      "isMulti": true
    },
    {
      "id": "locations",
      "name": "locations",
      "type": "text",
      "title": "Lieu de travail souhaité",
      "component": "select-request-creatable",
      "options": getAllFilters(LOCATIONS),
      "isMulti": true
    },
    {
      "id": "availability",
      "name": "availability",
      "component": "input",
      "type": "text",
      "title": "Disponibilités de travail possibles"
    },
    {
      "id": "languages",
      "name": "languages",
      "type": "text",
      "title": "Langues parlées",
      "component": "select-request-creatable",
      "isMulti": true
    },
    {
      "id": "transport",
      "name": "transport",
      "component": "input",
      "type": "text",
      "title": "Permis de conduire"
    }
  ],
  "rules": [
    {
      "field": "contracts",
      "method": "isLength",
      "args": [
        {
          "max": 120
        }
      ],
      "validWhen": true,
      "message": "120 caractères maximum"
    },
    {
      "field": "location",
      "method": "isLength",
      "args": [
        {
          "max": 100
        }
      ],
      "validWhen": true,
      "message": "100 caractères maximum"
    },
    {
      "field": "availability",
      "method": "isLength",
      "args": [
        {
          "max": 40
        }
      ],
      "validWhen": true,
      "message": "40 caractères maximum"
    },
    {
      "field": "languages",
      "method": "isLength",
      "args": [
        {
          "max": 100
        }
      ],
      "validWhen": true,
      "message": "100 caractères maximum"
    },
    {
      "field": "transport",
      "method": "isLength",
      "args": [
        {
          "max": 100
        }
      ],
      "validWhen": true,
      "message": "100 caractères maximum"
    }
  ]
}