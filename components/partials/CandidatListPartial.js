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
    Api.get('/api/v1/cv/cards/random?nb=11')
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
    const items = listCVs.map((cv) => {
      return (
        <CandidatCard
          url={cv.url}
          imgSrc="static/img/arthur.png"
          imgAlt={cv.firstName}
          firstName={cv.firstName}
          ambitions={cv.Skills.slice(0, 2)}
        />
      );
    });
    items.push(
      <div className="uk-flex uk-flex-column uk-flex-middle">
        <button
          type="button"
          className="uk-icon-button"
          style={{ color: 'white', backgroundColor: '#F55F24' }}
        >
          <IconNoSSR name="plus" />
        </button>
        <SimpleLink href="/contact" className="uk-link-muted uk-padding-small">
          <span className="uk-text-bold">Voir plus</span>
        </SimpleLink>
      </div>
    );
    return items;
  }

  render() {
    const { listCVs } = this.state;
    const items = this.prepareItems();
    if (listCVs.length === 0) {
      return null;
    }
    return (
      <Section style="default" container="small" id="profiles">
        <div className="uk-text-center uk-margin-large">
          <h2 className="uk-text-bold">
            <span className="uk-text-primary">Eux</span> cherchent un travail,
            <br />
            <span className="uk-text-primary">Vous</span> avez un réseau.
          </h2>
          <p className="uk-align-center uk-width-2-3@s">
            Nos candidats sont des gens en situation de précarité financière et
            professionnellle. Toutes accompagnées par des travailleurs sociaux,
            motivées pour se réinsérer, elles dévoilent leurs talents et leurs
            aspirations. Réseau, amis, recruteurs, à vos partages !
          </p>
        </div>
        <GridNoSSR
          childWidths={['1-1', '1-2@s']}
          parallax={400}
          items={items}
          className="uk-padding-remove-bottom"
        />
      </Section>
    );
  }
}
