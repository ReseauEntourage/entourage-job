import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Api from '../../Axios';
import { Section, CloseButtonNoSSR, GridNoSSR, Button } from '../utils';
import '../../static/css/Toggle.less';
import ModalGeneric from '../modals/ModalGeneric';
import HeaderModal from '../modals/HeaderModal';
import FooterForm from '../utils/FooterForm';

const DEFAULT_CV = {
  visibility: false,
};

export default class ParamCVVisible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cv: this.props,
    };
  }

  static get defaultProps() {
    return {
      cv: DEFAULT_CV,
    };
  }

  static get propTypes() {
    return {
      cv: PropTypes.shape({
        id: PropTypes.string.isRequired,
        visibility: PropTypes.bool,
      }),
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
    console.log(cv);
    cv.visibility = !cv.visibility;
    Api.post(`${process.env.SERVER_URL}/api/v1/cv/visibility`, cv)
      .then((res) => {
        console.log(res);
        this.setState({ cv: res.data });
        closeModal();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { cv } = this.state;
    return (
      <Section>
        <p className="uk-inline">
          Masquer mon CV du site LinkedOut
          <span className="uk-form-controls uk-padding-small">
            <label className="ent-toggle" htmlFor="ent-toggle-visibility">
              <input
                id="ent-toggle-visibility"
                type="checkbox"
                checked={cv.visibility}
                data-uk-toggle="target: #modal-confirm-visibility"
              />
              <span className="ent-slider round" />
            </label>
          </span>
        </p>
        <ModalGeneric id="modal-confirm-visibility">
          {(closeModal) => (
            <>
              <CloseButtonNoSSR className="uk-modal-close-default" />
              <HeaderModal>Changer la visibilité du CV en ligne</HeaderModal>
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
                    Masquer mon CV
                  </Button>,
                ]}
              />
            </>
          )}
        </ModalGeneric>
      </Section>
    );
  }
}
