import React from 'react';

const Accueil = () => (
  <div className="accueil" style={{ height: '500px', backgroundColor: 'grey' }}>
    <div className="uk-padding-large" data-uk-grid>
      <div className="uk-width-1-3 slogan">
        <img data-src="/static/img/logo-linkedout.png" alt="logo linkedout" />
        <p className="uk-text-lead uk-text-bold">
          Partagez votre <span className="uk-text-warning">réseau</span> avec ceux qui n&apos;en ont
          pas
        </p>
      </div>
    </div>
  </div>
);

export default Accueil;
