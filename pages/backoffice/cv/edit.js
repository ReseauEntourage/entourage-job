import React, { Component } from 'react';
import { UserContext } from '../../../components/store/UserProvider';
import { CVActions, CVFicheEdition } from '../../../components/cv';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import Api from '../../../Axios';
import CVEditNoCandidat from '../../../components/cv/CVEditNoCandidat';

export default class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cv: {},
    };

    this.setLocalCV = this.setLocalCV.bind(this);
  }

  componentDidMount() {
    Api.get(`${process.env.SERVER_URL}/api/v1/cv/edit`)
      .then((res) => {
        // TODO SUPPRIMER LORSQUE DB REVIEWS OK
        if (!res.data.Reviews) {
          res.data.Reviews = [];
        }
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
