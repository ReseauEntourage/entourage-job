const DEPARTMENTS = [
  {
    numDep: '01',
    depName: 'Ain',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    numDep: '02',
    depName: 'Aisne',
    regionName: 'Hauts-de-France',
  },
  {
    numDep: '03',
    depName: 'Allier',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    numDep: '04',
    depName: 'Alpes-de-Haute-Provence',
    regionName: "Provence-Alpes-Côte d'Azur",
  },
  {
    numDep: '05',
    depName: 'Hautes-Alpes',
    regionName: "Provence-Alpes-Côte d'Azur",
  },
  {
    numDep: '06',
    depName: 'Alpes-Maritimes',
    regionName: "Provence-Alpes-Côte d'Azur",
  },
  {
    numDep: '07',
    depName: 'Ardèche',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    numDep: '08',
    depName: 'Ardennes',
    regionName: 'Grand Est',
  },
  {
    numDep: '09',
    depName: 'Ariège',
    regionName: 'Occitanie',
  },
  {
    numDep: '10',
    depName: 'Aube',
    regionName: 'Grand Est',
  },
  {
    numDep: '11',
    depName: 'Aude',
    regionName: 'Occitanie',
  },
  {
    numDep: '12',
    depName: 'Aveyron',
    regionName: 'Occitanie',
  },
  {
    numDep: '13',
    depName: 'Bouches-du-Rhône',
    regionName: "Provence-Alpes-Côte d'Azur",
  },
  {
    numDep: '14',
    depName: 'Calvados',
    regionName: 'Normandie',
  },
  {
    numDep: '15',
    depName: 'Cantal',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    numDep: '16',
    depName: 'Charente',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    numDep: '17',
    depName: 'Charente-Maritime',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    numDep: '18',
    depName: 'Cher',
    regionName: 'Centre-Val de Loire',
  },
  {
    numDep: '19',
    depName: 'Corrèze',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    numDep: '21',
    depName: "Côte-d'Or",
    regionName: 'Bourgogne-Franche-Comté',
  },
  {
    numDep: '22',
    depName: "Côtes-d'Armor",
    regionName: 'Bretagne',
  },
  {
    numDep: '23',
    depName: 'Creuse',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    numDep: '24',
    depName: 'Dordogne',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    numDep: '25',
    depName: 'Doubs',
    regionName: 'Bourgogne-Franche-Comté',
  },
  {
    numDep: '26',
    depName: 'Drôme',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    numDep: '27',
    depName: 'Eure',
    regionName: 'Normandie',
  },
  {
    numDep: '28',
    depName: 'Eure-et-Loir',
    regionName: 'Centre-Val de Loire',
  },
  {
    numDep: '29',
    depName: 'Finistère',
    regionName: 'Bretagne',
  },
  {
    numDep: '2A',
    depName: 'Corse-du-Sud',
    regionName: 'Corse',
  },
  {
    numDep: '2B',
    depName: 'Haute-Corse',
    regionName: 'Corse',
  },
  {
    numDep: '30',
    depName: 'Gard',
    regionName: 'Occitanie',
  },
  {
    numDep: '31',
    depName: 'Haute-Garonne',
    regionName: 'Occitanie',
  },
  {
    numDep: '32',
    depName: 'Gers',
    regionName: 'Occitanie',
  },
  {
    numDep: '33',
    depName: 'Gironde',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    numDep: '34',
    depName: 'Hérault',
    regionName: 'Occitanie',
  },
  {
    numDep: '35',
    depName: 'Ille-et-Vilaine',
    regionName: 'Bretagne',
  },
  {
    numDep: '36',
    depName: 'Indre',
    regionName: 'Centre-Val de Loire',
  },
  {
    numDep: '37',
    depName: 'Indre-et-Loire',
    regionName: 'Centre-Val de Loire',
  },
  {
    numDep: '38',
    depName: 'Isère',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    numDep: '39',
    depName: 'Jura',
    regionName: 'Bourgogne-Franche-Comté',
  },
  {
    numDep: '40',
    depName: 'Landes',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    numDep: '41',
    depName: 'Loir-et-Cher',
    regionName: 'Centre-Val de Loire',
  },
  {
    numDep: '42',
    depName: 'Loire',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    numDep: '43',
    depName: 'Haute-Loire',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    numDep: '44',
    depName: 'Loire-Atlantique',
    regionName: 'Pays de la Loire',
  },
  {
    numDep: '45',
    depName: 'Loiret',
    regionName: 'Centre-Val de Loire',
  },
  {
    numDep: '46',
    depName: 'Lot',
    regionName: 'Occitanie',
  },
  {
    numDep: '47',
    depName: 'Lot-et-Garonne',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    numDep: '48',
    depName: 'Lozère',
    regionName: 'Occitanie',
  },
  {
    numDep: '49',
    depName: 'Maine-et-Loire',
    regionName: 'Pays de la Loire',
  },
  {
    numDep: '50',
    depName: 'Manche',
    regionName: 'Normandie',
  },
  {
    numDep: '51',
    depName: 'Marne',
    regionName: 'Grand Est',
  },
  {
    numDep: '52',
    depName: 'Haute-Marne',
    regionName: 'Grand Est',
  },
  {
    numDep: '53',
    depName: 'Mayenne',
    regionName: 'Pays de la Loire',
  },
  {
    numDep: '54',
    depName: 'Meurthe-et-Moselle',
    regionName: 'Grand Est',
  },
  {
    numDep: '55',
    depName: 'Meuse',
    regionName: 'Grand Est',
  },
  {
    numDep: '56',
    depName: 'Morbihan',
    regionName: 'Bretagne',
  },
  {
    numDep: '57',
    depName: 'Moselle',
    regionName: 'Grand Est',
  },
  {
    numDep: '58',
    depName: 'Nièvre',
    regionName: 'Bourgogne-Franche-Comté',
  },
  {
    numDep: '59',
    depName: 'Nord',
    regionName: 'Hauts-de-France',
  },
  {
    numDep: '60',
    depName: 'Oise',
    regionName: 'Hauts-de-France',
  },
  {
    numDep: '61',
    depName: 'Orne',
    regionName: 'Normandie',
  },
  {
    numDep: '62',
    depName: 'Pas-de-Calais',
    regionName: 'Hauts-de-France',
  },
  {
    numDep: '63',
    depName: 'Puy-de-Dôme',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    numDep: '64',
    depName: 'Pyrénées-Atlantiques',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    numDep: '65',
    depName: 'Hautes-Pyrénées',
    regionName: 'Occitanie',
  },
  {
    numDep: '66',
    depName: 'Pyrénées-Orientales',
    regionName: 'Occitanie',
  },
  {
    numDep: '67',
    depName: 'Bas-Rhin',
    regionName: 'Grand Est',
  },
  {
    numDep: '68',
    depName: 'Haut-Rhin',
    regionName: 'Grand Est',
  },
  {
    numDep: '69',
    depName: 'Rhône',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    numDep: '70',
    depName: 'Haute-Saône',
    regionName: 'Bourgogne-Franche-Comté',
  },
  {
    numDep: '71',
    depName: 'Saône-et-Loire',
    regionName: 'Bourgogne-Franche-Comté',
  },
  {
    numDep: '72',
    depName: 'Sarthe',
    regionName: 'Pays de la Loire',
  },
  {
    numDep: '73',
    depName: 'Savoie',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    numDep: '74',
    depName: 'Haute-Savoie',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    numDep: '75',
    depName: 'Paris',
    regionName: 'Île-de-France',
  },
  {
    numDep: '76',
    depName: 'Seine-Maritime',
    regionName: 'Normandie',
  },
  {
    numDep: '77',
    depName: 'Seine-et-Marne',
    regionName: 'Île-de-France',
  },
  {
    numDep: '78',
    depName: 'Yvelines',
    regionName: 'Île-de-France',
  },
  {
    numDep: '79',
    depName: 'Deux-Sèvres',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    numDep: '80',
    depName: 'Somme',
    regionName: 'Hauts-de-France',
  },
  {
    numDep: '81',
    depName: 'Tarn',
    regionName: 'Occitanie',
  },
  {
    numDep: '82',
    depName: 'Tarn-et-Garonne',
    regionName: 'Occitanie',
  },
  {
    numDep: '83',
    depName: 'Var',
    regionName: "Provence-Alpes-Côte d'Azur",
  },
  {
    numDep: '84',
    depName: 'Vaucluse',
    regionName: "Provence-Alpes-Côte d'Azur",
  },
  {
    numDep: '85',
    depName: 'Vendée',
    regionName: 'Pays de la Loire',
  },
  {
    numDep: '86',
    depName: 'Vienne',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    numDep: '87',
    depName: 'Haute-Vienne',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    numDep: '88',
    depName: 'Vosges',
    regionName: 'Grand Est',
  },
  {
    numDep: '89',
    depName: 'Yonne',
    regionName: 'Bourgogne-Franche-Comté',
  },
  {
    numDep: '90',
    depName: 'Territoire de Belfort',
    regionName: 'Bourgogne-Franche-Comté',
  },
  {
    numDep: '91',
    depName: 'Essonne',
    regionName: 'Île-de-France',
  },
  {
    numDep: '92',
    depName: 'Hauts-de-Seine',
    regionName: 'Île-de-France',
  },
  {
    numDep: '93',
    depName: 'Seine-Saint-Denis',
    regionName: 'Île-de-France',
  },
  {
    numDep: '94',
    depName: 'Val-de-Marne',
    regionName: 'Île-de-France',
  },
  {
    numDep: '95',
    depName: "Val-d'Oise",
    regionName: 'Île-de-France',
  },
  {
    numDep: '971',
    depName: 'Guadeloupe',
    regionName: 'Guadeloupe',
  },
  {
    numDep: '972',
    depName: 'Martinique',
    regionName: 'Martinique',
  },
  {
    numDep: '973',
    depName: 'Guyane',
    regionName: 'Guyane',
  },
  {
    numDep: '974',
    depName: 'La Réunion',
    regionName: 'La Réunion',
  },
  {
    numDep: '976',
    depName: 'Mayotte',
    regionName: 'Mayotte',
  },
];

const FORMATTED_DEPARTMENTS = [
  { value: -1, label: 'Choisissez un département' },
  ...DEPARTMENTS.map(({ depName, numDep }) => {
    const formattedName = `${depName} (${numDep})`;
    return {
      value: formattedName,
      label: formattedName,
    };
  }),
];

module.exports = {
  DEPARTMENTS,
  FORMATTED_DEPARTMENTS,
};
