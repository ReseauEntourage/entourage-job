import React from 'react';
import { Button } from 'src/components/utils';
import { EXTERNAL_LINKS } from 'src/constants';
import { addPrefix } from 'src/utils';
import Img from 'src/components/utils/Img';
import { IconNoSSR } from 'src/components/utils/Icon';
import ModalGeneric from 'src/components/modals/ModalGeneric';

const SailInfoModal = () => {
  const modalContent = (
    <>
      <div className="uk-light uk-flex uk-flex-column uk-flex-middle">
        <h2 className="uk-text-center uk-text-bold uk-box-shadow-small">
          Le bateau LinkedOut{' '}
          <span className="uk-text-bold" style={{ color: '#00B9EF' }}>
            vainqueur de la Transat Jacques Vabre&nbsp;!
          </span>
        </h2>
      </div>
      <Button
        href={EXTERNAL_LINKS.ARTICLE_TJV}
        isExternal
        newTab
        style="secondary"
        className="uk-margin-medium-top"
      >
        Lire l&apos;histoire&nbsp;
        <IconNoSSR name="chevron-right" />
      </Button>
    </>
  );

  return (
    <ModalGeneric>
      <div className="uk-inline uk-visible@m">
        <Img
          src="/static/img/boat-tjv.jpeg"
          alt="Bateau LinkedOut Transat Jacques Vabre"
        />
        <div
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          className="uk-position-cover"
        />
        <div className="uk-overlay uk-position-center uk-flex uk-flex-column uk-flex-middle">
          {modalContent}
        </div>
      </div>
      <div
        className="uk-hidden@m uk-flex uk-flex-column uk-flex-middle uk-padding-small uk-background-center-center uk-background-cover uk-background-blend-overlay"
        style={{
          backgroundImage: `url("${addPrefix('/static/img/boat-tjv.jpeg')}")`,
          backgroundColor: '#444',
        }}
      >
        {modalContent}
      </div>
    </ModalGeneric>
  );
};

SailInfoModal.propTypes = {};

export default SailInfoModal;
