import { col, fn, Op, where } from 'sequelize';

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

const escapeColumnRaw = (column) => {
  return `replace(lower(unaccent(${column})), '-', ' ')`;
};

const escapeColumn = (column) => {
  return fn('replace', fn('lower', fn('unaccent', col(column))), '-', ' ');
};

const searchInColumnWhereOption = (column, query) => {
  const escapedQuery = escapeQuery(query);
  return where(escapeColumn(column), {
    [Op.like]: `%${escapedQuery}%`,
  });
};

export {
  escapeQuery,
  escapeColumnRaw,
  escapeColumn,
  searchInColumnWhereOption,
};
