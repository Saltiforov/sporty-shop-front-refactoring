<template>
  <div class="flex items-center">
    <VSelect
        v-model="selectedOption"
        :pt="{
        root: { class: 'select-root' },
        label: { class: 'select-label' },
        dropdown: { class: 'select-dropdown' },
        optionLabel: { class: 'select-option-label' }
      }"
        option-label="name"
        :options="sortOptions"
        @change="applySort"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const selectedOption = ref({ name: t('sort_popular'), code: 'popular' });

const sortOptions = computed(() => [
  { code: 'popular', name: t('sort_popular') },
  { code: 'price_asc', name: t('sort_price_asc') },
  { code: 'price_desc', name: t('sort_price_desc') },
  { code: 'newest', name: t('sort_newest') },
  { code: 'rating', name: t('sort_rating') },
]);

const syncWithRoute = () => {
  const sortFromRoute = route.query.sort;
  if (sortFromRoute) {
    const option = sortOptions.value.find(opt => opt.code === sortFromRoute);
    if (option) {
      selectedOption.value = option;
    }
  }
};

const applySort = () => {
  const updatedQuery = {
    ...route.query,
    sort: selectedOption.value.code,
  };
  router.push({ query: updatedQuery });
};

onMounted(syncWithRoute);
watch(() => route.query.sort, syncWithRoute);
</script>

<style>
.select-root {
  background-color: transparent !important;
  border: none !important;
}

.select-label {
  color: var(--color-primary-dark) !important;
  margin-right: 0.5rem !important;
  padding: 0 !important;
  line-height: 22px !important;
  font-weight: 500 !important;
  font-size: 15px !important;
}

.select-dropdown {
  width: 0.75rem !important;
  color: var(--color-gray-dark-charcoal) !important;
}

.select-option-label {
  font-size: 15px !important;
}

@media (max-width: 510px) {
  .select-label,
  .select-option-label {
    font-size: 10px !important;
  }
}
</style>
