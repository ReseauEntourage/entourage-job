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
      classNameSize: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      param: 'bg-close:false',
      classNameSize: 'uk-width-1-1 uk-width-2-3@l uk-width-1-2@xl',
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
    const { children, classNameSize, id, param } = this.props;

    return (
      <div id={id} className="uk-flex-top" data-uk-modal={param}>
        <div
          className={`uk-modal-dialog uk-margin-auto-vertical ${classNameSize}`}
        >
          <div className="uk-modal-body uk-padding-large">
            {children(this.closeModal)}
          </div>
        </div>
      </div>
    );
  }
}
