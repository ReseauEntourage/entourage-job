import React, { Component } from "react";
import { CloseButtonNoSSR } from '../utils/CloseButton';

export default class ModalContactCandidat extends Component {
  render() {
    return (
      <div id="modalContactCandidat" data-uk-modal>
        <div className="uk-modal-dialog uk-modal-body">
          <h2 className="uk-modal-title">Titre</h2>
          texte
          {/* <button className="uk-modal-close" type="button"></button> */}
          <CloseButtonNoSSR className="uk-modal-close-default" />
        </div>
      </div>
    );
  }
}
