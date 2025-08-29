<template>
  <div>
    <div class="max-w-[1756px] mx-auto">
      <div class="main-content-container">
        <div
          class="main-content min-h-screen grid-cols-1 grid lg:grid-cols-[354px_1fr] gap-[89px]"
        >
          <div class="product-grid">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              @add-to-cart="showToast"
              @click="addProductToViewed(product)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { getProducts } from '~/services/api/products'

const route = useRoute()
const { t, locale } = useI18n()

const page = ref(Number(route.query.page) || 1)
const limit = ref(Number(route.query.limit) || 10)
const skip = computed(() => (page.value - 1) * limit.value)
const q = computed(() => route.query.q ?? '')
// const { $api } = useNuxtApp()
// console.log('$api', $api);
const productsQueryParams = computed(() => {
  return {
    page: page.value,
    limit: limit.value,
    skip: skip.value,
    filters: route.query.filters,
    price: route.query.price,
    sort: route.query.sort,
    ...(q.value ? { q: q.value } : {}),
  }
})

const { data: products } = await useAsyncData(
  'GeneralProductsList',
  () => {
    const params = {
      ...productsQueryParams.value,
      locale: locale.value,
    }
    console.log('PARAMS', params)
    return getProducts($api, params)
  },
  {
    watch: [productsQueryParams],
  }
)

console.log('products', products.value)
</script>

<style scoped>
.product-grid {
  display: grid;
  max-width: 1264px;
  gap: 48px;
  margin-bottom: 45px;
  width: 100%;
  grid-template-columns: repeat(4, 1fr);
}

.product-pagination-wrapper {
  width: 274px;
  margin: 0 auto;
}

.promo-slider-btn:hover {
  background-color: transparent;
}

.responsive-filters {
  font-size: 12px;
  box-shadow: 0 0 2px #00000040;
  border-radius: 8px;
  cursor: pointer;
  min-width: 92px;
  height: auto;
  padding: 4.5px 6px;
  display: none;
  justify-content: space-between;
  align-items: center;
}

.responsive-filters-icon {
  margin-left: 10px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  will-change: transform, opacity;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.responsive-filters-title {
  font-size: 16px;
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1670px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  .sort-select {
    min-width: auto;
  }
}

@media (max-width: 1630px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1420px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .main-content {
    gap: 16px;
  }
}

@media (max-width: 1150px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .main-content {
    gap: 8px;
  }
}

@media (max-width: 1024px) {
  .promotional-products {
    display: none;
  }

  .empty-block {
    display: none;
  }

  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .main-content-container {
    display: flex;
    flex-direction: column;
  }

  aside {
    display: block;
    border: none;
  }

  .filters {
    display: none;
  }

  .select-filters {
    justify-content: space-between;
  }

  .responsive-filters {
    display: flex;
  }

  .filters--mobile {
    height: auto !important;
    border: none !important;
    margin-bottom: 10px;
  }
}

@media (max-width: 800px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 750px) {
  .select-filters {
    margin-top: 30px;
    padding-top: 10px;
    justify-content: space-between;
  }

  .sort-title {
    font-size: 15px;
  }

  .product-grid {
    gap: 24px;
  }
}

@media (max-width: 700px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .sort-title {
    margin-right: 4px;
  }
}

@media (max-width: 650px) {
  .product-grid {
    gap: 16px;
  }
}

@media (max-width: 615px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 550px) {
  .products-pagination-actions {
    margin-bottom: 40px;
  }

  .product-grid {
    margin-bottom: 24px;
  }
}

@media (max-width: 510px) {
  .sort-title {
    font-size: 10px;
  }

  .responsive-filters-title {
    font-size: 12px;
  }

  .main-content {
    gap: 0;
    padding: 0 10px;
  }

  .responsive-filters {
    justify-content: space-between;
  }

  .sort-select {
    justify-content: center;
    align-items: center;
  }

  .select-filters {
    margin-top: 30px;
    padding-top: 25px;
    margin-bottom: 16px;
  }
}
</style>
