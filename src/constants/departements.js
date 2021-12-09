import _ from 'lodash';

const ADMIN_ZONES = {
  PARIS: 'PARIS',
  LYON: 'LYON',
  LILLE: 'LILLE',
  HZ: 'HORS ZONE',
};

const ADMIN_ZONES_FILTERS = [
  { value: ADMIN_ZONES.PARIS, label: _.capitalize(ADMIN_ZONES.PARIS) },
  { value: ADMIN_ZONES.LILLE, label: _.capitalize(ADMIN_ZONES.LILLE) },
  { value: ADMIN_ZONES.LYON, label: _.capitalize(ADMIN_ZONES.LYON) },
  { value: ADMIN_ZONES.HZ, label: _.capitalize(ADMIN_ZONES.HZ) },
];

const DEPARTMENTS = [
  {
    name: 'Ain (01)',
    zone: ADMIN_ZONES.LYON,
    region: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Aisne (02)',
    zone: ADMIN_ZONES.LILLE,
    region: 'Hauts-de-France',
  },
  {
    name: 'Allier (03)',
    zone: ADMIN_ZONES.LYON,
    region: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Alpes-de-Haute-Provence (04)',
    zone: ADMIN_ZONES.HZ,
    region: "Provence-Alpes-Côte d'Azur",
  },
  {
    name: 'Hautes-Alpes (05)',
    zone: ADMIN_ZONES.HZ,
    region: "Provence-Alpes-Côte d'Azur",
  },
  {
    name: 'Alpes-Maritimes (06)',
    zone: ADMIN_ZONES.HZ,
    region: "Provence-Alpes-Côte d'Azur",
  },
  {
    name: 'Ardèche (07)',
    zone: ADMIN_ZONES.LYON,
    region: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Ardennes (08)',
    zone: ADMIN_ZONES.HZ,
    region: 'Grand Est',
  },
  {
    name: 'Ariège (09)',
    zone: ADMIN_ZONES.HZ,
    region: 'Occitanie',
  },
  {
    name: 'Aube (10)',
    zone: ADMIN_ZONES.HZ,
    region: 'Grand Est',
  },
  {
    name: 'Aude (11)',
    zone: ADMIN_ZONES.HZ,
    region: 'Occitanie',
  },
  {
    name: 'Aveyron (12)',
    zone: ADMIN_ZONES.HZ,
    region: 'Occitanie',
  },
  {
    name: 'Bouches-du-Rhône (13)',
    zone: ADMIN_ZONES.HZ,
    region: "Provence-Alpes-Côte d'Azur",
  },
  {
    name: 'Calvados (14)',
    zone: ADMIN_ZONES.HZ,
    region: 'Normandie',
  },
  {
    name: 'Cantal (15)',
    zone: ADMIN_ZONES.LYON,
    region: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Charente (16)',
    zone: ADMIN_ZONES.HZ,
    region: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Charente-Maritime (17)',
    zone: ADMIN_ZONES.HZ,
    region: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Cher (18)',
    zone: ADMIN_ZONES.HZ,
    region: 'Centre-Val de Loire',
  },
  {
    name: 'Corrèze (19)',
    zone: ADMIN_ZONES.HZ,
    region: 'Nouvelle-Aquitaine',
  },
  {
    name: "Côte-d'Or (21)",
    zone: ADMIN_ZONES.HZ,
    region: 'Bourgogne-Franche-Comté',
  },
  {
    name: "Côtes-d'Armor (22)",
    zone: ADMIN_ZONES.HZ,
    region: 'Bretagne',
  },
  {
    name: 'Creuse (23)',
    zone: ADMIN_ZONES.HZ,
    region: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Dordogne (24)',
    zone: ADMIN_ZONES.HZ,
    region: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Doubs (25)',
    zone: ADMIN_ZONES.HZ,
    region: 'Bourgogne-Franche-Comté',
  },
  {
    name: 'Drôme (26)',
    zone: ADMIN_ZONES.LYON,
    region: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Eure (27)',
    zone: ADMIN_ZONES.HZ,
    region: 'Normandie',
  },
  {
    name: 'Eure-et-Loir (28)',
    zone: ADMIN_ZONES.HZ,
    region: 'Centre-Val de Loire',
  },
  {
    name: 'Finistère (29)',
    zone: ADMIN_ZONES.HZ,
    region: 'Bretagne',
  },
  {
    name: 'Corse-du-Sud (2A)',
    zone: ADMIN_ZONES.HZ,
    region: 'Corse',
  },
  {
    name: 'Haute-Corse (2B)',
    zone: ADMIN_ZONES.HZ,
    region: 'Corse',
  },
  {
    name: 'Gard (30)',
    zone: ADMIN_ZONES.HZ,
    region: 'Occitanie',
  },
  {
    name: 'Haute-Garonne (31)',
    zone: ADMIN_ZONES.HZ,
    region: 'Occitanie',
  },
  {
    name: 'Gers (32)',
    zone: ADMIN_ZONES.HZ,
    region: 'Occitanie',
  },
  {
    name: 'Gironde (33)',
    zone: ADMIN_ZONES.HZ,
    region: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Hérault (34)',
    zone: ADMIN_ZONES.HZ,
    region: 'Occitanie',
  },
  {
    name: 'Ille-et-Vilaine (35)',
    zone: ADMIN_ZONES.HZ,
    region: 'Bretagne',
  },
  {
    name: 'Indre (36)',
    zone: ADMIN_ZONES.HZ,
    region: 'Centre-Val de Loire',
  },
  {
    name: 'Indre-et-Loire (37)',
    zone: ADMIN_ZONES.HZ,
    region: 'Centre-Val de Loire',
  },
  {
    name: 'Isère (38)',
    zone: ADMIN_ZONES.LYON,
    region: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Jura (39)',
    zone: ADMIN_ZONES.HZ,
    region: 'Bourgogne-Franche-Comté',
  },
  {
    name: 'Landes (40)',
    zone: ADMIN_ZONES.HZ,
    region: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Loir-et-Cher (41)',
    zone: ADMIN_ZONES.HZ,
    region: 'Centre-Val de Loire',
  },
  {
    name: 'Loire (42)',
    zone: ADMIN_ZONES.LYON,
    region: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Haute-Loire (43)',
    zone: ADMIN_ZONES.LYON,
    region: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Loire-Atlantique (44)',
    zone: ADMIN_ZONES.HZ,
    region: 'Pays de la Loire',
  },
  {
    name: 'Loiret (45)',
    zone: ADMIN_ZONES.HZ,
    region: 'Centre-Val de Loire',
  },
  {
    name: 'Lot (46)',
    zone: ADMIN_ZONES.HZ,
    region: 'Occitanie',
  },
  {
    name: 'Lot-et-Garonne (47)',
    zone: ADMIN_ZONES.HZ,
    region: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Lozère (48)',
    zone: ADMIN_ZONES.HZ,
    region: 'Occitanie',
  },
  {
    name: 'Maine-et-Loire (49)',
    zone: ADMIN_ZONES.HZ,
    region: 'Pays de la Loire',
  },
  {
    name: 'Manche (50)',
    zone: ADMIN_ZONES.HZ,
    region: 'Normandie',
  },
  {
    name: 'Marne (51)',
    zone: ADMIN_ZONES.HZ,
    region: 'Grand Est',
  },
  {
    name: 'Haute-Marne (52)',
    zone: ADMIN_ZONES.HZ,
    region: 'Grand Est',
  },
  {
    name: 'Mayenne (53)',
    zone: ADMIN_ZONES.HZ,
    region: 'Pays de la Loire',
  },
  {
    name: 'Meurthe-et-Moselle (54)',
    zone: ADMIN_ZONES.HZ,
    region: 'Grand Est',
  },
  {
    name: 'Meuse (55)',
    zone: ADMIN_ZONES.HZ,
    region: 'Grand Est',
  },
  {
    name: 'Morbihan (56)',
    zone: ADMIN_ZONES.HZ,
    region: 'Bretagne',
  },
  {
    name: 'Moselle (57)',
    zone: ADMIN_ZONES.HZ,
    region: 'Grand Est',
  },
  {
    name: 'Nièvre (58)',
    zone: ADMIN_ZONES.HZ,
    region: 'Bourgogne-Franche-Comté',
  },
  {
    name: 'Nord (59)',
    zone: ADMIN_ZONES.LILLE,
    region: 'Hauts-de-France',
  },
  {
    name: 'Oise (60)',
    zone: ADMIN_ZONES.LILLE,
    region: 'Hauts-de-France',
  },
  {
    name: 'Orne (61)',
    zone: ADMIN_ZONES.HZ,
    region: 'Normandie',
  },
  {
    name: 'Pas-de-Calais (62)',
    zone: ADMIN_ZONES.LILLE,
    region: 'Hauts-de-France',
  },
  {
    name: 'Puy-de-Dôme (63)',
    zone: ADMIN_ZONES.LYON,
    region: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Pyrénées-Atlantiques (64)',
    zone: ADMIN_ZONES.HZ,
    region: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Hautes-Pyrénées (65)',
    zone: ADMIN_ZONES.HZ,
    region: 'Occitanie',
  },
  {
    name: 'Pyrénées-Orientales (66)',
    zone: ADMIN_ZONES.HZ,
    region: 'Occitanie',
  },
  {
    name: 'Bas-Rhin (67)',
    zone: ADMIN_ZONES.HZ,
    region: 'Grand Est',
  },
  {
    name: 'Haut-Rhin (68)',
    zone: ADMIN_ZONES.HZ,
    region: 'Grand Est',
  },
  {
    name: 'Rhône (69)',
    zone: ADMIN_ZONES.LYON,
    region: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Haute-Saône (70)',
    zone: ADMIN_ZONES.HZ,
    region: 'Bourgogne-Franche-Comté',
  },
  {
    name: 'Saône-et-Loire (71)',
    zone: ADMIN_ZONES.HZ,
    region: 'Bourgogne-Franche-Comté',
  },
  {
    name: 'Sarthe (72)',
    zone: ADMIN_ZONES.HZ,
    region: 'Pays de la Loire',
  },
  {
    name: 'Savoie (73)',
    zone: ADMIN_ZONES.LYON,
    region: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Haute-Savoie (74)',
    zone: ADMIN_ZONES.LYON,
    region: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Paris (75)',
    zone: ADMIN_ZONES.PARIS,
    region: 'Île-de-France',
  },
  {
    name: 'Seine-Maritime (76)',
    zone: ADMIN_ZONES.HZ,
    region: 'Normandie',
  },
  {
    name: 'Seine-et-Marne (77)',
    zone: ADMIN_ZONES.PARIS,
    region: 'Île-de-France',
  },
  {
    name: 'Yvelines (78)',
    zone: ADMIN_ZONES.PARIS,
    region: 'Île-de-France',
  },
  {
    name: 'Deux-Sèvres (79)',
    zone: ADMIN_ZONES.HZ,
    region: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Somme (80)',
    zone: ADMIN_ZONES.LILLE,
    region: 'Hauts-de-France',
  },
  {
    name: 'Tarn (81)',
    zone: ADMIN_ZONES.HZ,
    region: 'Occitanie',
  },
  {
    name: 'Tarn-et-Garonne (82)',
    zone: ADMIN_ZONES.HZ,
    region: 'Occitanie',
  },
  {
    name: 'Var (83)',
    zone: ADMIN_ZONES.HZ,
    region: "Provence-Alpes-Côte d'Azur",
  },
  {
    name: 'Vaucluse (84)',
    zone: ADMIN_ZONES.HZ,
    region: "Provence-Alpes-Côte d'Azur",
  },
  {
    name: 'Vendée (85)',
    zone: ADMIN_ZONES.HZ,
    region: 'Pays de la Loire',
  },
  {
    name: 'Vienne (86)',
    zone: ADMIN_ZONES.HZ,
    region: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Haute-Vienne (87)',
    zone: ADMIN_ZONES.HZ,
    region: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Vosges (88)',
    zone: ADMIN_ZONES.HZ,
    region: 'Grand Est',
  },
  {
    name: 'Yonne (89)',
    zone: ADMIN_ZONES.HZ,
    region: 'Bourgogne-Franche-Comté',
  },
  {
    name: 'Territoire de Belfort (90)',
    zone: ADMIN_ZONES.HZ,
    region: 'Bourgogne-Franche-Comté',
  },
  {
    name: 'Essonne (91)',
    zone: ADMIN_ZONES.PARIS,
    region: 'Île-de-France',
  },
  {
    name: 'Hauts-de-Seine (92)',
    zone: ADMIN_ZONES.PARIS,
    region: 'Île-de-France',
  },
  {
    name: 'Seine-Saint-Denis (93)',
    zone: ADMIN_ZONES.PARIS,
    region: 'Île-de-France',
  },
  {
    name: 'Val-de-Marne (94)',
    zone: ADMIN_ZONES.PARIS,
    region: 'Île-de-France',
  },
  {
    name: "Val-d'Oise (95)",
    zone: ADMIN_ZONES.PARIS,
    region: 'Île-de-France',
  },
  {
    name: 'Guadeloupe (971)',
    zone: ADMIN_ZONES.HZ,
    region: 'Guadeloupe',
  },
  {
    name: 'Martinique (972)',
    zone: ADMIN_ZONES.HZ,
    region: 'Martinique',
  },
  {
    name: 'Guyane (973)',
    zone: ADMIN_ZONES.HZ,
    region: 'Guyane',
  },
  {
    name: 'La Réunion (974)',
    zone: ADMIN_ZONES.HZ,
    region: 'La Réunion',
  },

  {
    name: 'Mayotte (976)',
    zone: ADMIN_ZONES.HZ,
    region: 'Mayotte',
  },
];

const REGIONS_LABELS = {
  'Île-de-France': 'Paris et sa région',
  'Auvergne-Rhône-Alpes': 'Lyon et sa région',
  'Hauts-de-France': 'Lille et sa région',
};

const REGIONS_FILTERS = _.sortBy(
  Object.values(
    DEPARTMENTS.reduce((acc, curr) => {
      if (acc[curr.region]) {
        return {
          ...acc,
          [curr.region]: {
            ...acc[curr.region],
            children: [...acc[curr.region].children, curr.name],
          },
        };
      }
      return {
        ...acc,
        [curr.region]: {
          value: curr.region,
          label: REGIONS_LABELS[curr.region] ?? curr.region,
          zone: curr.zone,
          children: [curr.name],
        },
      };
    }, {})
  ),
  'label'
);

const DEPARTMENTS_FILTERS = [
  ...DEPARTMENTS.map(({ name, zone }) => {
    return {
      value: name,
      label: name,
      zone,
    };
  }),
];

const FORMATTED_DEPARTMENTS = [
  {
    value: -1,
    label: 'Choisissez un département',
  },
  ...DEPARTMENTS.map(({ name }) => {
    return {
      value: name,
      label: name,
    };
  }),
];

export {
  DEPARTMENTS,
  ADMIN_ZONES,
  FORMATTED_DEPARTMENTS,
  DEPARTMENTS_FILTERS,
  REGIONS_FILTERS,
  ADMIN_ZONES_FILTERS,
};
