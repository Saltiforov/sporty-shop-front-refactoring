import { debounce } from '~/utils';
import { parseFilters, parsePrice, parseSort, DEFAULT_PRICE } from '~/utils/filters';
import { isEqual } from '#shared/utils';

type MultiFilterKey = 'filters' | 'brand'
type ScalarFilterKey = 'price' | 'sort'
enum UpdateMapStateMethod {
 ADD = 'add',
 DELETE = 'delete',
}

interface IFilterPayload {
  facetNode: any
  value: string
}

export function useFilterQuery() {
  const route = useRoute();
  const router = useRouter();

  const makeState = () => ({
    filters: new Map(),
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

  const stringifyFilters = () => {
    const facetMap = state.value.filters;
    const facetFilters = {};

    for (const [key, setValue] of facetMap.entries()) {
      if (!setValue || setValue.size === 0) continue;

      const filterPartKey = `f-${key}`;

      facetFilters[filterPartKey] = values.sort().join(',');
    }

    return facetFilters;
  };

  const stringifyPrice = (price = state.value.price) => {
    return `min-${price.min},max-${price.max}`;
  };

  const updateFilterState = (mapState, payload: IFilterPayload, updateMethod: UpdateMapStateMethod) => {
    const slug = payload.facetNode.slug;

    const values = Array.isArray(payload.value)
      ? payload.value
      : [payload.value];

    values.forEach((value) => {
      mapState.get(slug)[updateMethod](value);
    });
  };

  const add = (key: MultiFilterKey, payload: IFilterPayload) => {
    const facetMap = state.value[key];
    const slug = payload.facetNode.slug;

    if (!facetMap.get(slug)) {
      facetMap.set(slug, new Set());
    }
    updateFilterState(facetMap, payload, UpdateMapStateMethod.ADD);
  };

  const remove = (key: MultiFilterKey, payload: IFilterPayload) => {
    const facetMap = state.value[key];

    if (facetMap.get(payload.facetNode.slug)) {
      updateFilterState(facetMap, payload, UpdateMapStateMethod.DELETE);
    }
  };

  const replace = (key: ScalarFilterKey, value) => {
    if (key === 'price') {
      const isPriceValid = value && (value.min !+= DEFAULT_PRICE.min && value.max !== DEFAULT_PRICE.max);
      state.value[key] = isPriceValid
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

  const selectedFilters = computed(
    () =>
      new Set(
        Array.from(state.value.filters.values()).flatMap((set) =>
          Array.from(set),
        ),
      ),
  );

  const isDefaultSort = computed(() => state.value.sort === 'popular');

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

  const clear = () => {
    state.value = makeState();
  };

  const nextQuery = computed(() => {
    const q: Record<string, any> = {};
    if (state.value.filters.size) Object.assign(q, stringifyFilters());

    if (!isDefaultPrice.value) {
      q.price = stringifyPrice();
    }

    if (!isDefaultSort.value) q.sort = state.value.sort;

    return q;
  });

  const updateQuery = debounce(() => {
    let q: Record<string, any> = {};

    if (state.value.filters.size) {
      q = { ...q, ...stringifyFilters() };
    }

    if (!isDefaultPrice.value) {
      q.price = stringifyPrice();
    }

    if (!isDefaultSort.value) {
      q.sort = state.value.sort;
    }

    const next = q;
    const curr = route.query;


    if (isEqual(next, curr)) return;

    router.push({ path: route.path, query: q });
  }, 300);

  watch(
    nextQuery,
    () => {
      updateQuery();
    },
    { deep: true, immediate: true },
  );

  watch(() => route.fullPath, () => {
    parseFromRoute();
  }, { deep: false, immediate: true });

  return {
    add,
    remove,
    replace,
    clear,
    maxPrice,
    minPrice,
    selectedFilters,
  };
}
