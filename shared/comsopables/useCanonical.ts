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
    const basicUrl = new URLSearchParams(route.path);
    const targetQueriesKeys = Object.keys(target.value.query);
    console.log('targetQueriesKeys', targetQueriesKeys);
    if (targetQueriesKeys.length) {
      targetQueriesKeys.forEach((key) => {
        basicUrl.set(key, target.value.query[key]);
      });
    }

    return basicUrl.toString();
  };

  canonicalUrl.value = buildCanonicalUrl();

  console.log('canonicalUrl.value', canonicalUrl.value);
  console.log('route.fullPath', route.fullPath);

  isCanonical.value = isEqual(canonicalUrl.value, route.fullPath);

  return {
    canonicalUrl,
    isCanonical,
  };
}
