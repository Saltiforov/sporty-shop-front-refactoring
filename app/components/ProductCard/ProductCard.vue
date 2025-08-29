<template>
  <div
    :class="[
      'w-full product-card relative bg-white pt-[30px] pr-[30px] pb-[22px] pl-[30px] max-w-[280px] rounded-lg flex flex-col justify-start',
      !noAutoMargin && 'mx-auto',
    ]"
  >
    <div v-if="product.showAsNew" class="product-badge">
      <div
        :style="{ backgroundColor: product.backgroundStatus }"
        class="status-badge text-center rounded-tl-[8px] rounded-br-[8px] rounded-bl-[8px] max-w-[82px] w-full"
      >
        <p class="fw-600 text-[24px] leading-[var(--line-height-base)]">
          {{ product.status }}
        </p>
      </div>
    </div>
    ф

    <div class="product-card-content">
      <div
        class="product-card-header flex relative flex-col items-center justify-center"
      >
        <div
          v-if="isAuthenticated"
          class="absolute flex items-center justify-center h-[31px] w-[31px] z-10"
        >
          <FavoriteButton
            :is-favorite="product.isFavorite"
            :product="product"
          />
        </div>
        <NuxtLink
          :to="`/product/${product.slug}`"
          :style="{ marginBottom: variant === 'small' ? '4px' : '' }"
          class="block mb-6"
        >
          <img
            :class="[
              'rounded-lg w-full h-auto object-contain',
              'max-w-[128px] min-h-[114px] md:max-w-[135px] md:h-[135px] lg:max-w-[180px] lg:h-[180px]',
            ]"
            :src="productImage"
            alt="Product image"
          >
        </NuxtLink>
        <div class="product-name w-full min-h-[52px]">
          <p
            :style="{ fontSize: variant === 'small' ? '16px' : '' }"
            class="text-[20px] leading-[22px] fw-500 line-clamp-2"
          >
            {{ product.name }}
          </p>
        </div>
      </div>

      <div class="product-reviews mb-[27px] flex items-center">
        <svg
          class="mr-2"
          width="18"
          height="18"
          viewBox="0 0 18 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.75122 6.75258C1.51628 6.53531 1.6439 6.14254 1.96167 6.10487L6.46436 5.5708C6.59387 5.55544 6.70636 5.47411 6.76099 5.35569L8.66016 1.23835C8.79419 0.947769 9.20728 0.947714 9.34131 1.23829L11.2405 5.3556C11.2951 5.47403 11.4069 5.55558 11.5364 5.57093L16.0393 6.10487C16.3571 6.14254 16.4843 6.53543 16.2494 6.75269L12.9208 9.83143C12.8251 9.91998 12.7824 10.0518 12.8079 10.1797L13.6913 14.627C13.7536 14.9408 13.4196 15.184 13.1404 15.0277L9.18386 12.8125C9.07006 12.7488 8.9318 12.7491 8.818 12.8128L4.86108 15.0271C4.58185 15.1834 4.24721 14.9408 4.30957 14.627L5.19311 10.18C5.21852 10.0521 5.176 9.91995 5.08025 9.8314L1.75122 6.75258Z"
            stroke="#FFCC00"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p class="product-grade text-[16px] text-[#8E8E93] fw-500">
          {{ Number(product.reviews?.averageRating?.toFixed(1)) || '0' }}
          <span>({{ product.reviews?.reviewCount || '0' }})</span>
        </p>
      </div>
      <div class="flex relative items-center justify-between">
        <div class="product-pricing">
          <p
            v-if="hasDiscount"
            class="discount-price absolute -top-3 left-0 fw-500 text-[15px] line-through"
          >
            {{ productPrice }} {{ t(currencyLabel) }}
          </p>
          <p
            :class="{ 'text-[#EF4B4B]': hasDiscount }"
            :style="{ fontSize: variant === 'small' ? '16px' : '' }"
            class="text-[24px] price-without-discount leading-[22px] fw-500"
          >
            {{ productDiscount || 0 }} {{ t(currencyLabel) }}
          </p>
        </div>

        <slot name="buy-button">
          <VButton
            :pt="{
              root: {
                style: {
                  border: 'none',
                  padding: '0px',
                  background: 'var( --color-primary-green)',
                  borderRadius: '50%',
                },
              },
            }"
            class="text-white add-product-button self-end flex items-center w-[47px] h-[47px] px-4 py-2 rounded-[50%] transition"
            @click="addToCart(product)"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1H1.26835C1.74213 1 1.97943 1 2.17267 1.08548C2.34304 1.16084 2.48871 1.28218 2.59375 1.43604C2.71269 1.61026 2.75564 1.8429 2.84137 2.30727L5.00004 14L15.4218 14C15.875 14 16.1023 14 16.29 13.9199C16.4559 13.8492 16.5989 13.7346 16.7051 13.5889C16.8252 13.4242 16.8761 13.2037 16.9777 12.7631L16.9785 12.76L18.5477 5.95996L18.5481 5.95854C18.7023 5.29016 18.7796 4.95515 18.6947 4.69238C18.6202 4.46182 18.4635 4.26634 18.2556 4.14192C18.0184 4 17.6758 4 16.9887 4H3.5M16 19C15.4477 19 15 18.5523 15 18C15 17.4477 15.4477 17 16 17C16.5523 17 17 17.4477 17 18C17 18.5523 16.5523 19 16 19ZM6 19C5.44772 19 5 18.5523 5 18C5 17.4477 5.44772 17 6 17C6.55228 17 7 17.4477 7 18C7 18.5523 6.55228 19 6 19Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </VButton>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DefaultProductImage from '~/assets/images/product-image.png'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~~/stores/auth.client.ts'
import { useCurrencyStore } from '~~/stores/currency.client.ts'
import { fullImageUrls } from '#shared/utils/index.js'
import { useCartStore } from '~~/stores/cart.client.js'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => {},
  },
  variant: {
    type: String,
    default: 'default',
  },
  noAutoMargin: {
    type: Boolean,
    default: false,
  },
})

const { isAuthenticated } = storeToRefs(useAuthStore())
const { currency, currencyLabel } = storeToRefs(useCurrencyStore())

const cartStore = useCartStore()

const { t } = useI18n()

const addToCart = (product) => {
  cartStore.addToCart(product)
}
const productPrice = computed(() => {
  return props.product?.price?.[currency.value]
})

const productDiscount = computed(() => {
  return props.product?.priceAfterDiscount?.[currency.value]
})

const productImage = computed(() => {
  return props.product?.images?.length
    ? fullImageUrls(props.product.images, 'thumb')[0]
    : DefaultProductImage
})

const hasDiscount = computed(() => {
  return (
    productDiscount.value !== null &&
    productDiscount.value !== undefined &&
    productDiscount.value < productPrice.value
  )
})
</script>

<style scoped>
.product-badge {
  position: absolute;
  max-width: 82px;
  width: 100%;
  top: -8px;
  left: -12px;
  z-index: 100;
}

.card-buy-button {
  border: none;
  background: #28a745;
}

.card-buy-button:hover {
  border: none;
  background: #28a745;
}

.product-card {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  height: auto;
}

@media (max-width: 1669px) {
  .product-card {
    padding: 20px 16px 15px 16px;
  }
}

@media (max-width: 1610px) {
  .product-card {
    max-width: 310px;
  }
}

@media (max-width: 1350px) {
  .product-card {
    max-width: 270px;
  }
}

@media (max-width: 1275px) {
  .product-card {
    max-width: 250px;
  }
}

@media (max-width: 1210px) {
  .product-card {
    max-width: 230px;
  }

  .product-name p {
    font-size: 18px;
  }

  .product-reviews {
    margin-bottom: 10px;
  }

  .discount-price {
    top: -0.5rem;
    font-size: 13px;
  }

  .price-without-discount {
    font-size: 20px;
  }
}

@media (max-width: 1150px) {
  .product-card {
    max-width: 240px;
  }
}

@media (max-width: 1000px) {
  .product-card {
  }
}

@media (max-width: 905px) {
  .product-card {
    max-width: 230px;
  }
}

@media (max-width: 800px) {
  .product-card {
    max-width: 200px;
  }
}

@media (max-width: 700px) {
  .product-card {
    max-width: 180px;
    padding: 20px 10px 10px 10px;
  }

  .product-name p {
    font-size: 16px;
  }

  .discount-price {
    top: -0.25rem;
    font-size: 12px;
  }

  .price-without-discount {
    font-size: 18px;
  }
}

@media (max-width: 615px) {
  .product-card {
    max-width: 220px;
  }
}

@media (max-width: 500px) {
  .product-card {
    max-width: 200px;
    padding: 20px 16px 15px 16px;
  }

  .product-badge {
    top: -5px;
    left: -7px;
  }

  .product-grade {
    font-size: 10px;
  }

  .product-reviews {
    margin-bottom: 4px;
  }

  .price-without-discount {
    font-size: 12px !important;
  }

  .product-card-header img,
  a {
    width: 128px !important;
    height: 114px !important;
    margin: 0 auto;
  }

  .product-name p {
    font-size: 14px;
  }

  .discount-price {
    font-size: 10px;
  }

  .price-without-discount {
    font-size: 15px;
  }

  .block {
    margin-bottom: 4px;
  }

  .product-name {
    min-height: 28px;
  }

  .product-name p {
    font-size: 10px !important;
    line-height: 14px;
  }

  .product-card-content {
    max-width: 155px;
    margin: 0 auto;
  }

  .product-grade {
    font-size: 10px;
  }
}

@media (max-width: 470px) {
  .product-card {
    max-width: 160px;
    padding-top: 20px;
  }

  .product-name p {
    font-size: 10px;
  }

  .price-without-discount {
    font-size: 12px;
  }
}
</style>
