import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { DiscovertPartial, ContactPartial } from '../../components/partials';
import { CVBackground, CVFiche } from '../../components/cards';
import Layout from '../../components/Layout';
import Api from '../../Axios';

const hashtags = ['LinkedOut'];
const hostname = 'https://entourage-job-preprod.herokuapp.com';
const backgroundCV = '/static/img/arthur-background.jpg';

/* const email = `${id}@gmail.com`;
const link = `https://entourage-job-preprod.herokuapp.com/cv/${id}`; */
const email = `TEST@gmail.com`;
const link = `https://entourage-job-preprod.herokuapp.com/cv/TEST`;

/* const name = id.charAt(0).toUpperCase() + id.slice(1).toLowerCase(); */
const name = 'Test';
const title = `${name} - Entourage Jobs`;
const sharedTitle = `Aidez ${name} en partageant son CV.`;
// `Donnons un coup de pouce à ${name} en partageant son CV.`;
const sharedDescription =
  'Motivée et curieuse, j&apos;aimerais beaucoup travailler dans la gestion ou l&apos;administration mais reste ouverte à toutes autres propositions.';
const quote =
  "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer. @Réseau Entourage";

class CVPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CV: undefined,
      loading: true,
    };
  }

  static get propTypes() {
    return {
      // eslint-disable-next-line react/forbid-prop-types
      /* router: PropTypes.object.isRequired, */
      /* asPath: PropTypes.string.isRequired, */
    };
  }

  static async getInitialProps({ req, query }) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
    console.log('OOOOOK');
    console.log(userAgent);
    console.log(query);

    Api.get(`/api/v1/cv/${query.url}`)
      .then((res) => {
        console.log(res);
        // res.data.map((project) => {
        //	return listProjects.push(project);
        //	});
        //  this.setState({listProjects, loading: false});
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response.status);

        /* this.setState({ loading: false }); */
      });
    return { userAgent };
  }

  /*   componentDidMount() {
    const { router } = this.props;
    console.log(router);
    const { url } = router.query;
    console.log(url);
    this.setState({ loading: true });
    Api.get(`/api/v1/cv/${url}`)
      .then((res) => {
        console.log(res);
        // res.data.map((project) => {
			//	return listProjects.push(project);
		//	});
    //  this.setState({listProjects, loading: false});
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
      });
  } */

  render() {
    const { asPath } = this.props;
    return (
      <Layout
        title={title}
        metaTitle={sharedTitle}
        metaUrl={`${hostname}${asPath}`}
        metaDescription={sharedDescription}
        metaImage={`${hostname}/static/img/arthur.png`}
        metaType="profile"
      >
        <div style={{ position: 'relative' }}>
          <CVBackground url={backgroundCV} />
          <CVFiche
            name={name}
            email={email}
            link={link}
            hashtags={hashtags}
            sharedDescription={quote}
            sharedTitle={sharedTitle}
          />
          <ContactPartial />
          <DiscovertPartial />
        </div>
      </Layout>
    );
  }
}

export default withRouter(CVPage);
