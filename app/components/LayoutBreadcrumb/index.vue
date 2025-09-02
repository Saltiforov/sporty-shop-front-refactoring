<template>
  <Breadcrumb
    :pt="{ list: { style: { flexWrap: 'wrap' } } }"
    class="breadcrumb"
    :model="breadcrumbItems"
  >
    <template #item="{ item }">
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        class="cursor-pointer breadcrumb-text"
        @click.prevent="handleLinkClick(item)"
      >
        {{ item.label }}
      </NuxtLink>
      <span v-else class="breadcrumb-text">{{ item.label }}</span>
    </template>
    <template #separator> »</template>
  </Breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { IProduct } from '#shared/types/products.js';

const props = defineProps<{ product: IProduct }>();
const { product } = toRefs(props);

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();

const breadcrumbItems = computed(() => {
  const mainPage = {
    label: t('navigation_home'),
    to: localePath('/'),
  };

  const hasProductData = product.value.productTitle?.trim();

  if (hasProductData) {
    const hasFilters = product.value.filters?.length > 0;

    if (hasFilters) {
      const localizedFilters = product.value.filters.map((filter) => ({
        label: filter.name?.[locale.value],
        to: localePath({
          path: '/',
          query: { filters: filter.slug[locale.value] },
        }),
      }));

      return [
        mainPage,
        ...localizedFilters,
        { label: product.value.productTitle, to: null },
      ];
    } else {
      return [mainPage, { label: product.value.productTitle, to: null }];
    }
  }

  const routeCrumbs = route.matched
    .filter((r) => r.meta?.breadcrumb !== false)
    .map((r) => {
      let key = '';

      if (typeof r.meta?.breadcrumb === 'string') {
        key = r.meta.breadcrumb;
      } else {
        const segments = r.path.split('/').filter(Boolean);
        key =
          segments[segments.length - 1]?.replace(/-()/g, '_') ||
          'navigation_home';
      }

      return {
        label: t(key),
        to: null,
      };
    });

  return [mainPage, ...routeCrumbs];
});

const handleLinkClick = (item) => {
  if (item.to) {
    router.push(item.to);
  }
};
</script>

<style scoped>
.breadcrumb {
  padding: 35px 10px;
}

.breadcrumb-text {
  font-weight: 200;
  font-size: 16px;
  line-height: 22px;
  color: var(--small-title-color);
}
</style>
