import React, { useState } from 'react';
import ReactDom, { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const Modal = ({
    children,
    activator,
    param,
    classNameSize: className,
}) => {
    const [show, setShow] = useState(false);
    const content = show && (
        <div
            className="uk-flex-top"
            data-uk-modal={param}
        >
            <div
                className={`uk-modal-dialog uk-margin-auto-vertical ${className}`}
            >
                <div
                    className="uk-modal-body uk-padding-large"
                >
                    {children}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {activator(setShow)}
            {createPortal(content, document.body)}
        </>
    );
}

Modal.propTypes = {
    children: PropTypes.element.isRequired,
    activator: PropTypes.func.isRequired,
    param: PropTypes.string,
    classNameSize: PropTypes.string,
};

Modal.defaultProps = {
    param: 'bg-close:false',
    classNameSize: 'uk-width-1-1 uk-width-2-3@l uk-width-1-2@xl'
}

export { Modal as default }