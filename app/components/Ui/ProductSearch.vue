<template>
  <form
    method="get"
    class="search-field w-full relative"
    @submit.prevent="onEnter"
  >
    <VIconField
      :pt="{
        root: {
          style: {
            borderRadius: '12px',
          },
        },
      }"
    >
      <VInputText
        v-model="searchFieldValue"
        name="q"
        :pt="{ root: { class: 'header-search-field' } }"
        :placeholder="searchFieldPlaceholder"
        @focus="searchIsFocused = true"
        @blur="handleBlur"
      />
      <VInputIcon
        v-if="searchFieldValue.length > 0"
        class="pi pi-times cursor-pointer"
        :pt="{ root: { class: 'input-icon' } }"
        @click.prevent="handleClear"
      />
      <VInputIcon
        v-else
        class="pi pi-search"
        :pt="{
          root: {
            class: 'input-icon',
            style: { color: 'var(--color-primary-black)' },
          },
        }"
      />
    </VIconField>

    <UiSearchDropdownMenu
      :show="searchIsFocused"
      :items="receivedProducts"
      :search-field-value="searchFieldValue"
      @selected="onSuggestionSelect"
    />
  </form>
</template>

<script setup>
import { useDebouncedRef } from '~/composables/useDebounceRef.ts';
import { getSuggestionProductList } from '~/services/api/products/index.js';

const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();

const searchIsFocused = ref(false);
const receivedProducts = ref([]);

const searchFieldValue = ref(route.query.q || '');

const debouncedSearch = useDebouncedRef(searchFieldValue, 300);

const searchFieldPlaceholder = computed(() => t('search_placeholder'));
const isMainPage = computed(() => route.name === `index___${locale.value}`);

function handleBlur() {
  setTimeout(() => {
    searchIsFocused.value = false;
  }, 150);
}

const handleClear = () => {
  searchFieldValue.value = '';
  searchIsFocused.value = false;
  receivedProducts.value = [];
};

function onEnter() {
  const q = searchFieldValue.value.trim();
  router.push({
    path: route.path,
    query: { ...route.query, q, page: 1 },
  });
}

function onSuggestionSelect(item) {
  if (route.params.slug === item.slug) {
    handleClear();
    return;
  }

  const suggestionUrl = `/${locale.value}/product/${item.slug}`;
  router.push(suggestionUrl);
  handleClear();
}

watch(debouncedSearch, async (val) => {
  const q = val.trim();
  if (!q) {
    receivedProducts.value = [];
    if (isMainPage.value) {
      const { q: _, ...rest } = route.query;
      router.replace({
        path: route.path,
        query: {
          ...rest,
          page: 1,
        },
      });
    }

    return;
  }

  const { $basicApi } = useNuxtApp();

  const { list } = await getSuggestionProductList($basicApi,{ q, limit: 5 });
  receivedProducts.value = list;
});

watch(
  () => route.query.q,
  (value) => {
    searchFieldValue.value = value;
  },
);
</script>

<style scoped>
.header-search-field {
  width: 100%;
  border-radius: 12px;
  border: none;
}

@media (max-width: 500px) {
  .header-search-field {
    padding: 6px 10px 6px 20px;
    font-size: 11px;
  }
}
</style>
