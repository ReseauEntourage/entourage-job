import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

const partnersPlaces = [
  {
    title: 'Mediapole',
    lat: 48.606821,
    lng: 2.3005192,
    contactName: 'Catherine Yvelise',
    contactNumber: '0637757809',
    contactMail: 'yvelise.catherine@groupevitaminet.com',
  },
  {
    title: 'Janus 77',
    lat: 48.8535246,
    lng: 2.7643001,
    contactName: 'Catherine Yvelise',
    contactNumber: '0637757809',
    contactMail: 'yvelise.catherine@groupevitaminet.com',
  },
  {
    title: 'Ménage et Properté',
    lat: 48.9223279,
    lng: 2.2091179,
    contactName: 'Catherine Yvelise',
    contactNumber: '0637757809',
    contactMail: 'yvelise.catherine@groupevitaminet.com',
  },
  {
    title: 'Ares service Val de Marne',
    lat: 48.7828641,
    lng: 2.5042718,
    contactName: 'Valérie De Fournoux',
    contactNumber: '0634310152',
    contactMail: 'valerie.defournoux@ares-association.fr',
  },
];

const FRANCE_CENTER_COORDINATES = { lat: 46.71109, lng: 1.7191036 }

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
          <h4 className="uk-text-primary uk-text-default">
            {getPartnerPlaceInfo('title')}
          </h4>
          <div className="uk-margin-small-bottom">
            <span uk-icon="user" className="uk-margin-small-right" />
            <span>{getPartnerPlaceInfo('contactName')}</span>
          </div>
          <div className="uk-margin-small-bottom">
            <span uk-icon="phone" className="uk-margin-small-right" />
            <span>{getPartnerPlaceInfo('contactNumber')}</span>
          </div>
          <div className="uk-margin-small-bottom">
            <span uk-icon="mail" className="uk-margin-small-right" />
            <span>{getPartnerPlaceInfo('contactMail')}</span>
          </div>
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
