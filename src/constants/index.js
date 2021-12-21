import TAGS from 'src/constants/tags';

import {
  ADMIN_ZONES,
  ADMIN_ZONES_FILTERS,
  DEPARTMENTS_FILTERS,
  REGIONS_FILTERS,
} from 'src/constants/departements';
import _ from 'lodash';

const OFFER_STATUS = [
  {
    value: -1,
    label: 'Offre à traiter',
    alt: 'Offre consultée',
    color: 'muted',
  },
  { value: 0, label: 'Contacté', color: 'muted' },
  { value: 1, label: "Phase d'entretien", color: 'warning' },
  { value: 2, label: 'Embauche', color: 'success' },
  { value: 3, label: 'Refus avant entretien', color: 'danger' },
  { value: 4, label: 'Refus après entretien', color: 'danger' },
];

const BUSINESS_LINES = [
  {
    label: 'Accueil / Administratif / Gestion / Comptabilité',
    value: 'Accueil / Administratif / Gestion / Comptabilité',
  },
  {
    label: 'Artisanat / Art',
    value: 'Artisanat / Art',
  },
  {
    label: 'Associatif',
    value: 'Associatif',
  },
  {
    label: 'Bâtiment',
    value: 'Bâtiment',
  },
  {
    label: 'Communication / Marketing / Information',
    value: 'Communication / Marketing / Information',
  },
  {
    label: 'Électronique',
    value: 'Électronique',
  },
  {
    label: 'Entretien',
    value: 'Entretien',
  },
  {
    label: 'Espaces Verts / Agriculture / Maraîchage',
    value: 'Espaces Verts / Agriculture / Maraîchage',
  },
  {
    label: 'Grande distribution',
    value: 'Grande distribution',
  },
  {
    label: 'Hôtellerie / Tourisme',
    value: 'Hôtellerie / Tourisme',
  },
  {
    label: 'Informatique',
    value: 'Informatique',
  },
  {
    label: 'Logistique / Préparation de commande / Magasinier',
    value: 'Logistique / Préparation de commande / Magasinier',
  },
  {
    label: 'Maintenance / Manutention',
    value: 'Maintenance / Manutention',
  },
  {
    label: 'Mécanique / Métallurgie',
    value: 'Mécanique / Métallurgie',
  },
  {
    label: 'Production',
    value: 'Production',
  },
  {
    label: 'Restauration',
    value: 'Restauration',
  },
  {
    label: 'Santé / Aide à la personne / Action sociale',
    value: 'Santé / Aide à la personne / Action sociale',
  },
  {
    label: 'Sécurité',
    value: 'Sécurité',
  },
  {
    label: 'Services aux particuliers / Garde d’enfants',
    value: 'Services aux particuliers / Garde d’enfants',
  },
  {
    label: 'Traitement des déchets / Eau',
    value: 'Traitement des déchets / Eau',
  },
  {
    label: 'Transports / Livraisons',
    value: 'Transports / Livraisons',
  },
  {
    label: 'Vente (conseil client, caisse …)',
    value: 'Vente (conseil client, caisse …)',
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

const OFFER_CANDIDATE_FILTERS_DATA = [
  { tag: 'all', title: 'Toutes les offres' },
  { tag: 'private', title: 'Offres personnelles', active: true },
  { tag: 'public', title: 'Offres générales' },
  { tag: 'archived', title: 'Offres archivées' },
];

const OFFER_ADMIN_FILTERS_DATA = [
  { tag: 'all', title: 'Toutes les offres' },
  { tag: 'pending', title: 'Offres à valider', active: true },
  { tag: 'validated', title: 'Offres publiées' },
  { tag: 'archived', title: 'Offres archivées' },
];

const CV_FILTERS_DATA = [
  {
    key: 'employed',
    type: 'checkbox',
    constants: [
      { label: "Recherche d'emploi", value: false },
      { label: 'En emploi', value: true },
    ],
    title: 'Masquer les candidats en emploi',
  },
  {
    key: 'locations',
    constants: REGIONS_FILTERS,
    priority: _.orderBy(
      REGIONS_FILTERS.filter((region) => {
        return region.zone !== ADMIN_ZONES.HZ;
      }),
      'label',
      'desc'
    ),
    title: 'Où ?',
    tag: TAGS.PAGE_GALERIE_FILTRE_GEOGRAPHIQUE_CLIC,
    icon: 'location',
  },
  {
    key: 'businessLines',
    constants: BUSINESS_LINES,
    title: 'Secteur',
    tag: TAGS.PAGE_GALERIE_FILTRE_SECTEURS_CLIC,
  },
];

const OPPORTUNITY_FILTERS_DATA = [
  {
    key: 'isPublic',
    constants: [
      { label: 'Offres privées', value: false },
      { label: 'Offres générales', value: true },
    ],
    title: 'Privée/générale',
  },
  {
    key: 'status',
    constants: OFFER_STATUS,
    title: 'Statut',
  },
  {
    key: 'department',
    constants: DEPARTMENTS_FILTERS,
    priority: DEPARTMENTS_FILTERS.filter((dept) => {
      return dept.zone !== ADMIN_ZONES.HZ;
    }),
    title: 'Département',
  },
];

const MEMBER_FILTERS_DATA = [
  {
    key: 'zone',
    constants: ADMIN_ZONES_FILTERS,
    title: 'Zone',
  },
  {
    key: 'associatedUser',
    constants: [
      { label: 'Binôme en cours', value: true },
      { label: 'Sans binôme', value: false },
    ],
    title: 'Membre associé',
  },
  {
    key: 'hidden',
    constants: [
      { label: 'CV masqués', value: true },
      { label: 'CV visibles', value: false },
    ],
    title: 'CV masqué',
  },
  {
    key: 'employed',
    constants: [
      { label: 'En emploi', value: true },
      { label: "Recherche d'emploi", value: false },
    ],
    title: 'En emploi',
  },
  {
    key: 'cvStatus',
    constants: [
      CV_STATUS.Published,
      CV_STATUS.Pending,
      CV_STATUS.Progress,
      CV_STATUS.New,
    ],
    title: 'Statut du CV',
  },
];

const USER_ROLES = {
  COACH: 'Coach',
  CANDIDAT: 'Candidat',
  ADMIN: 'Admin',
};

const ADMIN_ROLES = {
  CANDIDATES: 'Candidats',
  COMPANIES: 'Entreprises',
};

const CONTRACTS = [
  {
    label: 'CDI',
    value: 'cdi',
    end: false,
  },
  {
    label: 'CDD + de 6 mois',
    value: 'cdd+6',
    end: true,
  },
  {
    label: 'CDD - de 6 mois',
    value: 'cdd-6',
    end: true,
  },
  {
    label: "Contrat d'insertion",
    value: 'cddi',
    end: true,
  },
  {
    label: 'Alternance',
    value: 'alt',
    end: true,
  },
  {
    label: 'Intérim',
    value: 'inte',
    end: true,
  },
  {
    label: 'Stage',
    value: 'stage',
    end: true,
  },
  {
    label: 'Autre',
    value: 'other',
    end: true,
  },
];

const EXTERNAL_LINKS = {
  DONATION: 'https://entourage.iraiser.eu/linkedout/~mon-don',
  LKO_VG: 'https://www.linkedout-vendeeglobe.com',
  LKO_VG_CONTEST: 'https://www.linkedout-vendeeglobe.com/vendeearctique',
  LKO_BLOG: 'https://blog.linkedout.fr',
  ENTOURAGE: 'https://www.entourage.social',
  LEGAL_MENTIONS:
    'https://docs.google.com/document/d/1a1IU9Y6qVDr4pvWJRE5XMVZ2fNhg0rhXMTL_lqY_f1M/pub',
  ARTICLE_BC: 'https://blog.entourage.social/2020/06/22/benevole-coach/',
  ARTICLE_TJV:
    'https://blog.linkedout.fr/2021/11/25/le-bateau-linkedout-vainqueur-de-la-transat-jacques-vabre/',
  CAMPUS_INCLUSION: 'https://campus-inclusion.fr',
  FRANCE_UNE_CHANCE:
    'https://lafrance-unechance.fr/carte-des-clubs-la-france-une-chance/',
  REPAIRS_75: 'https://www.repairs75.org/',
  REDSTAR:
    'https://blog.linkedout.fr/2021/07/21/apres-la-voile-le-foot-linkedout-nouveau-partenaire-maillot-du-red-star-fc-avec-le-soutien-de-randstad/',
  TOOLBOX:
    'https://drive.google.com/drive/folders/1fUhZtsdaAElpjWsC6Rz4Jw5ZJ94vBnSd?usp=sharing',
  RECRUITMENTS: 'https://www.welcometothejungle.com/fr/companies/entourage',
};

const NEWSLETTER_TAGS = {
  ZONE: [
    {
      label: 'Région parisienne',
      tag: ADMIN_ZONES.PARIS,
    },
    {
      label: 'Lyon',
      tag: ADMIN_ZONES.LYON,
    },
    {
      label: 'Lille',
      tag: ADMIN_ZONES.LILLE,
    },
    {
      label: 'Autre',
      tag: ADMIN_ZONES.HZ,
    },
  ],
  STATUS: [
    {
      label: 'un particulier',
      tag: 'PARTICULIER',
    },
    {
      label: 'une entreprise',
      tag: 'ENTREPRISE',
    },
    {
      label: "une structure d'insertion",
      tag: 'STRUCTURE_INSERTION',
    },
    {
      label: 'un candidat potentiel',
      tag: 'CANDIDAT_POTENTIEL',
    },
  ],
};

const REDIS_KEYS = {
  CV_PREFIX: 'cv-',
  CV_LIST: 'cvList',
  CVS_TOTAL_SHARES: 'cvsTotalShares',
  RL_AUTH: 'rl-auth:',
  RL_GENERAL: 'rl-general:',
};

const STORAGE_KEYS = {
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
    REMINDER_OFFER: 'reminder_offer',
  },
  QUEUES: {
    WORK: 'work',
    IMAGE: 'image',
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

const VALUES = { SHARES: 120000 + 64000 };

const CONTACT_INFO = {
  CORPORATE_CONTACT: 'barnabe@entourage.social',
  MAIN_PHONE_NUMBER: '01 88 24 70 70',
  MOBILE_PHONE_NUMBER: '07 82 44 97 39',
};

const INITIAL_NB_OF_CV_TO_DISPLAY = 9;

const MAILJET_TEMPLATES = {
  ACCOUNT_CREATED: 3267718,
  CV_SUBMITTED: 3271289,
  PASSWORD_RESET: 3271976,
  CONTACT_FORM: 3272334,
  STATUS_CHANGED: 3275058,
  OFFER_TO_VALIDATE: 3275461,
  OFFER_RECEIVED: 3275876,
  OFFER_SENT: 3276147,
  OFFER_VALIDATED: 3277863,
  OFFER_VALIDATED_ADMIN: 3320744,
  OFFER_REMINDER: 3279365,
  OFFERS_RECAP: 3279701,
};

const HEARD_ABOUT = [
  {
    label: 'Par un de mes contacts',
    value: 'contact',
  },
  {
    label: 'Recherche internet',
    value: 'search',
  },
  {
    label: 'Publicité sur les réseaux sociaux',
    value: 'socialAdd',
  },
  {
    label: 'Autre publicité',
    value: 'otherAdd',
  },
  {
    label: 'Press',
    value: 'press',
  },
  {
    label: 'Autre',
    value: 'other',
  },
];

export {
  OFFER_STATUS,
  CV_STATUS,
  USER_ROLES,
  BUSINESS_LINES,
  EXTERNAL_LINKS,
  VALUES,
  CV_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
  OFFER_CANDIDATE_FILTERS_DATA,
  OFFER_ADMIN_FILTERS_DATA,
  MEMBER_FILTERS_DATA,
  NEWSLETTER_TAGS,
  REDIS_KEYS,
  JOBS,
  CONTACT_INFO,
  INITIAL_NB_OF_CV_TO_DISPLAY,
  SOCKETS,
  STORAGE_KEYS,
  ADMIN_ROLES,
  CONTRACTS,
  MAILJET_TEMPLATES,
  HEARD_ABOUT,
};
