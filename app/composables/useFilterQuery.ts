import type { LocationQuery } from '#vue-router';
import { debounce } from '~/utils';

type MultiFilterKey = 'filters' | 'brand'
type ScalarFilterKey = 'price' | 'sort'

const DEFAULT_PRICE = { min: 0, max: 10000 };
export function useFilterQuery() {
  const route = useRoute();
  const router = useRouter();

  const makeState = () => ({
    filters: new Set<string>(),
    price: { ...DEFAULT_PRICE },
    sort: 'popular',
  });

  const state = ref(makeState());

  const parseFromRoute = () => {
    const query = route.query;

    state.value.filters = parseFilters(query);
    state.value.price = parsePrice(query);
    state.value.sort = parseSort(query);
  };

  const parseFilters = (query: LocationQuery): Set<string> => {
    const mapNotArrayFilters = query.filters
      ? new Set<string>([query.filters as string])
      : new Set<string>();

    return Array.isArray(query.filters)
      ? new Set(query.filters)
      : mapNotArrayFilters;
  };

  const parsePrice = (query: LocationQuery): { min: number; max: number } => {
    if (!query.price) return { ...DEFAULT_PRICE };

    const payload = Object.fromEntries(
      (query.price as string).split(',').map((pair) => {
        const [key, value] = pair.split('-');
        const num = Number(value);
        const validatedValue = isNaN(num)
          ? { ...DEFAULT_PRICE[key] }
          : num;

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

  const stringifyFilters = (filters = state.value.filters) => {
    return Array.from(filters);
  };

  const stringifyPrice = (price = state.value.price) => {
    return `min-${price.min},max-${price.max}`;
  };

  const add = (key: MultiFilterKey, value: string | string[]) => {
    const list = Array.isArray(value) ? value : [value];
    list.forEach((item) => {
      state.value[key].add(item);
    });
  };

  const remove = (key: MultiFilterKey, value: string | string[]) => {
    const list = Array.isArray(value) ? value : [value];
    list.forEach((item) => {
      state.value[key].delete(item);
    });
  };

  const replace = (key: ScalarFilterKey, value) => {
    if (key === 'price') {
      state.value[key] = value
        ? {
            min: value?.min,
            max: value?.max,
          }
        : { ...DEFAULT_PRICE };
    }
    if (key === 'sort') {
      state.value[key] = value;
    }
  };

  const isDefaultPrice = computed(() =>
      state.value.price.min === DEFAULT_PRICE.min &&
      state.value.price.max === DEFAULT_PRICE.max,
  );

  const isDefaultSort = computed(() => state.value.sort === 'popular');

  const toQuery = () => {
    return {
      ...(state.value.filters.size ? { filters: stringifyFilters() } : {}),
      ...(!isDefaultPrice.value ? { price: stringifyPrice() } : {}),
      ...(!isDefaultSort.value ? { sort: state.value.sort } : {}),
    };
  };

  const filtersState = computed(() => state.value.filters);

  const minPrice = computed({
    get: () => state.value.price.min,
    set: (min: number) => {
      state.value.price.min = min;
    },
  });

  const maxPrice = computed({
    get: () => state.value.price.max,
    set: (max: number) => {
      state.value.price.max = max;
    },
  });

  const sortState = computed(() => state.value.sort);


  const clear = () => {
    state.value = makeState();
  };

  parseFromRoute();

  const updateQuery = debounce(() => {
    const nextQuery = toQuery();
    router.replace({ query: nextQuery });
  }, 300);

  watch(
    state,
    () => {
      updateQuery();
      console.log('STATE', state.value);
    },
    { deep: true },
  );

  return {
    add,
    remove,
    replace,
    toQuery,
    clear,
    maxPrice,
    minPrice,
  };
}
