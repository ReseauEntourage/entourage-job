export const HelpingCard = (props) => (
    <div className="uk-card uk-card-default uk-card-body" data-uk-grid>
    <div className="uk-width-2-3">
      <h3 className="uk-text-bold">{props.titleHead}<span className="uk-text-primary">{props.titleMiddle}</span>{props.titleTail}</h3>
      <p>{props.description}</p>
    </div>
    <div className="uk-width-1-3">
      <img src={props.img} width="100%"/>
    </div>
  </div>
)
