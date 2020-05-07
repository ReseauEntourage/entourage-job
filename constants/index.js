export const OFFER_STATUS = [
  {value: -1, text: "Offre à traiter"},
  {value: 0, text: "Contacté"},
  {value: 1, text: "Phase d'entretien"},
  {value: 2, text: "Embauche"},
  {value: 3, text: "Refus"},
  {value: 4, text: "Standby"},
  {value: 5, text: "Relance"},
];

export const CV_STATUS = {
  Pending: {
    label: "En attente",
    value: "Pending",
    style: "muted"
  },
  Published:
    {
      label: "Publié",
      value: "Published",
      style: "success"
    },
  New:
    {
      label: "Nouveau",
      value: "New",
      style: "info"
    },
  Draft:
    {
      label: "Brouillon",
      value: "Draft",
      style: "warning"
    },
  Unkown:
    {
      label: "Inconnu",
      value: "unknown",
      style: ""
    }
};
