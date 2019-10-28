/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ModalGeneric extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageSent: false,
    };
    this.confirmMessageSent = this.confirmMessageSent.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  static get propTypes() {
    return {
      children: PropTypes.func.isRequired,
      id: PropTypes.string.isRequired,
      param: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      param: 'bg-close:false',
    };
  }

  closeModal() {
    const { messageSent } = this.state;
    const { id } = this.props;

    UIkit.modal(`#${id}`).hide();
    if (messageSent) {
      this.setState({ messageSent: false });
    }
  }

  confirmMessageSent() {
    this.setState({ messageSent: true });
  }

  render() {
    const { children, id, param } = this.props;

    return (
      <div id={id} className="uk-flex-top" data-uk-modal={param}>
        <div className="uk-modal-dialog uk-margin-auto-vertical uk-width-1-2">
          <div className="uk-modal-body uk-padding-large">
            {children(this.closeModal)}
          </div>
        </div>
      </div>
    );
  }
}
