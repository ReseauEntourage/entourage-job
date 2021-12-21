import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import SimpleLink from 'src/components/utils/SimpleLink';
import { IconNoSSR } from 'src/components/utils/Icon';

const partnersPlaces = [
  {
    title: 'Mediapole',
    lat: 48.606821,
    lng: 2.3005192,
    contactName: 'Catherine YVELISE',
    contactFunction: 'Coach emploi',
    contactNumber: '0637757809',
    contactMail: 'yvelise.catherine@groupevitaminet.com',
    address: 'Gare de Brétigny-sur-Orge, 91220 Bretigny-sur-Orge',
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Janus 77',
    lat: 48.8535246,
    lng: 2.7643001,
    contactName: 'Catherine YVELISE',
    contactFunction: 'Coach emploi',
    contactNumber: '0637757809',
    contactMail: 'yvelise.catherine@groupevitaminet.com',
    address: "14, avenue de l'Europe, 77144 Montevrain",
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Janus',
    lat: 50.69133,
    lng: 3.18253,
    contactName: "Florence D'AYER",
    contactFunction: 'Responsable emploi',
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: 'Tour Blériot, 69 Rue Jules WATTEEW, 59100 ROUBAIX',
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Envie Nord',
    lat: 50.72535,
    lng: 3.14692,
    contactName: "Florence D'AYER",
    contactFunction: 'Responsable emploi',
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '37 Rue Jean Froissart, 59200 TOURCOING',
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Vitinser',
    lat: 50.77968,
    lng: 3.10505,
    contactName: "Florence D'AYER",
    contactFunction: 'Responsable emploi',
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '230, rue de la Lys 59250 HALLUIN',
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Solutis Nord',
    lat: 50.45099,
    lng: 3.4118,
    contactName: "Florence D'AYER",
    contactFunction: 'Responsable emploi',
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '215, rue du Marillon 59230 SAINT AMAND LES EAUX',
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Le Grenier',
    lat: 50.56195,
    lng: 3.03894,
    contactName: "Florence D'AYER",
    contactFunction: 'Responsable emploi',
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '46, route de  Lille 59113 SECLIN',
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Le Grenier',
    lat: 50.562961,
    lng: 2.8629111,
    contactName: "Florence D'AYER",
    contactFunction: 'Responsable emploi',
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '601, rue du faulx 59274 MARQUILLIES',
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Janus',
    lat: 50.4959774,
    lng: 2.9625709,
    contactName: "Florence D'AYER",
    contactFunction: 'Responsable emploi',
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '117, rue Anne Franck 62220 CARVIN',
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Janus',
    lat: 50.397363,
    lng: 3.101444,
    contactName: "Florence D'AYER",
    contactFunction: 'Responsable emploi',
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address:
      "709, rue Jean Perrin - Hôtel d'Entreprises de Douai Dorignies 59500 DOUAI",
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Soluval',
    lat: 50.3352322,
    lng: 3.238691,
    contactName: "Florence D'AYER",
    contactFunction: 'Responsable emploi',
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '4, rue des Frères Faches 59580 ANICHE',
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Envie Nord',
    lat: 50.3945529,
    lng: 3.4791842,
    contactName: "Florence D'AYER",
    contactFunction: 'Responsable emploi',
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '19, rue du cimetière 59590 RAIMES',
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Janus',
    lat: 50.3628727,
    lng: 3.5208385,
    contactName: "Florence D'AYER",
    contactFunction: 'Responsable emploi',
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '40-42, rue Hon Hon 59300 VALENCIENNES',
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Janus',
    lat: 50.2841826,
    lng: 3.9402437,
    contactName: "Florence D'AYER",
    contactFunction: 'Responsable emploi',
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: "49, rue de l'égalité ZI Petite Savate 59600 MAUBEUGE",
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'La Ferme des Jésuites',
    lat: 51.0116846,
    lng: 2.268134,
    contactName: "Florence D'AYER",
    contactFunction: 'Responsable emploi',
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '283 rue de Quenez 59279 MARDYCK LOON PLAGE',
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Envie Nord',
    lat: 49.9059515,
    lng: 2.2754966,
    contactName: "Florence D'AYER",
    contactFunction: 'Responsable emploi',
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '21, rue Alfred Catel 80000 AMIENS',
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Janus',
    lat: 49.7730384,
    lng: 4.7205225,
    contactName: "Florence D'AYER",
    contactFunction: 'Responsable emploi',
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '16, rue du petit bois 08000 CHARLEVILLE MEZIERES',
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Foyer Notre-Dame des sans-abri',
    lat: 45.7633014,
    lng: 4.9364005,
    contactName: 'Maryline MACCHI',
    contactNumber: '0618807852',
    contactFunction: 'Chargée de Partenariats Emploi',
    contactMail: 'mmacchi@cvgce.org',
    address: '12 Rue Emile Zola, 69150 Décines-Charpieu',
    link: 'https://convergence-france.org/',
  },
  {
    title: 'Armée du salut',
    lat: 45.773894,
    lng: 4.9130243,
    contactName: 'Maryline MACCHI',
    contactNumber: '0618807852',
    contactFunction: 'Chargée de Partenariats Emploi',
    contactMail: 'mmacchi@cvgce.org',
    address: '2 Rue Stalingrad, 69120 Vaulx-en-Velin',
    link: 'https://convergence-france.org/',
  },
  {
    title: 'Le grenier de Lahso',
    lat: 45.7618994,
    lng: 4.8621717,
    contactName: 'Maryline MACCHI',
    contactNumber: '0618807852',
    contactFunction: 'Chargée de Partenariats Emploi',
    contactMail: 'mmacchi@cvgce.org',
    address: '24 Rue Riboud, 69003 Lyon',
    link: 'https://convergence-france.org/',
  },
  {
    title: 'Ménage et Propreté',
    lat: 48.9223279,
    lng: 2.2091179,
    contactName: 'Catherine YVELISE',
    contactFunction: 'Coach emploi',
    contactNumber: '0637757809',
    contactMail: 'yvelise.catherine@groupevitaminet.com',
    address: 'Rue Emile Zola, 95870 Bezons',
    link: 'https://www.groupevitaminet.com/',
  },
  {
    title: 'Ares Service Seine et Marne (77)',
    lat: 48.6398925,
    lng: 2.5720423,
    contactName: 'Youssouf ALI',
    contactFunction: 'Chargé de projet emploi',
    contactNumber: '0635313119',
    contactMail: 'partenaire-emploi@ares-association.fr',
    address: "42 Rue de l'Innovation, 77550 Moissy-Cramayel",
    link: 'https://www.groupeares.fr/notre-groupe/',
  },
  {
    title: 'Ares Service Val de Marne (94)',
    lat: 48.7828641,
    lng: 2.5042718,
    contactName: 'Myriam BITRAN',
    contactFunction: 'Chargée de mission emploi',
    contactNumber: '0609518528',
    contactMail: 'partenaire-emploi@ares-association.fr',
    address: '73 Rue du Moulin Bateau, 94380 Bonneuil-sur-Marne',
    link: 'https://www.groupeares.fr/notre-groupe/',
  },
  {
    title: 'Atelier sans Frontière',
    lat: 48.7828641,
    lng: 2.5042718,
    contactName: 'Xénia NEDELCOUX',
    contactFunction: 'Cheffe de projets emploi',
    contactNumber: '0776195638',
    contactMail: 'partenaire-emploi@ares-association.fr',
    address: '73 Rue du Moulin Bateau, 94380 Bonneuil-sur-Marne',
    link: 'https://www.groupeares.fr/notre-groupe/',
  },
  {
    title: "Log'ins Ile de France",
    lat: 48.5882379,
    lng: 2.4408674,
    contactName: 'Valérie DE FOURNOUX',
    contactFunction: 'Cheffe de projets emploi',
    contactNumber: '0634310152',
    contactMail: 'partenaire-emploi@ares-association.fr',
    address: 'Rue des 44 Arpents, 91100 Villabé',
    link: 'https://www.groupeares.fr/notre-groupe/',
  },
  {
    title: "Log'ins Auvergne Rhône Alpes",
    lat: 45.8428954,
    lng: 5.2778809,
    contactName: 'Valérie DE FOURNOUX',
    contactFunction: 'Cheffe de projets emploi',
    contactNumber: '0634310152',
    contactMail: 'partenaire-emploi@ares-association.fr',
    address:
      'Allée des peupliers - Bâtiment C – Zone Distripole 01150 SAINT-VULBAS',
    link: 'https://www.groupeares.fr/notre-groupe/',
  },
  {
    title: 'Arescoop',
    lat: 45.1880604,
    lng: -1.0426095,
    contactName: 'Frédéric CHAOUNI',
    contactNumber: '0661408032',
    contactMail: 'partenaire-emploi@ares-association.fr',
    address: '3 rue de l’Industrie 33990 Hourtin',
    link: 'https://www.groupeares.fr/notre-groupe/',
  },
  {
    title: 'ASBL',
    lat: 47.1837448,
    lng: -1.4555582,
    address: '3, allée du Cap Horn, 44120 Vertou',
    contactName: 'Marion MESSAGÉ',
    contactFunction: 'Coordinatrice',
    contactNumber: '0608862243',
    contactMail: 'mmessage@cvgce.org',
    link: 'https://asbl44.com',
  },
  {
    title: 'Océan',
    lat: 47.2249155,
    lng: -1.6429736,
    address: '15, rue Gustave Eiffel, 44800 Saint-Herblain',
    contactName: 'Marion MESSAGÉ',
    contactFunction: 'Coordinatrice',
    contactNumber: '0608862243',
    contactMail: 'mmessage@cvgce.org',
    link: 'https://ocean-insertion-44.org/',
  },
  {
    title: "Trajet – Atelier Bara'Mel",
    lat: 47.2576057,
    lng: -1.6565575,
    address: '9, route de Brimberne, 44880 Sautron',
    contactName: 'Marion MESSAGÉ',
    contactFunction: 'Coordinatrice',
    contactNumber: '0608862243',
    contactMail: 'mmessage@cvgce.org',
    link: 'https://asso-trajet.fr/',
  },
  {
    title: 'Emmaüs Mundo',
    lat: 48.6314679,
    lng: 7.7161878,
    address: '4, Rue du Général Rapp, 67450 Mundolsheim',
    contactName: 'Isabelle ITIC',
    contactFunction: 'Chargée de Partenariats Emploi',
    contactNumber: '0609475489',
    contactMail: 'iitic@cvgce.org',
    link: 'https://emmausmundo.wordpress.com/',
  },
  {
    title: 'Joffre',
    lat: 48.5568142,
    lng: 7.653349,
    address: 'Route de Lingolsheim, 67810 Holtzheim',
    contactName: 'Isabelle ITIC',
    contactNumber: '0609475489',
    contactFunction: 'Chargée de Partenariats Emploi',
    contactMail: 'iitic@cvgce.org',
    link: 'https://www.ursiea.org/index.php/structures/ateliers_chantiers_insertion/206',
  },
  {
    title: 'Les jardins de la montagne verte',
    lat: 48.5790226,
    lng: 7.7200782,
    address: '5, Avenue du Cimetière, 67200 Strasbourg',
    contactName: 'Isabelle ITIC',
    contactNumber: '0609475489',
    contactFunction: 'Chargée de Partenariats Emploi',
    contactMail: 'iitic@cvgce.org',
    link: 'https://www.jardins-montagne-verte.com/',
  },
];

const buildGMapsLink = (address) => {
  return `https://maps.google.com/?q=${address}`;
};
const buildEmailLink = (email) => {
  return `mailto:${email}`;
};

const FRANCE_CENTER_COORDINATES = { lat: 46.71109, lng: 1.7191036 };

const PartnersMap = ({ google }) => {
  const [clickedMarker, setClickedMarker] = useState(null);

  const getPartnerPlaceInfo = (infoKey) => {
    const info = clickedMarker && partnersPlaces[clickedMarker.id][infoKey];
    return info || '';
  };

  return (
    <Map
      google={google}
      zoom={6}
      containerStyle={{
        position: 'relative',
        width: '100%',
        height: '80vh',
      }}
      style={{ width: '100%', height: '100%', position: 'relative' }}
      initialCenter={FRANCE_CENTER_COORDINATES}
      mapTypeControl={false}
      streetViewControl={false}
      noClear
    >
      {partnersPlaces.map((partner, index) => {
        return (
          <Marker
            title={partner.title}
            id={index}
            key={index}
            position={{ lat: partner.lat, lng: partner.lng }}
            onClick={(_, marker) => {
              return setClickedMarker(marker);
            }}
          />
        );
      })}
      <InfoWindow
        visible={clickedMarker}
        marker={clickedMarker}
        onClose={() => {
          return setClickedMarker(null);
        }}
      >
        <div>
          <h4 className="uk-text-primary uk-text-bold uk-text-center">
            <SimpleLink
              href={getPartnerPlaceInfo('link')}
              isExternal
              target="_blank"
            >
              {getPartnerPlaceInfo('title')}
            </SimpleLink>
          </h4>
          <p>
            <IconNoSSR name="user" className="uk-margin-small-right" />
            <span>
              {getPartnerPlaceInfo('contactName')},&nbsp;
              {getPartnerPlaceInfo('contactFunction').toLowerCase()}
            </span>
          </p>
          <p>
            <IconNoSSR name="phone" className="uk-margin-small-right" />
            <a href={`tel:${getPartnerPlaceInfo('contactNumber')}`}>
              {getPartnerPlaceInfo('contactNumber')}
            </a>
          </p>
          <p>
            <IconNoSSR name="mail" className="uk-margin-small-right" />
            <a
              href={buildEmailLink(getPartnerPlaceInfo('contactMail'))}
              target="_blank"
              rel="noopener noreferrer"
            >
              {getPartnerPlaceInfo('contactMail')}
            </a>
          </p>
          <p>
            <IconNoSSR name="location" className="uk-margin-small-right" />
            <a
              href={buildGMapsLink(getPartnerPlaceInfo('address'))}
              target="_blank"
              rel="noopener noreferrer"
            >
              {getPartnerPlaceInfo('address')}
            </a>
          </p>
        </div>
      </InfoWindow>
    </Map>
  );
};

PartnersMap.propTypes = {
  google: PropTypes.shape().isRequired,
};

export default GoogleApiWrapper({
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
})(PartnersMap);

export const PartnersMapNoSSR = dynamic(
  () => {
    return import('src/components/partials/PartnersMap');
  },
  {
    ssr: false,
  }
);
