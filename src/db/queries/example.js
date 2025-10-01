const
  { query } = require('../db.js'),
  { copy } = require('../../utils/object.js');

module.exports.getItems = async ({ count, page, sortBy, sortAsc }) => {

  const
    DEFAULT_RESULTS_PER_PAGE = 15;

  const
    resultsPerPage = parseInt(count || DEFAULT_RESULTS_PER_PAGE),
    pageNumber = parseInt(page || 0),
    sortDirection = (((sortAsc === undefined) || (sortAsc === null)) ? true : !!sortAsc) ? 'ASC' : 'DESC';

  return await query(/*sql*/`
    SELECT
      items.uid,
      items.type,
      items.${'`'}order${'`'},
      items.parent,
      items.hidden,
      item_translations.label,
      items.updated_at,
      items.created_at
    FROM items
    LEFT JOIN item_translations ON
      item_translations.item_uid = items.uid
    ORDER BY ::sortBy ${sortDirection}
    LIMIT :offset, :count;

    SELECT
      :page AS page,
      :count AS resultsPerPage,
      COUNT(items.uid) AS total_results,
      :sortBy AS sortBy,
      ${sortDirection === 'ASC' ? 1 : 0} AS sortAsc
    FROM items;
  `, {
    count: resultsPerPage,
    page: pageNumber,
    offset: (resultsPerPage * pageNumber),
    sortBy: sortBy || 'updatedAt'
  });
};


module.exports.getItem = async (uid) => {
  return await query(/*sql*/`
    SELECT
      items.uid,
      items.type,
      items.${'`'}order${'`'},
      items.parent,
      items.hidden,
      JSON_OBJECTAGG(CONCAT_WS('-', language_code, NULLIF(country_code, '')), JSON_OBJECT('label', label, 'text', text))
        AS translations,
      items.updated_at,
      items.created_at
    FROM items
    LEFT JOIN item_translations ON item_translations.item_uid = items.uid
    WHERE uid = :uid
    GROUP BY uid
  `, { uid });
};

module.exports.addItem = async (data) => {
  
  const itemFields = copy(data);
  delete itemFields.translations;

  const itemLocales = Object.keys(data.translations);
  const translations = [];
  for (const locale of itemLocales) {
    const [languageCode, countryCode] = locale.split('-');
    translations.push({
      languageCode,
      countryCode: countryCode || '',
      itemUid: itemFields.uid,
      ...translations[locale]
    });
  }

  return await query(/*sql*/`
    START TRANSACTION;

    INSERT INTO items SET
    {{#item}}
      {{#sql .}}::column = :value{{/sql}}
      {{~#unless @last}},{{/unless}}
    {{/item}};
    
    {{#translations}}
    INSERT INTO item_translations SET
      {{#.}}
        {{#sql .}}::column = :value{{/sql~}}
        {{#unless @last}},{{ else }};{{/unless}}
      {{/.}}
    {{/translations}}

    COMMIT;
  `, {
    item: Object.entries(itemFields).map(([column, value]) => ({ column, value })),
    translations: translations.map(t => Object.entries(t).map(([column, value]) => ({ column, value })))
  });
};