/* global UIkit */

import React, { useState, useEffect } from 'react';
import { Button, IconNoSSR } from '../utils';
import { EXTERNAL_LINKS } from '../../constants';
import { addPrefix } from '../../utils';
import Img from '../utils/Img';

const ContestModal = () => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    // Set the date we're counting down to
    const countDownDate = new Date(2020, 6, 4, 15, 30, 0).getTime();

    // Update the count down every 1 second
    const updateInterval = setInterval(() => {
      // Get today's date and time
      const now = new Date().getTime();

      // Find the distance between now and the count down date
      const distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      setCountdown(`${days}j\xa0${hours}h\xa0${minutes}m\xa0${seconds}s`);

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(updateInterval);
        setCountdown("C'est parti\xa0!");
      }
    }, 1000);

    const modalInterval = setInterval(() => {
      if (UIkit) {
        clearInterval(modalInterval);
        UIkit.modal(`#modal-contest`).show();
      }
    }, 1000);

    return () => {
      clearInterval(modalInterval);
      clearInterval(updateInterval);
    };
  }, []);

  const modalContent = () => {
    return (
      <>
        <div className="uk-light uk-flex uk-flex-column uk-flex-middle">
          <h2 className="uk-text-center">
            Défie Thomas sur
            <span className="uk-text-bold" style={{ color: '#FF5101' }}>
              Virtual Regatta
            </span>{' '}
            et
            <span className="uk-text-bold" style={{ color: '#00B9EF' }}>
              gagne une navigation
            </span>{' '}
            sur le bateau LinkedOut&nbsp;!
          </h2>
          <h3 className="uk-text-center">
            Top&nbsp;départ&nbsp;:
            <span className="uk-text-bold" style={{ color: '#00B9EF' }}>
              {countdown}
            </span>
          </h3>
        </div>
        <Button
          href={EXTERNAL_LINKS.LKO_VG_CONTEST}
          isExternal
          newTab
          style="secondary"
          className="uk-margin-medium-top"
        >
          C&apos;est parti !&nbsp;
          <IconNoSSR name="chevron-right" />
        </Button>
      </>
    );
  };

  return (
    <div>
      <div id="modal-contest" data-uk-modal>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-background-primary">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            style={{ color: 'white' }}
            aria-label="close"
          />
          <div className="uk-inline uk-visible@m">
            <Img src="../../static/img/thomas.jpg" alt="Thomas Ruyant" />
            <div
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              className="uk-position-cover"
            />
            <div className="uk-overlay uk-position-center uk-flex uk-flex-column uk-flex-middle">
              {modalContent()}
            </div>
          </div>
          <div
            className="uk-hidden@m uk-flex uk-flex-column uk-flex-middle uk-padding-small uk-background-center-center uk-background-cover uk-background-blend-overlay"
            style={{
              backgroundImage: `url("${addPrefix(
                '../../static/img/thomas.jpg'
              )}")`,
              backgroundColor: '#444',
            }}
          >
            {modalContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

ContestModal.propTypes = {};

export default ContestModal;
