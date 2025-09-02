import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useCookie } from '#app';

export const useCartStore = defineStore('cart', () => {
  const cartProducts = useCookie('cartProducts', {
    default: () => [],
  });
  const isOpen = ref(false);
  const { showProductAddedToast } = useToastManager();

  const close = () => {
    isOpen.value = false;
  };

  const open = () => {
    isOpen.value = true;
  };

  const cartCount = computed(() => {
    return cartProducts.value.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
  });

  const cartTotalPrice = computed(() =>
    cartProducts.value.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    ),
  );

  const addToCart = (product) => {
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
  };

  function removeFromCart(productId) {
    cartProducts.value = cartProducts.value.filter((product) => product._id !== productId);
  }

  const clearCart = () => {
    cartProducts.value = [];
  };

  return {
    cartProducts,
    cartCount,
    cartTotalPrice,
    addToCart,
    removeFromCart,
    clearCart,
    isOpen,
    close,
    open,
  };
});
