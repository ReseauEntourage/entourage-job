import React, { Component } from 'react';
import { CVFicheEdition } from '../../../components/cv';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import Api from '../../../Axios';
import CVEditNoCandidat from '../../../components/cv/CVEditNoCandidat';
import { Section, Button, GridNoSSR } from '../../../components/utils';
import CVEditWelcome from '../../../components/cv/CVEditWelcome';

export default class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cv: undefined,
    };

    this.setLocalCV = this.setLocalCV.bind(this);
  }

  componentDidMount() {
    Api.get(`${process.env.SERVER_URL}/api/v1/cv/edit`)
      .then((res) => {
        // TODO SUPPRIMER LORSQUE DB REVIEWS OK
        // TODO ajouter un loading screen
        if (!res.data.Reviews) {
          res.data.Reviews = [];
        }
        if (!res.data.catchphrase) {
          res.data.catchphrase = res.data.intro;
          res.data.intro = undefined;
        }
        if (!res.data.devise) {
          res.data.devise = null;
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
        <Section>
          {cv === undefined ? (
            <CVEditNoCandidat />
          ) : (
            <>
              <CVEditWelcome cv={cv} />
              <GridNoSSR className="uk-flex-right uk-margin">
                <Button style="default">Prévisualiser la page</Button>
                <Button style="primary">Publier</Button>
              </GridNoSSR>
              <CVFicheEdition cv={cv} onChange={this.setLocalCV} />
            </>
          )}
        </Section>
      </LayoutBackOffice>
    );
  }
}
