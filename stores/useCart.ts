import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useToastManager } from '~/composables/toastManager';
import { getCartProducts } from '~/services/api/cart';

export const useCartStore = defineStore('cart', () => {
  const cartEntries = useCookie('cartEntries', {
    default: () => [],
  });
  const cartProducts = ref([]);
  const initialized = ref(false);

  const { showProductAddedToast } = useToastManager();

  const cartCount = computed(() => cartProducts.value.length);

  const cartTotalPrice = computed(() =>
    cartProducts.value.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    ),
  );

  const saveEntriesToCookies = (entry) => {
    const existingIndex = cartEntries.value.findIndex(e => e._id === entry._id);

    if (existingIndex !== -1) {
      const updated = [...cartEntries.value];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + entry.quantity,
      };
      cartEntries.value = updated;
    } else {
      cartEntries.value = [...cartEntries.value, entry];
    }

  };

  const addToCart = (product) => {
    const cartEntry = {
      _id: product._id || product.id,
      quantity: product.quantity || 1,
    };


    const existingProduct = cartProducts.value.find(
      (item) => item._id === product._id,
    );

    const incomingQuantity = product.quantity || 1;

    if (!existingProduct) {
      cartProducts.value.push({ ...product, quantity: incomingQuantity });
    } else {
      existingProduct.quantity += incomingQuantity;
    }

    showProductAddedToast(product);
    saveEntriesToCookies(cartEntry);
  };

  function removeFromCart(productId) {
    cartProducts.value = cartProducts.value.filter((product) => product._id !== productId);
  }

  const clearCart = () => {
    cartProducts.value = [];
  };

  const cartEntryIds = computed(() => cartEntries.value.map(e => e._id));

  async function init() {
    if (initialized.value) return;


    if (cartEntries.value.length) {
      const { $basicApi } = useNuxtApp();
      const res = await getCartProducts($basicApi, cartEntryIds.value);
      cartProducts.value = res.list;
    }

    initialized.value = true;
  }

  init();

  return {
    cartProducts,
    cartCount,
    cartTotalPrice,
    addToCart,
    removeFromCart,
    clearCart,
  };
});
