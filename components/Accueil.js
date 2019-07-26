import { Component } from "react";
import ButtonShare from "./utils/buttons/ButtonShare.js";

export default class Accueil extends Component {
  render(){
    return (
      <div className="accueil" style={{height: "500px", backgroundColor: "grey"}}>
        <div className="uk-padding-large" data-uk-grid>
          <div className="uk-width-1-3 slogan">
            <img data-src="../assets/img/logo-linkedout.png" alt="logo linkedout" />
            <p className="uk-text-lead uk-text-bold">Partagez votre <span className="uk-text-warning">réseau</span> avec ceux qui n'en ont pas</p>
            <ButtonShare />
          </div>
        </div>
      </div>
    );
  }
}