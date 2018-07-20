function getColumn(key, columnKey, columnsKey) {
  if (!columnKey) return {};
  let pageData = {};
  const routeKey = columnsKey || key;
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const page = require(`../../src/routes/${routeKey}/${columnKey}.md`);
  if (columnKey.startsWith('left')) {
    const { title: leftColumnTitle, html: leftColumnHtml, key: colKey } = {
      ...page,
    };
    pageData = { leftColumnTitle, leftColumnHtml, colKey };
  } else {
    const { title: rightColumnTitle, html: rightColumnHtml, key: colKey } = {
      ...page,
    };
    pageData = { rightColumnTitle, rightColumnHtml, colKey };
  }
  return pageData;
}
const withColumns = (page, { columnsKey, leftColumnKey, rightColumnKey }) => {
  const key = columnsKey || page.key;
  Object.assign(
    page,
    getColumn(key, leftColumnKey, columnsKey),
    getColumn(key, rightColumnKey, columnsKey),
  );
};
export const defaultColumnData = {
  leftColumnKey: 'left-column',
  rightColumnKey: 'right-column',
  columnsKey: 'global-columns',
};
export default withColumns;
