import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CVActions, CVFicheEdition } from '../../../components/cv';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import Api from '../../../Axios';

const DEFAULT_CV = {
  firstName: '',
  intro: '',
  Ambitions: [],
  Contracts: [],
  Languages: [],
  Passions: [],
  Skills: [],
  Experiences: [],
  url: '',
};

export default class CVEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cv: this.props,
    };

    this.setLocalCV = this.setLocalCV.bind(this);
  }

  static get defaultProps() {
    return {
      cv: DEFAULT_CV,
    };
  }

  static get propTypes() {
    return {
      cv: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
    };
  }

  componentDidMount() {
    Api.get(`${process.env.SERVER_URL}/api/v1/cv/edit`)
      .then((res) => {
        this.setState({ cv: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  setLocalCV(field) {
    const { cv } = this.state;
    console.log(`Modification de ${field}`);
    console.log(field);
    const newCV = { ...cv, ...field };
    this.setState({ cv: newCV });
  }

  render() {
    const { cv } = this.state;
    const title = `Edition du CV`;
    console.log(cv);
    return (
      <LayoutBackOffice title={title}>
        <div style={{ position: 'relative' }}>
          {cv.firstName !== '' ? (
            <>
              <CVActions />
              <CVFicheEdition cv={cv} onChange={this.setLocalCV} />
            </>
          ) : (
            <div>Une erreur s&apos;est produite</div>
          )}
        </div>
      </LayoutBackOffice>
    );
  }
}
