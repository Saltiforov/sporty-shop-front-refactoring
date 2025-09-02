<template>
  <ul
      v-if="show"
      class="search-dropdown-menu absolute z-[120] mt-1 w-full bg-white border border-gray-300 rounded shadow-md max-w-[420px] max-h-[300px] min-h-[50px] overflow-auto"
  >
    <div v-if="items.length" class="flex flex-col">
      <div v-for="(product, index) in items" :key="index">
        <NuxtLink
            v-if="!isCurrent(product)"
            :to="buildRedirectUrlWithLocale(product)"
            class="product-item flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            @click.native="selectItem(product)"
        >
          <div class="flex items-center w-full">
            <img
                :src="fullImageUrls(product.images)[0] || DefaultProductImage"
                alt="item image"
                class="search-image w-8 h-8 object-cover mr-3 rounded"
            >
            <span class="search-name text-sm text-gray-800 px-2 flex-grow">
              {{ product.name }}
            </span>
                      <span class="search-price text-sm text-gray-800 font-bold">
              {{ getProductPrice(product) }}
            </span>
          </div>
        </NuxtLink>
        <div
            v-else
            class="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            @click.native="selectItem(product)"
        >
          <img
              :src="fullImageUrls(product.images)[0] || DefaultProductImage"
              alt="item image"
              class="w-8 h-8 object-cover mr-3 rounded"
          >
          <span class="text-xs text-gray-800 px-2">{{ product.name }}</span>
          <span class="text-xs text-gray-800 font-bold">{{ getProductPrice(product) }}</span>
        </div>
      </div>
    </div>
    <div v-else-if="searchFieldValue && !items.length">
      <p class="search-dropdown-menu-text text-center p-5">{{ t('search_no_results_hint') }}</p>
    </div>
    <div v-else>
      <p class="search-dropdown-menu-text text-center p-5">{{ t('empty_search_message') }}</p>
    </div>
  </ul>
</template>

<script setup lang="ts">
import DefaultProductImage from '~/assets/images/product-image.png';
import { useCurrencyStore } from '~~/stores/useCurrency';
import { storeToRefs } from 'pinia';

defineProps({
  show: Boolean,
  items: {
    type: Array,
    required: true,
  },
  searchFieldValue: {
    type: String,
    required: false,
    default: '',
  },
});

const {t, locale} = useI18n();
const { currency } =  storeToRefs(useCurrencyStore());
const route = useRoute();

const getProductPrice = (product) => {
  return `${product.priceAfterDiscount[currency.value.toLowerCase()]} ${currency.value}`;
};

const buildRedirectUrlWithLocale = (product) => {
  return `/${locale.value}/product/${product.slug}`;
};

const isCurrent = (product) => {
  return route.path === buildRedirectUrlWithLocale(product);
};

const emit = defineEmits(['selected']);

const selectItem = (item) => {
  emit('selected', item);
};
</script>

<style scoped>
@media (max-width: 500px) {
  .search-dropdown-menu {
    border-radius: 8px;
    min-height: auto;
  }

  .search-image {
    margin-right: 0;
  }

  .search-name {
    font-size: 11px;
    line-height: 22px;
  }

  .search-price {
    font-size: 11px;
    line-height: 22px;
    margin-left: auto;
  }

  .product-item {
    padding: 5px 14px 4px 12px;
  }

  .search-dropdown-menu-text {
    font-size: 12px;
  }
}
</style>
