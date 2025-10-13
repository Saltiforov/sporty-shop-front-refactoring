import type { LocationQuery } from '#vue-router';

const DEFAULT_PRICE = { min: 0, max: 10000 };

const filtersUrlDemarcation = (query: LocationQuery) => {
  const filters = new Map();

  Object.entries(query).forEach(([key, value]) => {
    if (key.startsWith('f-')) {
      const facet = key.slice(2);

      if (value) {
        filters.set(facet, new Set(String(value).split(',')));
      }
    }
  });

  return filters;
};

const parseFilters = (query: LocationQuery): any => {
  const mappedFilters = filtersUrlDemarcation(query) as any;

  const newMap = new Map(
    Array.from(mappedFilters.entries()).map(([key, set]) => [
      key,
      new Set(set),
    ]),
  );

  const mapNotArrayFilters = mappedFilters.size ? newMap : new Map();

  return mappedFilters.size ? newMap : mapNotArrayFilters;
};

const parsePrice = (query: LocationQuery): { min: number; max: number } => {
  if (!query.price) return { ...DEFAULT_PRICE };

  const payload = Object.fromEntries(
    (query.price as string).split(',').map((pair) => {
      const [key, value] = pair.split('-');
      const num = Number(value);
      const validatedValue = isNaN(num) ? { ...DEFAULT_PRICE[key] } : num;

      return [key, validatedValue];
    }),
  ) as { min: number; max: number };

  if (payload.min > payload.max) {
    ;[payload.min, payload.max] = [payload.max, payload.min];
  }

  return payload;
};

const parseSort = (query: LocationQuery): string => {
  return query.sort ? (query.sort as string) : 'popular';
};


export {
  parseFilters,
  parsePrice,
  parseSort,
  filtersUrlDemarcation,
  DEFAULT_PRICE,
};


