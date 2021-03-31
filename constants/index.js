const TAGS = require('./tags');

const OFFER_STATUS = [
  { value: -1, label: 'Offre à traiter', color: 'muted' },
  { value: 0, label: 'Contacté', color: 'muted' },
  { value: 1, label: "Phase d'entretien", color: 'warning' },
  { value: 2, label: 'Embauche', color: 'success' },
  { value: 3, label: 'Refus avant entretien', color: 'danger' },
  { value: 4, label: 'Refus après entretien', color: 'danger' },
];

const BUSINESS_LINES = [
  {
    value: 'Administration / Fonction publique',
    label: 'Administration / Fonction publique',
  },
  {
    value: 'Agroalimentaire',
    label: 'Agroalimentaire',
  },
  {
    value: "Artisanat d'art",
    label: "Artisanat d'art",
  },
  {
    value: 'Associations',
    label: 'Associations',
  },
  {
    value: 'Banques / Assurances / Services financiers',
    label: 'Banques / Assurances / Services financiers',
  },
  {
    value: 'Commerce de détail / Grande distribution',
    label: 'Commerce de détail / Grande distribution',
  },
  {
    value: 'Communication / Marketing / Information',
    label: 'Communication / Marketing / Information',
  },
  {
    value: 'Construction / Bâtiment / Travaux publics',
    label: 'Construction / Bâtiment / Travaux publics',
  },
  {
    value: 'Culture / Sports / Loisirs',
    label: 'Culture / Sports / Loisirs',
  },
  {
    value: 'Énergie',
    label: 'Énergie',
  },
  {
    value: "Environnement / Traitement des déchets et de l'eau",
    label: "Environnement / Traitement des déchets et de l'eau",
  },
  {
    value: 'Gestion / Administration des entreprises',
    label: 'Gestion / Administration des entreprises',
  },
  {
    value: 'Hôtellerie / Restauration / Tourisme',
    label: 'Hôtellerie / Restauration / Tourisme',
  },
  {
    value: 'Immobilier',
    label: 'Immobilier',
  },
  {
    value: 'Industrie textile',
    label: 'Industrie textile',
  },
  {
    value: 'Informatique',
    label: 'Informatique',
  },
  {
    value: 'Logistique / Transports',
    label: 'Logistique / Transports',
  },
  {
    value: 'Matériel électrique / Électronique / Optique',
    label: 'Matériel électrique / Électronique / Optique',
  },
  {
    value: 'Mécanique / Métallurgie',
    label: 'Mécanique / Métallurgie',
  },
  {
    value: 'Santé / Action sociale',
    label: 'Santé / Action sociale',
  },
  {
    value: 'Services aux particuliers / Aux collectivités / Aux entreprises',
    label: 'Services aux particuliers / Aux collectivités / Aux entreprises',
  },
];

const LOCATIONS = [
  {
    value: 'Île-de-France',
    label: 'Île-de-France',
    children: [
      {
        value: 'Paris & proche banlieue',
        label: 'Paris & proche banlieue',
        children: [
          {
            value: 'Val-de-Marne (94)',
            label: 'Val-de-Marne (94)',
          },
          {
            value: 'Seine-Saint-Denis (93)',
            label: 'Seine-Saint-Denis (93)',
          },
          {
            value: 'Hauts-de-Seine (92)',
            label: 'Hauts-de-Seine (92)',
          },
          {
            value: 'Paris (75)',
            label: 'Paris (75)',
          },
        ],
      },
      {
        value: "Val-d'Oise (95)",
        label: "Val-d'Oise (95)",
      },
      {
        value: 'Essonne (91)',
        label: 'Essonne (91)',
      },
      {
        value: 'Yvelines (78)',
        label: 'Yvelines (78)',
      },
      {
        value: 'Seine-et-Marne (77)',
        label: 'Seine-et-Marne (77)',
      },
    ],
  },
  {
    value: 'Lille (59)',
    label: 'Lille (59)',
  },
];

const CV_FILTERS_DATA = [
  {
    key: 'businessLines',
    constants: BUSINESS_LINES,
    title: "Secteurs d'activité",
    tag: TAGS.PAGE_GALERIE_FILTRE_SECTEURS_CLIC,
  },
  {
    key: 'locations',
    constants: LOCATIONS,
    title: 'Secteurs géographiques',
    tag: TAGS.PAGE_GALERIE_FILTRE_GEOGRAPHIQUE_CLIC,
  },
  {
    key: 'hideEmployed',
    type: 'checkbox',
    constants: [{ label: 'Masquer les candidats employés', value: true }],
    title: 'Masquer les candidats ayant retrouvé un emploi',
  },
];

const OPPORTUNITY_FILTERS_DATA = [
  {
    key: 'status',
    constants: OFFER_STATUS,
    title: 'Status',
  },
  {
    key: 'isPublic',
    type: 'checkbox',
    constants: [{ label: 'Masquer les offres privées', value: true }],
    title: 'Masquer les offres privées',
  },
];

const CV_STATUS = {
  Published: {
    label: 'Publié',
    value: 'Published',
    style: 'success',
  },
  Pending: {
    label: 'En attente',
    value: 'Pending',
    style: 'danger',
  },
  Progress: {
    label: 'En cours',
    value: 'Progress',
    style: 'muted',
  },
  New: {
    label: 'Nouveau',
    value: 'New',
    style: 'muted',
  },
  Draft: {
    label: 'Brouillon',
    value: 'Draft',
    style: 'warning',
  },
  Unknown: {
    label: 'Inconnu',
    value: 'Unknown',
    style: '',
  },
};

const USER_ROLES = {
  COACH: 'Coach',
  CANDIDAT: 'Candidat',
  ADMIN: 'Admin',
};

const EXTERNAL_LINKS = {
  DONATION: 'https://entourage.iraiser.eu/linkedout/~mon-don',
  LKO_VG: 'https://www.linkedout-vendeeglobe.com',
  LKO_VG_CONTEST: 'https://www.linkedout-vendeeglobe.com/vendeearctique',
  LKO_BLOG: 'https://blog.linkedout.fr',
  ENTOURAGE: 'https://www.entourage.social',
  LEGAL_MENTIONS:
    'https://docs.google.com/document/d/1a1IU9Y6qVDr4pvWJRE5XMVZ2fNhg0rhXMTL_lqY_f1M/pub',
  ARTICLE_BC: 'https://blog.entourage.social/2020/06/22/benevole-coach/',
  CAMPUS_INCLUSION: 'https://campus-inclusion.fr',
  FRANCE_UNE_CHANCE:
    'https://lafrance-unechance.fr/carte-des-clubs-la-france-une-chance/',
};

const NEWSLETTER_ORIGINS = {
  LKO: 'LKO',
  LKO_ENTREPRISES: 'LKO_ENTREPRISES',
};

const REDIS_KEYS = {
  CV_PREFIX: 'cv-',
  CV_LIST: 'cvList',
  CVS_TOTAL_SHARES: 'cvsTotalShares',
  RL_AUTH: 'rl-auth:',
  RL_GENERAL: 'rl-general:',
};

const STORAGE_KEYS = {
  CV_FILTERS_PUBLIC: 'cv-filters-public',
  CV_FILTERS_COMPANY: 'cv-filters-company',
  ACCESS_TOKEN: 'access-token',
};

const JOBS = {
  JOB_TYPES: {
    GENERATE_CV_PDF: 'generate_cv_pdf',
    GENERATE_CV_PREVIEW: 'generate_cv_preview',
    CREATE_CV_SEARCH_STRING: 'create_cv_search_string',
    CACHE_CV: 'cache_cv',
    CACHE_ALL_CVS: 'cache_all_cvs',
    SEND_MAIL: 'send_mail',
    INSERT_AIRTABLE: 'insert_airtable',
    UPDATE_AIRTABLE: 'update_airtable',
  },
  QUEUES: {
    WORK: 'work',
  },
};

const SOCKETS = {
  CHANNEL_NAMES: {
    CV_PREVIEW: 'cv-preview-channel',
    CV_PDF: 'cv-pdf-channel',
  },
  EVENTS: {
    CV_PREVIEW_DONE: 'cv-preview-done',
    CV_PDF_DONE: 'cv-pdf-done',
  },
};

const AIRTABLE_NAMES = {
  NEWSLETTER: 'Newsletter',
  OFFERS: "Offres d'emploi v2",
};

const VALUES = {
  SHARES: 120000,
};

const CONTACT_INFO = {
  CORPORATE_CONTACT: 'entreprises@linkedout.fr',
  MAIN_PHONE_NUMBER: '01 88 24 70 70',
  MOBILE_PHONE_NUMBER: '07 68 03 73 48',
};

const INITIAL_NB_OF_CV_TO_DISPLAY = 9;

module.exports = {
  OFFER_STATUS,
  CV_STATUS,
  USER_ROLES,
  BUSINESS_LINES,
  EXTERNAL_LINKS,
  VALUES,
  LOCATIONS,
  CV_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
  NEWSLETTER_ORIGINS,
  REDIS_KEYS,
  JOBS,
  CONTACT_INFO,
  INITIAL_NB_OF_CV_TO_DISPLAY,
  AIRTABLE_NAMES,
  SOCKETS,
  STORAGE_KEYS,
};
