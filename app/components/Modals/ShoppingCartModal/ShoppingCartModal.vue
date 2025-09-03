<template>
  <div>
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[400] bg-black bg-opacity-50 backdrop-blur-custom"
      @click="emit('close')"
    />
    <div
      class="fixed z-[500] border-top-radius top-0 right-0 h-full bg-[var(--color-gray-light-lavender)] shadow-lg transform transition-transform duration-300 shopping-cart pt-[36px] pb-[28px] pl-[46px] pr-[30px] rounded-tl-[32px] rounded-bl-[32px]"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="header flex justify-between pb-[49px] items-center">
        <div class="flex">
          <h1 class="cart-title large-title mr-[25px]">
            {{ t('cart_title') }}
          </h1>
          <p
            class="cart-count large-title"
            style="color: var(--color-muted-light-gray)"
          >
            ({{ cartStore.cartCount || 0 }})
          </p>
        </div>
        <div class="pr-[8px]">
          <Button
            :pt="{
              root: {
                style: {
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '0',
                },
              },
            }"
            class="close-cart"
            @click="$emit('close')"
          />
        </div>
      </div>

      <div v-if="!cartProducts.length" class="cart-empty-title">
        <h2
          class="empty-cart-text text-center text-[var(--color-gray-dark-charcoal)] text-[24px] py-[50px]"
        >
          {{ t('empty_cart_text') }}
        </h2>
      </div>

      <ProductCard
        v-for="product in cartProducts"
        :key="product.id"
        variant="small"
        :product="product"
      >
        <template #buy-button>
          <Button
            :pt="{
                  root: {
                    style: {
                      backgroundColor: 'var(--color-primary-green)',
                      color: 'var(--color-primary-white)',
                      borderRadius: '100%',
                      border: 'none',
                      padding: '0',
                      ...recommendedProductsIconSizes,
                    },
                  },
                }"
            class="flex justify-center items-center"
            @click="addToCart(product)"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 7.5H7.5M7.5 7.5H13.5M7.5 7.5V13.5M7.5 7.5V1.5"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Button>
        </template>
      </ProductCard>
<!--      <ProductsOverview-->
<!--        :products-overview="cartProducts"-->
<!--        @handle-cart-item="emit('close')"-->
<!--      />-->
      <div class="make-order-block flex flex-col items-center mb-[50px]">
        <div class="make-order-button-wrapper mb-[10px] w-full max-w-[423px]">
          <NuxtLink to="/checkout">
            <VButton
              :pt="{ root: { class: 'make-order-button btn-hover-default' } }"
              @click="$emit('close')"
            >
              <p
                class="fw-400 murecho-font text-[#FFFFFF] text-[14px] leading-[22px]"
              >
                {{ t('make_order') }}
              </p>
            </VButton>
          </NuxtLink>
        </div>
        <div class="">
          <VButton
            :pt="{
              root: {
                style: {
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--small-title-color)',
                },
              },
            }"
            class="continue-shopping__btn"
            to="/"
            @click="handleContinueShopping"
          >
            <p class="continue-shopping-text murecho-font">
              {{ t('continue_shopping') }}
            </p>
          </VButton>
        </div>
      </div>

      <div class="recommended-products">
        <div class="flex items-center gap-4">
          <div class="w-[152px] h-px bg-white" />
          <h2 class="h2-title text-center whitespace-nowrap">
            {{ t('recommended_products') }}
          </h2>
          <div class="w-[152px] h-px bg-white" />
        </div>
        <div
          class="recommended-products-cards mt-[22px] grid grid-cols-2 gap-[30px]"
        >
          <ProductCard
            v-for="product in products"
            :key="product.id"
            variant="small"
            :product="product"
          >
            <template #buy-button>
              <Button
                :pt="{
                  root: {
                    style: {
                      backgroundColor: 'var(--color-primary-green)',
                      color: 'var(--color-primary-white)',
                      borderRadius: '100%',
                      border: 'none',
                      padding: '0',
                      ...recommendedProductsIconSizes,
                    },
                  },
                }"
                class="flex justify-center items-center"
                @click="addToCart(product)"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.5 7.5H7.5M7.5 7.5H13.5M7.5 7.5V13.5M7.5 7.5V1.5"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Button>
            </template>
          </ProductCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~~/stores/useCart';
import { useAppShellState } from '~~/stores/useAppShellState.client';
import { ModalNames } from '#shared/types/modals';
import { useWindowWidthWatcher } from '~/composables/useWindowWidthWatcher';

const emit = defineEmits([
  'continue-shopping',
  'handle-recommended-product',
  'close',
]);

const cartStore = useCartStore();
const { isModalOpen } = useAppShellState();
const { addToCart } = cartStore;
const { cartProducts } = storeToRefs(cartStore);

const isOpen = computed(() => isModalOpen(ModalNames.CART));

const { t } = useI18n();

const getWidth = useWindowWidthWatcher();

const windowWidth = computed(() => getWidth());

const handleContinueShopping = () => {
  emit('continue-shopping');
};

const products = ref([
  {
    _id: '680be0d6e0a2df86dc64154e',
    id: '680be0d6e0a2df86dc64154e',
    name: 'Енергетичний напій MOXY Power+',
    slug: 'moxy-power-drink',
    rating: ref('4.6'),
    price: ref({ uah: 70, eur: 1.63 }),
    discount: ref({ uah: 5, eur: 0.13 }),
    priceAfterDiscount: ref({ uah: 65, eur: 1.50 }),
    images: [],
    isFavorite: ref(false),
    filters: [],
    reviews: ref({ list: [], reviewCount: 0, averageRating: null }),
    quantity: 1,
  },
  {
    _id: '680bdf7fe0a2df86dc6414ec',
    id: '680bdf7fe0a2df86dc6414ec',
    name: 'Креатин моногідрат - OstroVit',
    slug: 'creatine-ostrovit',
    rating: ref('4.1'),
    price: ref({ uah: 895, eur: 18 }),
    discount: ref({ uah: 196, eur: 4 }),
    priceAfterDiscount: ref({ uah: 699, eur: 14 }),
    images: [],
    isFavorite: ref(true),
    filters: [],
    reviews: ref({ list: [], reviewCount: 0, averageRating: null }),
    quantity: 1,
  },
]);

const recommendedProductsIconSizes = computed(() => {
  return windowWidth.value < 470
    ? { width: '36px', height: '36px' }
    : { width: '29px', height: '29px' };
});
</script>

<style scoped>
.make-order-button {
  width: 100%;
  border-radius: var(--default-rounded);
  background: var(--color-primary-dark);
}

.make-order-button:hover {
  background: var(--color-primary-dark);
}

.card-buy__small__btn:hover {
  background: var(--color-primary-green);
  border: none;
}

.close-cart {
  background: transparent;
  border: none;
  padding: 0;
}

.close-cart:hover {
  background: transparent;
  border: none;
  padding: 0;
}

.shopping-cart {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  max-width: 619px;
  width: 100%;
  background-color: #e6e7f8;
  z-index: 1000;
  box-shadow: -4px 0px 8px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
}

@media (max-width: 1700px) {
  .shopping-cart {
    padding: 18px 14px 23px 24px;
    width: 100%;
  }
}

@media (max-width: 1300px) {
  .shopping-cart {
    width: 100%;
    padding: 18px 14px 23px 14px;
  }
}

@media (max-width: 1000px) {
  .shopping-cart {
    width: 100%;
  }
}

@media (max-width: 850px) {
  .shopping-cart {
    width: 65%;
  }
}

@media (max-width: 700px) {
  .shopping-cart {
    width: 70%;
  }

  .shopping-cart {
    padding-right: 12px;
    padding-left: 12px;
  }

  .header {
    padding: 0 10px 20px 10px;
  }
}

@media (max-width: 670px) {
  .recommended-products-cards {
    padding-bottom: 60px;
    gap: 16px;
  }
  .shopping-cart {
    width: 70%;
  }
  .shopping-cart {
    padding: 18px 10px 23px 14px;
  }
}

@media (max-width: 670px) {
  .shopping-cart {
    width: 80%;
  }
}

@media (max-width: 550px) {
  .make-order-button-wrapper {
    max-width: 274px;
  }
  .empty-cart-text {
    font-size: 16px;
  }
  .header {
    flex-direction: row-reverse;
  }
  .cart-title {
    margin-right: 22px;
    font-size: 16px;
  }
  .cart-count {
    font-size: 16px;
  }
  .header {
    padding-bottom: 55px;
  }
  .continue-shopping-text {
    font-size: 14px;
  }
  .make-order-block {
    margin-bottom: 25px;
  }
  .recommended-products h2 {
    font-size: 14px;
    font-weight: 500;
  }
  .recommended-products-cards {
    gap: 16px;
  }
}

@media (max-width: 515px) {
  .shopping-cart {
    width: 90%;
  }
  .shopping-cart {
    padding: 18px 10px 23px 13px;
  }
}

@media (max-width: 475px) {
  .shopping-cart {
    width: 100%;
  }
}

.cart-slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.cart-slide-enter-active {
  transition:
    transform 0.4s ease,
    opacity 0.3s ease;
}

.cart-slide-enter-to {
  transform: translateX(0%);
  opacity: 1;
}

.cart-slide-leave-from {
  transform: translateX(0%);
  opacity: 1;
}

.cart-slide-leave-active {
  transition:
    transform 0.4s ease,
    opacity 0.3s ease;
}

.cart-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
