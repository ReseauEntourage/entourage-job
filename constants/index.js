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
    value: "Accueil",
    label: "Accueil",
  },
  {
    value: "Administratif",
    label: "Administratif",
  },
  {
    value: "Animalier",
    label: "Animalier",
  },
  {
    value: "Artisanat",
    label: "Artisanat",
  },
  {
    value: "Associatif",
    label: "Associatif",
  },
  {
    value: "Assurances / Banques",
    label: "Assurances / Banques",
  },
  {
    value: "Communication",
    label: "Communication",
  },
  {
    value: "Construction / BTP",
    label: "Construction / BTP",
  },
  {
    value: "Culture",
    label: "Culture",
  },
  {
    value: "Entretien",
    label: "Entretien"
  },
  {
    value: "Hôtellerie / Restauration",
    label: "Hôtellerie / Restauration"
  },
  {
    value: "Industrie",
    label: "Industrie"
  },
  {
    value: "Informatique",
    label: "Informatique",
  },
  {
    value: "Interprétariat",
    label: "Interprétariat",
  },
  {
    value: "Jardinage / Espaces verts",
    label: "Jardinage / Espaces verts",
  },
  {
    value: "Mécanique",
    label: "Mécanique",
  },
  {
    value: "Médico-social",
    label: "Médico-social",
  },
  {
    value: "Secrétariat / Assistanat",
    label: "Secrétariat / Assistanat"
  },
  {
    value: "Services à la personne",
    label: "Services à la personne",
  },
  {
    value: "Social",
    label: "Social",
  },
  {
    value: "Transports / Logistique",
    label: "Transports / Logistique",
  },
  {
    value: "Vente / Commerce",
    label: "Vente / Commerce",
  },
];

const LOCATIONS = [
  {
    value: "Île-de-France",
    label: "Île-de-France",
    children: [
      {
        value: "Paris & proche banlieue",
        label: "Paris & proche banlieue",
        children: [
          {
            value: "Val-de-Marne (94)",
            label: "Val-de-Marne (94)"
          },
          {
            value: "Seine-Saint-Denis (93)",
            label: "Seine-Saint-Denis (93)",
          },
          {
            value: "Hauts-de-Seine (92)",
            label: "Hauts-de-Seine (92)",
          },
          {
            value: "Paris (75)",
            label: "Paris (75)",
          },
        ]
      },
      {
        value: "Val-d'Oise (95)",
        label: "Val-d'Oise (95)"
      },
      {
        value: "Essonne (91)",
        label: "Essonne (91)",
      },
      {
        value: "Yvelines (78)",
        label: "Yvelines (78)",
      },
      {
        value: "Seine-et-Marne (77)",
        label: "Seine-et-Marne (77)"
      },
    ]
  },
  {
    value: "Lille (59)",
    label: "Lille (59)"
  }
];

const FILTERS_DATA = [
  {
    key: 'businessLines',
    constants: BUSINESS_LINES,
    title: "Secteurs d'activité"
  },
  {
    key: 'locations',
    constants: LOCATIONS,
    title: "Zones géographiques"
  }
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
  Unknown:
    {
      label: "Inconnu",
      value: "Unknown",
      style: ""
    }
};

const USER_ROLES = {
  COACH: "Coach",
  CANDIDAT: "Candidat",
  ADMIN: "Admin",
};

const EXTERNAL_LINKS = {
  DONATION: "https://entourage.iraiser.eu/linkedout/~mon-don",
  LKO_VG: "https://www.linkedout-vendeeglobe.com",
  LKO_VG_CONTEST: "https://www.linkedout-vendeeglobe.com/vendeearctique",
  LKO_BLOG: "https://blog.linkedout.fr",
  ENTOURAGE: "https://www.entourage.social",
  LEGAL_MENTIONS: "https://docs.google.com/document/d/1a1IU9Y6qVDr4pvWJRE5XMVZ2fNhg0rhXMTL_lqY_f1M/pub"
};

const VALUES = {
  SHARES: 120000
};

module.exports = {
  OFFER_STATUS,
  CV_STATUS,
  USER_ROLES,
  BUSINESS_LINES,
  EXTERNAL_LINKS,
  VALUES,
  LOCATIONS,
  FILTERS_DATA
};
