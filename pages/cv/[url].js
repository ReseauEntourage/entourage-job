import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { DiscoverPartial, ContactPartial } from '../../components/partials';
import { CVBackground, CVFiche } from '../../components/cards';
import Layout from '../../components/Layout';
import Api from '../../Axios';

class CVPage extends Component {
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
        intro: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
      router: PropTypes.shape({
        asPath: PropTypes.string.isRequired,
      }),
    };
  }

  static async getInitialProps({ query }) {
    return Api.get(`${process.env.SERVER_URL}/api/v1/cv/${query.url}`)
      .then((res) => {
        return { cv: res.data };
      })
      .catch((error) => {
        console.log(error);
        console.log(
          `CVPage - getInitialProps error : ${error.response.status}`
        );
        return { cv: {} };
      });
  }

  render() {
    const { cv, router } = this.props;
    const hostname = process.env.SERVER_URL;
    console.log(process);
    const firstName =
      cv.firstName.charAt(0).toUpperCase() +
      cv.firstName.slice(1).toLowerCase();
    const title = `${firstName} - Entourage Jobs`;
    return (
      <Layout
        title={title}
        metaTitle={`Aidez ${firstName} en partageant son CV.`}
        metaUrl={`${hostname}${router.asPath}`}
        metaDescription={cv.intro}
        metaImage={`${hostname}/static/img/cv/${cv.url}-preview.jpg`}
        metaType="profile"
      >
        <div style={{ position: 'relative' }}>
          <CVBackground url="/static/img/arthur-background.jpg" />
          <CVFiche cv={cv} />
          <ContactPartial />
          <DiscoverPartial />
        </div>
      </Layout>
    );
  }
}

export default withRouter(CVPage);
