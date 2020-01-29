import React, { Component } from 'react';
import { GridNoSSR, Section, IconNoSSR } from '../utils';
import { CandidatCard } from '../cards';
import Api from '../../Axios';

export default class DiscoverPartial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCVs: [],
    };
  }

  componentDidMount() {
    Api.get('/api/v1/cv/cards/random?nb=2')
      .then((res) => {
        if (res.data) {
          /** Liste de CVs limitée à 2 profils */
          const CVs = res.data.slice(0, 2);
          this.setState({ listCVs: CVs });
        } else {
          this.setState({ listCVs: [] });
        }
      })
      .catch(() => {
        return console.log('Impossible de récupérer les CVs.');
      });
  }

  render() {
    const { listCVs } = this.state;
    if (listCVs.length === 0) {
      return null;
    }
    return (
      <Section id="discover">
        <div className="uk-text-center">
          <h2 className="uk-text-bold">
            Découvrez les <span className="uk-text-primary">candidats</span>
          </h2>
          <a href="#">
            Voir tous les candidats <IconNoSSR name="arrow-right" />
          </a>
        </div>
        <div className="uk-margin-large">
          <GridNoSSR
            childWidths={['1-1', '1-2@s']}
            items={listCVs.map((cv) => {
              return (
                <CandidatCard
                  url={cv.url}
                  imgSrc="/static/img/arthur.png"
                  imgAlt={cv.user && cv.user.firstName}
                  firstName={cv.user && cv.user.firstName}
                  ambitions={cv.ambitions.slice(0, 2)}
                />
              );
            })}
          />
        </div>
      </Section>
    );
  }
}
