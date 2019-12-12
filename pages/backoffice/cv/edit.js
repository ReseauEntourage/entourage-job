import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../../../components/store/UserProvider';
import { CVActions, CVFicheEdition } from '../../../components/cv';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import Api from '../../../Axios';
import CVEditNoCandidat from '../../../components/cv/CVEditNoCandidat';

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
      cv: /* this.props ? this.props :  */ {},
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

  setLocalCV(fields) {
    const { cv } = this.state;
    Object.keys(fields).forEach((key) => (cv[key] = fields[key]));
    this.setState({ cv });

    console.log('update cv', fields);
  }

  render() {
    const { cv } = this.state;

    return (
      <LayoutBackOffice title="Edition du CV">
        <div style={{ position: 'relative' }}>
          <UserContext.Consumer>
            {({ user }) => {
              if (user && user.role === 'Candidat') {
                return (
                  <>
                    <CVActions />
                    <CVFicheEdition cv={cv} onChange={this.setLocalCV} />
                  </>
                );
              }
              if (cv.firstName) {
                return (
                  <>
                    <CVActions cv={cv} />
                    <CVFicheEdition cv={cv} onChange={this.setLocalCV} />
                  </>
                );
              }
              return <CVEditNoCandidat />;
            }}
          </UserContext.Consumer>
        </div>
      </LayoutBackOffice>
    );
  }
}
