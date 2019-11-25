import React from 'react';
import PropTypes from 'prop-types';

const ExperiencesProfileCard = ({ experiences }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">
        Mon <span className="uk-text-primary">expérience</span>
      </h3>

      {experiences.length !== 0 ? (
        <ul className="uk-list ent-list">
          {experiences.map((item, i) => (
            <li id={i} key={i}>
              <p className="uk-text-muted uk-margin-small">
                {item.dateStart} - {item.dateEnd}
              </p>
              <p className="uk-text-bold uk-text-primary uk-margin-small">
                {item.title}
              </p>
              <p className="uk-margin-small-top uk-margin-medium-bottom">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="uk-text-italic">
          Aucune expérience n&apos;a encore été ajoutée
        </p>
      )}
    </div>
  );
};
ExperiencesProfileCard.propTypes = {
  experiences: PropTypes.arrayOf(
    PropTypes.shape({
      dateStart: PropTypes.string,
      dateEnd: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ),
};
ExperiencesProfileCard.defaultProps = {
  experiences: [],
};
export default ExperiencesProfileCard;
