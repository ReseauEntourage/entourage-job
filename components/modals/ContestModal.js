import React, {useState, useEffect} from 'react';
import {Button, CloseButtonNoSSR, IconNoSSR} from "../utils";
import {EXTERNAL_LINKS} from '../../constants';

const ContestModal = () => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    // Set the date we're counting down to
    const countDownDate = new Date(2020, 6, 4, 15, 30, 0).getTime() ;

    // Update the count down every 1 second
    const x = setInterval(function() {

      // Get today's date and time
      const now = new Date().getTime();

      // Find the distance between now and the count down date
      const distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      setCountdown(days + "j " + hours + "h "
        + minutes + "m " + seconds + "s");

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        setCountdown("C'est parti\xa0!");
      }
    }, 1000);
  }, []);

  return(
    <div id="modal-contest" uk-modal>
      <div className="uk-modal-dialog uk-modal-body uk-background-primary">
        <button
          className="uk-modal-close-default"
          type="button"
          data-uk-close
          style={{color: 'white'}}
          aria-label="close"
        />
        <div className="uk-inline">
          <img src="../../static/img/thomas.jpg" alt="Thomas Ruyant" />
          <div style={{backgroundColor: 'rgba(0,0,0,0.5)'}} className="uk-position-cover" />
          <div className="uk-overlay uk-position-center uk-flex uk-flex-column uk-flex-middle">
            <div className="uk-light uk-flex uk-flex-column uk-flex-middle">
              <h2 className="uk-text-center">Défie Thomas sur <span className="uk-text-bold" style={{color: '#FF5101'}}>Virtual Regatta</span> et <span className="uk-text-bold" style={{color: '#00B9EF'}}>gagne une navigation</span> sur le bateau LinkedOut&nbsp;!</h2>
              <h3 className="uk-text-center">Top départ&nbsp;:&nbsp;<span className="uk-text-bold" style={{color: '#00B9EF'}}>{countdown}</span></h3>
            </div>
          <Button
              href={EXTERNAL_LINKS.LKO_VG_CONTEST}
              isExternal
              newTab
              style='secondary'
              className="uk-margin-medium-top">
              C&apos;est parti !{' '}<IconNoSSR name="chevron-right" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

ContestModal.propTypes = {

};

export default ContestModal;
