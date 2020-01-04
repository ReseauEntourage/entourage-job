import React, { Component } from 'react';
import { GridNoSSR, IconNoSSR, Section, SimpleLink } from '../utils';
import { CandidatCard } from '../cards';
import Api from '../../Axios';

export default class CandidatListPartial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCVs: [],
    };
    this.prepareItems = this.prepareItems.bind(this);
  }

  componentDidMount() {
    Api.get(`/api/v1/cv/cards/random?nb=11`)
      .then((res) => {
        if (res.data) {
          /** Liste de CVs limitée à 11 profils */
          const CVs = res.data.slice(0, 11);
          this.setState({ listCVs: CVs });
        } else {
          this.setState({ listCVs: [] });
        }
      })
      .catch(() => {
        return console.log('Impossible de récupérer les CVs.');
      });
  }

  prepareItems() {
    const { listCVs } = this.state;
    return listCVs.map((cv) => {
      return (
        <CandidatCard
          url={cv.url}
          imgSrc="static/img/arthur.png"
          imgAlt={cv.firstName}
          firstName={cv.firstName}
          ambitions={cv.Ambitions.slice(0, 2)}
        />
      );
    });
  }

  render() {
    const { listCVs } = this.state;
    const items = this.prepareItems();
    if (listCVs.length === 0) {
      return null;
    }
    return (
      <Section style="muted" container="" id="profiles">
        <GridNoSSR gap="large" column middle eachWidths={['2-3@s', '1-1']}>
          <div className="uk-text-center">
            <h2 className="uk-text-bold">
              Ils viennent de{' '}
              <span className="uk-text-primary">s&apos;inscrire</span>
            </h2>
            <p>
              Ils sont disponibles pour travailler. Découvrez leurs profils,
              partagez ou contactez-les.
            </p>
          </div>
          <GridNoSSR
            childWidths={['1-1', '1-3@s']}
            // parallax={400}
            items={items}
          />
          <button
            type="button"
            className="uk-button uk-button-primary"
            style={{
              color: 'white',
              backgroundColor: '#F55F24',
              backgroundImage: 'none',
              textTransform: 'none',
              boder: null,
              padding: '0px 20px',
              borderRadius: '2px',
            }}
          >
            Voir les candidats &gt;
          </button>
        </GridNoSSR>
      </Section>
    );
  }
}
