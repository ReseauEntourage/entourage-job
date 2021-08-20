const escapeQuery = (query) => {
  return query
    ? query
        .trim()
        .toLowerCase()
        .replace("'", "''")
        .replace('-', ' ')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    : '';
};

const escapeColumn = (column) => {
  return `replace(lower(unaccent(${column})), '-', ' ')`;
};

export { escapeQuery, escapeColumn };
