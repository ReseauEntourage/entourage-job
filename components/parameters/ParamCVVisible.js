import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Api from '../../Axios';
import { CloseButtonNoSSR, GridNoSSR, Button } from '../utils';
import '../../static/css/Toggle.less';
import ModalGeneric from '../modals/ModalGeneric';
import HeaderModal from '../modals/HeaderModal';

const DEFAULT_CV = null;

export default class ParamCVVisible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props,
    };
  }

  static get defaultProps() {
    return {
      cv: DEFAULT_CV,
      error: '',
    };
  }

  static get propTypes() {
    return {
      cv: PropTypes.shape({
        visibility: PropTypes.bool,
      }),
      error: PropTypes.string,
    };
  }

  componentDidMount() {
    Api.get(`${process.env.SERVER_URL}/api/v1/cv/visibility`)
      .then((res) => {
        console.log(res);
        this.setState({ cv: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  setVisibility(closeModal) {
    const { cv } = this.state;
    cv.visibility = !cv.visibility;
    console.log(cv);
    Api.put(`${process.env.SERVER_URL}/api/v1/cv/visibility`, cv)
      .then((res) => {
        console.log(res);
        this.setState({ cv: res.data, error: '' });
        if (closeModal) {
          closeModal();
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: 'Une erreur est survenue' });
      });
  }

  render() {
    const { cv, error } = this.state;
    /**
     * Ne pas afficher le composant si aucun CV publié existe
     */
    if (cv === null) {
      return null;
    }
    cv.visibility = !cv.visibility;
    return (
      <div className="uk-padding uk-padding-remove-left">
        <p className="uk-inline ">
          Masquer mon CV du site LinkedOut :
          <span className="uk-form-controls uk-padding">
            <label className="ent-toggle" htmlFor="ent-toggle-visibility">
              {cv.visibility ? (
                <input
                  id="ent-toggle-visibility"
                  type="checkbox"
                  checked
                  onChange={() => this.setVisibility()}
                />
              ) : (
                <input
                  id="ent-toggle-visibility"
                  type="checkbox"
                  data-uk-toggle="target:#modal-confirm-visibility"
                  checked={false}
                />
              )}
              <span className="ent-slider round" />
            </label>
          </span>
          {error && <span className="uk-text-danger">{error}</span>}
        </p>
        <ModalGeneric id="modal-confirm-visibility">
          {(closeModal) => (
            <>
              <CloseButtonNoSSR className="uk-modal-close-default" />
              <HeaderModal>Changer la visibilité du CV en ligne ?</HeaderModal>
              <p
                className="uk-text-lead"
                style={{
                  lineHeight: '1.2',
                  fontSize: '1.2rem',
                  fontWeight: '500',
                }}
              >
                En masquant ton CV de LinkedOut, il ne sera plus visible par les
                utilisateurs du site.
                <br />
                Tu pourras le remettre en ligne à tout moment.
              </p>
              <GridNoSSR
                className="uk-grid-small uk-flex-center uk-margin-large-top"
                items={[
                  closeModal ? (
                    <Button style="default" onClick={closeModal}>
                      Annuler
                    </Button>
                  ) : (
                    <></>
                  ),
                  <Button
                    style="primary"
                    onClick={() => this.setVisibility(closeModal)}
                  >
                    Oui, masquer mon CV
                  </Button>,
                ]}
              />
            </>
          )}
        </ModalGeneric>
      </div>
    );
  }
}
