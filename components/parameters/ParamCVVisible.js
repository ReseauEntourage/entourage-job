import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Api from '../../Axios';
import { Section } from '../utils';
import '../../static/css/Toggle.less';

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

  render() {
    const { cv } = this.state;
    console.log(cv);
    return (
      <Section>
        <p className="uk-inline">
          Masquer mon CV du site LinkedOut
          <span className="uk-form-controls uk-padding-small">
            <label className="ent-toggle" htmlFor="ent-toggle-visibility">
              <input id="ent-toggle-visibility" type="checkbox" />
              <span className="ent-slider round" />
            </label>
          </span>
        </p>
      </Section>
    );
  }
}
