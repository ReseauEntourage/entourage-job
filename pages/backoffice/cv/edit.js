import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { DiscoverPartial, ContactPartial } from '../../../components/partials';
import { CVBackground, CVFiche } from '../../../components/cards';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import Api from '../../../Axios';

class CVEdit extends Component {
  static get defaultProps() {
    return {
      cv: {
        firstName: '',
        intro: '',
        Ambitions: [],
        Contracts: [],
        Languages: [],
        Passions: [],
        Skills: [],
        Experiences: [],
        url: '',
      },
      router: {
        asPath: '',
      },
    };
  }

  static get propTypes() {
    return {
      cv: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
      router: PropTypes.shape({
        asPath: PropTypes.string.isRequired,
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
        console.log(`CVPage - getInitialProps error : ${error}`);
        return { cv: {} };
      });
  }

  render() {
    const { cv } = this.props;
    const title = `Edition du CV`;
    console.log(cv);
    return (
      <LayoutBackOffice title={title}>
        <div style={{ position: 'relative' }}>
          {cv.firstName ? (
            <>
              <CVBackground url="/static/img/arthur-background.jpg" />
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

export default withRouter(CVEdit);
