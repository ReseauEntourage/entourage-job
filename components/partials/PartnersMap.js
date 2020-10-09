import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

const partnersPlaces = [
  {
    title: 'Mediapole',
    lat: 48.606821,
    lng: 2.3005192,
    contactName: 'Catherine YVELISE',
    contactNumber: '0637757809',
    contactMail: 'yvelise.catherine@groupevitaminet.com',
    address: 'Gare de Brétigny-sur-Orge, 91220 Bretigny-sur-Orge',
  },
  {
    title: 'Janus 77',
    lat: 48.8535246,
    lng: 2.7643001,
    contactName: 'Catherine YVELISE',
    contactNumber: '0637757809',
    contactMail: 'yvelise.catherine@groupevitaminet.com',
    address: "14, avenue de l'Europe, 77144 Montevrain",
  },
  {
    title: 'Janus',
    lat: 50.69133,
    lng: 3.18253,
    contactName: "Florence D'AYER",
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: 'Tour Blériot, 69 Rue Jules WATTEEW, 59100 ROUBAIX',
  },
  {
    title: 'Envie Nord',
    lat: 50.72535,
    lng: 3.14692,
    contactName: "Florence D'AYER",
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '37 Rue Jean Froissart, 59200 TOURCOING',
  },
  {
    title: 'Vitinser',
    lat: 50.77968,
    lng: 3.10505,
    contactName: "Florence D'AYER",
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '230, rue de la Lys 59250 HALLUIN',
  },
  {
    title: 'Solutis Nord',
    lat: 50.45099,
    lng: 3.4118,
    contactName: "Florence D'AYER",
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '215, rue du Marillon 59230 SAINT AMAND LES EAUX',
  },
  {
    title: 'Le Grenier',
    lat: 50.56195,
    lng: 3.03894,
    contactName: "Florence D'AYER",
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '46, route de  Lille 59113 SECLIN',
  },
  {
    title: 'Le Grenier',
    lat: 50.562961,
    lng: 2.8629111,
    contactName: "Florence D'AYER",
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '601, rue du faulx 59274 MARQUILLIES',
  },
  {
    title: 'Janus',
    lat: 50.4959774,
    lng: 2.9625709,
    contactName: "Florence D'AYER",
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '117, rue Anne Franck 62220 CARVIN',
  },
  {
    title: 'Janus',
    lat: 50.397363,
    lng: 3.101444,
    contactName: "Florence D'AYER",
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address:
      "709, rue Jean Perrin - Hôtel d'Entreprises de Douai Dorignies 59500 DOUAI",
  },
  {
    title: 'Soluval',
    lat: 50.3352322,
    lng: 3.238691,
    contactName: "Florence D'AYER",
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '4, rue des Frères Faches 59580 ANICHE',
  },
  {
    title: 'Envie Nord',
    lat: 50.3945529,
    lng: 3.4791842,
    contactName: "Florence D'AYER",
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '19, rue du cimetière 59590 RAIMES',
  },
  {
    title: 'Janus',
    lat: 50.3628727,
    lng: 3.5208385,
    contactName: "Florence D'AYER",
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '40-42, rue Hon Hon 59300 VALENCIENNES',
  },
  {
    title: 'Janus',
    lat: 50.2841826,
    lng: 3.9402437,
    contactName: "Florence D'AYER",
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: "49, rue de l'égalité ZI Petite Savate 59600 MAUBEUGE",
  },
  {
    title: 'La Ferme des Jésuites',
    lat: 51.0116846,
    lng: 2.268134,
    contactName: "Florence D'AYER",
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '283 rue de Quenez 59279 MARDYCK LOON PLAGE',
  },
  {
    title: 'Envie Nord',
    lat: 49.9059515,
    lng: 2.2754966,
    contactName: "Florence D'AYER",
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '21, rue Alfred Catel 80000 AMIENS',
  },
  {
    title: 'Janus',
    lat: 49.7730384,
    lng: 4.7205225,
    contactName: "Florence D'AYER",
    contactNumber: '0320617070',
    contactMail: 'florence.dayer@groupevitaminet.com',
    address: '16, rue du petit bois 08000 CHARLEVILLE MEZIERES',
  },
  {
    title: 'Foyer Notre-Dame des sans-abri',
    lat: 45.7633014,
    lng: 4.9364005,
    contactName: 'Claire DEVERINE',
    contactNumber: '0757479697',
    contactMail: 'cdeverine@cvgce.org',
    address: '12 Rue Emile Zola, 69150 Décines-Charpieu',
  },
  {
    title: 'Armée du salut',
    lat: 45.773894,
    lng: 4.9130243,
    contactName: 'Claire DEVERINE',
    contactNumber: '0757479697',
    contactMail: 'cdeverine@cvgce.org',
    address: '2 Rue Stalingrad, 69120 Vaulx-en-Velin',
  },
  {
    title: 'Le grenier de Lahso',
    lat: 45.7618994,
    lng: 4.8621717,
    contactName: 'Claire DEVERINE',
    contactNumber: '0757479697',
    contactMail: 'cdeverine@cvgce.org',
    address: '24 Rue Riboud, 69003 Lyon',
  },
  {
    title: 'Ménage et Propreté',
    lat: 48.9223279,
    lng: 2.2091179,
    contactName: 'Catherine YVELISE',
    contactNumber: '0637757809',
    contactMail: 'yvelise.catherine@groupevitaminet.com',
    address: 'Rue Emile Zola, 95870 Bezons',
  },
  // {
  //   title: 'Ares service Val de Marne',
  //   lat: 48.7828641,
  //   lng: 2.5042718,
  //   contactName: 'Valérie De Fournoux',
  //   contactNumber: '0634310152',
  //   contactMail: 'valerie.defournoux@ares-association.fr',
  // },
];

const buildGMapsLink = (address) => `https://maps.google.com/?q=${address}`;
const buildEmailLink = (email) => `mailto:${email}`;

const FRANCE_CENTER_COORDINATES = { lat: 46.71109, lng: 1.7191036 };

const PartnersMap = ({ google }) => {
  const [clickedMarker, setClickedMarker] = useState(null);

  const getPartnerPlaceInfo = (infoKey) => {
    return clickedMarker ? partnersPlaces[clickedMarker.id][infoKey] : '-';
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
      {partnersPlaces.map((partner, index) => (
        <Marker
          title={partner.title}
          id={index}
          key={index}
          position={{ lat: partner.lat, lng: partner.lng }}
          onClick={(_, marker) => setClickedMarker(marker)}
        />
      ))}
      <InfoWindow
        visible={clickedMarker}
        marker={clickedMarker}
        onClose={() => setClickedMarker(null)}
      >
        <div>
          <h4 className="uk-text-primary uk-text-bold uk-text-center">
            {getPartnerPlaceInfo('title')}
          </h4>
          <p>
            <span uk-icon="user" className="uk-margin-small-right" />
            <span>{getPartnerPlaceInfo('contactName')}</span>
          </p>
          <p>
            <span uk-icon="phone" className="uk-margin-small-right" />
            <a href={`tel:${getPartnerPlaceInfo('contactNumber')}`}>
              {getPartnerPlaceInfo('contactNumber')}
            </a>
          </p>
          <p>
            <span uk-icon="mail" className="uk-margin-small-right" />
            <a
              href={buildEmailLink(getPartnerPlaceInfo('contactMail'))}
              target="_blank"
              rel="noopener noreferrer"
            >
              {getPartnerPlaceInfo('contactMail')}
            </a>
          </p>
          <p>
            <span uk-icon="location" className="uk-margin-small-right" />
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
  google: PropTypes.object.isRequired,
};

export default GoogleApiWrapper({
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
})(PartnersMap);

export const PartnersMapNoSSR = dynamic(() => import('./PartnersMap'), {
  ssr: false,
});
