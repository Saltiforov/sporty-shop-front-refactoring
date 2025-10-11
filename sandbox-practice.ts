const query =
  'f-brand=on,mp&f-category=proteins,,amino-acids&&f-flavor=chocolate';
const FILTER_PREFIX = 'f-';

function parseFilters(query) {
  const result = new Map();
  const filters = query.split('&').filter(Boolean) as string[];

  filters.map((filter) => {
    const [rawKey, rawValue] = filter.split('=');

    const validatedKey = rawKey.split(FILTER_PREFIX).filter(Boolean).toString();
    const validatedValue = new Set<string>(rawValue.split(',').filter(Boolean));

    result.set(validatedKey, validatedValue);
  });

  return result;
}

function stringifyFilters(map) {
  // f-brand=optimum-nutrition,myprotein,biotechusa&
  // f-category=proteins,amino-acids&
  // f-flavor=chocolate,vanilla
  let queryString = '';

  Array.from(map.keys()).forEach((key) => {
    const relatedItem = map.get(key);
    queryString += `${FILTER_PREFIX}${key}=${Array.from(relatedItem.values())}&`;
  });

  return queryString;
}

const resultMap = parseFilters(query);

const prevFilters = new Map([
  ['brand', new Set(['on', 'biotechusa'])], // biotechusa удалили, mp добавили
  ['category', new Set(['proteins'])], // добавился amino-acids
  ['flavor', new Set(['vanilla'])], // vanilla заменили на chocolate
]);

const nextFilters = new Map([
  ['brand', new Set(['on', 'mp'])],
  ['category', new Set(['proteins', 'amino-acids'])],
  ['flavor', new Set(['chocolate'])],
]);

function diffFilters(prev, next) {
  const added = new Map();
  const removed = new Map();

  function diff(a, b) {
    return new Set([...a].filter(x => !b.has(x)));
  }

  const mixedKeys = new Set([
    ...Array.from(prev.keys()),
    ...Array.from(next.keys()),
  ]);


  mixedKeys.forEach((key) => {
    const relatedPrevItem = prev.get(key) ?? new Set();
    const relatedNextItem = next.get(key) ?? new Set();

    const add   = diff(relatedNextItem, relatedPrevItem);
    const rem = diff(relatedPrevItem, relatedNextItem);

    if (add.size) added.set(key, add);
    if (rem.size) removed.set(key, rem);
  });

  return {
    added,
    removed,
  };
}

console.warn('=====parseFilters(query)======', parseFilters(query));
console.warn(
  '=====stringifyFilters(resultMap)======',
  stringifyFilters(resultMap),
);
console.warn(
  '=====diffFilters(prevFilters, nextFilters)======',
  diffFilters(prevFilters, nextFilters),
);
