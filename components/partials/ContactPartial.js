/* global UIkit */
import React, {useState} from 'react';
import PropTypes from "prop-types";
import validator from 'validator';
import { IconNoSSR, GridNoSSR } from '../utils';
import Axios from "../../Axios";

const ContactPartial = ({ padding }) => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  return (<div id="profiles" className={!padding ? 'uk-padding-remove-vertical' : ''}>
    <div className="uk-text-center">
      <h3 className='uk-align-center uk-text-bold uk-width-1-2@m'>Je m&apos;inscris à la newsletter
                                                                  pour avoir des nouvelles des
                                                                  candidats et être informé de
                                                                  l&apos;évolution du projet</h3>
    </div>
    {/* input */}
    <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
      <GridNoSSR
        eachWidths={['expand', 'auto']}
        className="uk-width-1-2@s"
        gap="collapse"
      >
        <div data-uk-form-custom="target: true" className="uk-width-1-1">
          <a className="uk-form-icon" disabled>
            <IconNoSSR name="mail" />
          </a>
          <input
            className="uk-input"
            type="email"
            placeholder="Votre adresse mail..."
            style={{borderBottom: 0, borderRadius: '2px 0 0 2px', paddingTop: 0}}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="uk-button uk-button-primary"
          style={{
            color: 'white',
            backgroundColor: '#F55F24',
            backgroundImage: 'none',
            textTransform: 'none',
            boder: null,
            padding: '0px 20px',
            borderRadius: '2px',
          }}
          onClick={() => {
            if(validator.isEmail(email)) {
              Axios.post('/api/v1/cv/share', { email })
                .then(() => {
                  UIkit.notification('Votre inscription à la newsletter a bien été prise en compte !', 'success')
                })
                .catch(() =>
                  UIkit.notification('Une erreur est survenue', 'danger')
                );
              setIsValid(true);
            }
            else {
              setIsValid(false);
            }
          }}
        >
          Écrivez-moi&nbsp;!
        </button>
      </GridNoSSR>
      {!isValid && <span className="uk-text-danger uk-padding-small">Adresse mail invalide</span>}
    </div>
  </div>
)};

ContactPartial.propTypes = {
  padding: PropTypes.bool
};

ContactPartial.defaultProps = {
  padding: true
};

export default ContactPartial;
