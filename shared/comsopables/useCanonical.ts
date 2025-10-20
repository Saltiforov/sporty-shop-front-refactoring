import { computed, ref } from 'vue';
import { useFetchApi } from '~/composables/useApi';
import { buildSlugIndex, isEqual } from '#shared/utils';
import { getAllFilters } from '~/services/api/filters';

const BASIC_LOCALE_CODE = 'en';

// http://localhost:3080/en?f-brand=kevin-levrone,myprotein,biotechusa&f-sports-nutrition=amino-acids,myprotein&f-injections=bsn,masteron,myprotein,myprotein,myprotein

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

  const parentFilterComponents = computed(() =>
    (filters.value?.list ?? []).filter(isRootNode),
  );

  const parentFilterComponentsSlugs = computed(
    () =>
      parentFilterComponents.value?.length &&
      parentFilterComponents.value.map(
        (item) => item && facitySlug(item.slug[BASIC_LOCALE_CODE]),
      ),
  );

  const groupElementByParent = new Map<string, Set<string>>();
  for (const parent of parentFilterComponents.value) {
    groupElementByParent.set(
      parent.slug[BASIC_LOCALE_CODE],
      new Set(parent.children.map((c) => c.slug[BASIC_LOCALE_CODE])),
    );
  }

  const facitySlug = (slug: string) => `f-${slug}`;

  const normalize = (code: string) => code.replace(/^f-/, '');

  const queryWhiteList = computed(() => [
    {
      availableCodes: parentFilterComponentsSlugs.value,
      validator: (childSlug, parentCode) => {
        return (
          indexSlugList.value.has(childSlug) &&
          groupElementByParent.get(normalize(parentCode))?.has(childSlug)
        );
      },
      splitIdentify: ',',
      order: 1,
    },
    {
      availableCodes: ['price'],
      validator: (item, parentCode) => {
        return item;
      },
      splitIdentify: ',',
      order: 2,
    },
    {
      availableCodes: ['sort'],
      validator: (item, parentCode) => {
        return item;
      },
      splitIdentify: ',',
      order: 3,
    },
  ]);

  const getValidatedQuery = () => {
    const validatedQueries = {};

    queryWhiteList.value.map((whiteItem) => {
      whiteItem.availableCodes.forEach((availableCode) => {
        const params =
          route.query &&
          route.query[availableCode] &&
          route.query[availableCode]
            .split(whiteItem.splitIdentify)
            .filter((item) => whiteItem.validator(item, availableCode))
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

      if (raw == null || raw === '' || (Array.isArray(raw) && raw.length === 0))
        continue;

      const csv = Array.isArray(raw)
        ? Array.from(new Set(raw)).sort().join(',')
        : String(raw).trim();

      params.set(key, csv);
    }

    const qs = params.toString();

    return qs ? `${route.path}?${qs}` : route.path;
  };

  canonicalUrl.value = buildCanonicalUrl();

  isCanonical.value = isEqual(
    decodeURIComponent(canonicalUrl.value),
    route.fullPath,
  );

  return {
    canonicalUrl,
    isCanonical,
  };
}
