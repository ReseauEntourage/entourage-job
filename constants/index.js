const OFFER_STATUS = [
  {value: -1, label: "Offre à traiter"},
  {value: 0, label: "Contacté"},
  {value: 1, label: "Phase d'entretien"},
  {value: 2, label: "Embauche"},
  {value: 3, label: "Refus"},
  {value: 4, label: "Standby"},
  {value: 5, label: "Relance"}
];

const BUSINESS_LINES = [
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
    value: 'Interprétariat',
    label: 'Interprétariat',
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
];

const CV_STATUS = {
  Pending: {
    label: "En attente",
    value: "Pending",
    style: "muted"
  },
  Published:
    {
      label: "Publié",
      value: "Published",
      style: "success"
    },
  New:
    {
      label: "Nouveau",
      value: "New",
      style: "info"
    },
  Draft:
    {
      label: "Brouillon",
      value: "Draft",
      style: "warning"
    },
  Unkown:
    {
      label: "Inconnu",
      value: "unknown",
      style: ""
    }
};

const USER_ROLES = {
  COACH: 'Coach',
  CANDIDAT: 'Candidat',
  ADMIN: 'Admin',
};

const EXTERNAL_LINKS = {
  DONATION: "https://don.entourage.social/?_ga=2.51486825.130511908.1589373822-697393147.1588101221"
};

module.exports = {
  OFFER_STATUS,
  CV_STATUS,
  USER_ROLES,
  BUSINESS_LINES,
  EXTERNAL_LINKS
};