import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DiscoverPartial, ContactPartial } from '../../../components/partials';
import { CVActions, CVFiche } from '../../../components/cv';
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

class CVEdit extends Component {
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

  static async getInitialProps({ query }) {
    console.log(query);
    return Api.get(`${process.env.SERVER_URL}/api/v1/cv/edit`)
      .then((res) => {
        return { cv: res.data };
      })
      .catch((error) => {
        console.log(error);
        return { cv: DEFAULT_CV };
      });
  }

  render() {
    const { cv } = this.props;
    const title = `Edition du CV`;
    console.log(cv);
    return (
      <LayoutBackOffice title={title}>
        <div style={{ position: 'relative' }}>
          {cv.firstName !== '' ? (
            <>
              <CVActions />
              <CVFiche cv={cv} />
              <ContactPartial />
              <DiscoverPartial />
            </>
          ) : (
            <div>Une erreur s&apos;est produite</div>
          )}
        </div>
      </LayoutBackOffice>
    );
  }
}

export default CVEdit;
