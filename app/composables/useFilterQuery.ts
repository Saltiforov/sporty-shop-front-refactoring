import type { LocationQuery } from '#vue-router';
import { debounce } from '~/utils';

type MultiFilterKey = 'filters' | 'brand'
type ScalarFilterKey = 'price' | 'sort'

interface IFilterPayload {
  facetNode: any
  value: string
}

const DEFAULT_PRICE = { min: 0, max: 10000 };
export function useFilterQuery() {
  const route = useRoute();
  const router = useRouter();

  const makeState = () => ({
    filters: {
      generalValue: new Set<string>(),
      facetKeys: new Map(), // todo rename
    },
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



  const filtersUrlDemarcation = () => {
    const filters = {};
    console.log('filtersUrlDemarcation', route.query);
    Object.entries(route.query).forEach(([key, value]) => {
      if (key.startsWith('f-')) {
        const facetMap = state.value[key].facetKeys;

        const facet = key.slice(2); // убираем 'f-// '

        console.log('filtersUrlDemarcation', value);

        facetMap.set(key, value);


        filters[facet] = new Set(String(value).split(','));
      }
    });

    console.log('filtersUrlDemarcation filters', filters);

    return filters;
  };



  const parseFilters = (query: LocationQuery): any => {
    const mappedFilters = filtersUrlDemarcation();

    console.log('mappedFilters', mappedFilters);
    const mapNotArrayFilters = query.filters
      ? {
          generalValue: new Set<string>([query.filters as string]),
          facetKeys: new Map(), // todo rename
        }
      : {
          generalValue: new Set<string>(),
          facetKeys: new Map(), // todo rename
        };

    return Array.isArray(query.filters)
      ? {
          generalValue: new Set<any>([query.filters]),
          facetKeys: new Map(), // todo rename
        }
      : mapNotArrayFilters;
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

  const stringifyFilters = () => {
    const facetMap = state.value.filters.facetKeys;
    let facetFilters = {};

    for (const [key, setValue] of facetMap.entries()) {
      const values = Array.from(setValue.values());
      const filterPartKey = `f-${key}`;
      const filterPart = {
        [filterPartKey]: values.sort().join(','),
      };

      facetFilters = {
        ...facetFilters,
        ...filterPart,
      };
    }
    return facetFilters;
  };

  const stringifyPrice = (price = state.value.price) => {
    return `min-${price.min},max-${price.max}`;
  };

  parseFromRoute();

  const add = (key: MultiFilterKey, payload: IFilterPayload) => {
    if (payload.facetNode) {

      const facetMap = state.value[key].facetKeys;
      if (!facetMap.get(payload.facetNode.slug)) {
        facetMap.set(payload.facetNode.slug, new Set);
      }

      facetMap.get(payload.facetNode.slug).add(payload.value);
    }

    const list = Array.isArray(payload.value) ? payload.value : [payload.value];

    list.forEach((item) => {
      state.value[key].generalValue.add(item);
    });
  };

  const remove = (key: MultiFilterKey, payload: IFilterPayload) => {
    const list = Array.isArray(payload.value) ? payload.value : [payload.value];
    list.forEach((item) => {
      state.value[key].generalValue.delete(item);
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

  const isDefaultPrice = computed(
    () =>
      state.value.price.min === DEFAULT_PRICE.min &&
      state.value.price.max === DEFAULT_PRICE.max,
  );

  const isDefaultSort = computed(() => state.value.sort === 'popular');

  const selectedFilters = computed(() => state.value.filters.generalValue);

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


  const updateQuery = debounce(() => {
    let q: Record<string, any> = {};

    if (state.value.filters.generalValue.size) {
      q = { ...q, ...stringifyFilters() };
    }
    if (!isDefaultPrice.value) {
      q.price = stringifyPrice();
    }

    if (!isDefaultSort.value) {
      q.sort = state.value.sort;
    }

    router.replace({ query: q });
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
    clear,
    maxPrice,
    minPrice,
    selectedFilters,
    filtersUrlDemarcation,
  };
}
