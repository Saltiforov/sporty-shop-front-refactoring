import { computed, ref } from 'vue';
import { useFetchApi } from '~/composables/useApi';
import { buildSlugIndex, isEqual } from '#shared/utils';
import { getAllFilters } from '~/services/api/filters';

export async function useCanonical(route) {
  const {
    data: filters,
    pending: filtersPending,
    error: filtersError,
  } = await useFetchApi('GeneralFiltersList', getAllFilters, null, {
    watch: false,
  });

  const isCanonical = ref(false);
  const canonicalUrl = ref(null);
  const indexSlugList = ref(null);
  const target = ref(null);

  indexSlugList.value = buildSlugIndex(filters.value.list);

  const isRootNode = (node) => {
    return node.children?.length > 0;
  };

  const parentFilterComponents = computed(
    () => filters.value && filters.value?.list.map((el) => isRootNode(el) && el),
  );

  const parentFilterComponentsSlugs = computed(
    () =>
      parentFilterComponents.value?.length &&
      parentFilterComponents.value.map(
        (item) => item && facitySlug(item.slug['en']),
      ),
  );

  const facitySlug = (slug: string) => `f-${slug}`;

  const queryWhiteList = [
    {
      availableCodes: parentFilterComponentsSlugs.value,
      validator: (item) => {
        return indexSlugList.value.has(item);
      },
      splitIdentify: ',',
      order: 1,
    },
    {
      availableCodes: ['price'],
      validator: (item) => {
        return item;
      },
      splitIdentify: ',',
      order: 2,
    },
    {
      availableCodes: ['sort'],
      validator: (item) => {
        return item;
      },
      splitIdentify: ',',
      order: 3,
    },
  ];

  const getValidatedQuery = () => {
    const validatedQueries = {};

    queryWhiteList.map((whiteItem) => {
      whiteItem.availableCodes.forEach((availableCode) => {
        const params =
          route.query &&
          route.query[availableCode] &&
          route.query[availableCode]
            .split(whiteItem.splitIdentify)
            .filter((item) => whiteItem.validator(item))
            .join(',');

        if (!params) return;

        validatedQueries[availableCode] = params;
      });
    });

    return validatedQueries;
  };

  target.value = {
    path: route.path,
    query: getValidatedQuery(),
  };

  const buildCanonicalUrl = () => {
    const params = new URLSearchParams();

    const keys = Object.keys(target.value.query ?? {}).sort();

    for (const key of keys) {
      const raw = target.value.query[key];

      if (
        raw == null ||
        raw === '' ||
        (Array.isArray(raw) && raw.length === 0)
      ) continue;

      const csv = Array.isArray(raw) ? raw.join(',') : String(raw).trim();
      params.set(key, csv);
    }

    const qs = params.toString();
    return qs ? `${route.path}?${qs}` : route.path;
  };

  canonicalUrl.value = buildCanonicalUrl();

  isCanonical.value = isEqual(decodeURIComponent(canonicalUrl.value), route.fullPath);

  return {
    canonicalUrl,
    isCanonical,
  };
}
