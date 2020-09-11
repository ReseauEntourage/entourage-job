/* global UIkit */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const ModalContext = React.createContext();

const ModalProvider = props => {

    const [close, setClose] = useState(false);

    useEffect(() => {
        if (close) {
            UIkit.modal(`#${props.id}`).hide();
        } else if (props.specialCloseAction) {
            props.specialCloseAction();
        }
    }, [close, setClose]);

    return (
        <ModalContext.Provider
            value={{ setClose }} {...props}
        >
        </ModalContext.Provider >
    );
}

ModalProvider.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    param: PropTypes.string,
    classNameSize: PropTypes.string,
    specialCloseAction: PropTypes.func,
};

ModalProvider.defaultProps = {
    param: 'bg-close:false',
    classNameSize: 'uk-width-1-1 uk-width-2-3@l uk-width-1-2@xl',
    specialCloseAction: undefined,
};

export default ModalProvider;