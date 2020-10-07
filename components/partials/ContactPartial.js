/* global UIkit */
import React, {useState} from 'react';
import PropTypes from "prop-types";
import validator from 'validator';
import { IconNoSSR, GridNoSSR } from '../utils';
import Axios from "../../Axios";
import Button from "../utils/Button";
import {event} from "../../lib/gtag";

const ContactPartial = ({ padding, tag }) => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  return (<div id="profiles" className={!padding ? 'uk-padding-remove-vertical' : ''}>
    <div className="uk-text-center">
      <h4 className='uk-align-center uk-text-bold uk-width-1-2@m'>Inscrivez-vous à la newsletter
                                                                  pour avoir des nouvelles des
                                                                  candidats et être informé de
                                                                  l&apos;évolution du projet</h4>
    </div>
    {/* input */}
    <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
      <GridNoSSR
        eachWidths={['expand', 'auto']}
        className="uk-width-1-2@s"
        gap="collapse"
        middle
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
            value={email}
          />
        </div>
        <Button
          style='primary'
          onClick={async () => {
            if(validator.isEmail(email)) {
              event(tag);
              try {
                await Axios.post('/api/v1/cv/share', { email });
                UIkit.notification('Votre inscription à la newsletter a bien été prise en compte !', 'success');
                setEmail('');
              }
              catch {
                UIkit.notification('Une erreur est survenue', 'danger');
              }
              setIsValid(true);
            }
            else {
              setIsValid(false);
            }
          }}
         >
          S&apos;abonner&nbsp;!
        </Button>
      </GridNoSSR>
      <span className="uk-text-danger uk-padding-small">
      {!isValid && "Adresse mail invalide"}
      </span>
    </div>
  </div>
)};

ContactPartial.propTypes = {
  padding: PropTypes.bool,
  tag: PropTypes.shape()
};

ContactPartial.defaultProps = {
  padding: true,
  tag: undefined
};

export default ContactPartial;
