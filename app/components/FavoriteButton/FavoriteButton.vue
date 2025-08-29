<template>
  <VButton
    :pt="{
      root: {
        style: {
          backgroundColor: 'transparent',
          border: 'none',
          padding: '0',
        },
      },
    }"
    @click="updateFavoriteStatus"
  >
    <svg
      :style="{ fill: isFavorite ? '#B3261E' : '' }"
      :width="26"
      :height="23"
      viewBox="0 0 26 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.6497 3.3164C24.7119 5.37858 24.7909 8.69688 22.8291 10.8548L12.9993 21.6667L3.17083 10.8548C1.20906 8.69685 1.28806 5.37851 3.35025 3.31632C5.65281 1.01376 9.44496 1.22417 11.4792 3.76692L13 5.66725L14.5195 3.7667C16.5537 1.22395 20.3472 1.01384 22.6497 3.3164Z"
        stroke="#7F7F7F"
        stroke-opacity="0.5"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="mix-blend-mode: luminosity"
      />
      <path
        d="M22.6497 3.3164C24.7119 5.37858 24.7909 8.69688 22.8291 10.8548L12.9993 21.6667L3.17083 10.8548C1.20906 8.69685 1.28806 5.37851 3.35025 3.31632C5.65281 1.01376 9.44496 1.22417 11.4792 3.76692L13 5.66725L14.5195 3.7667C16.5537 1.22395 20.3472 1.01384 22.6497 3.3164Z"
        :style="{ stroke: strokeColor }"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="mix-blend-mode: overlay"
      />
    </svg>
  </VButton>
</template>

<script setup lang="ts">
import {
  addProductToFavorites,
  deleteProductFromFavorites,
} from '~/services/api/favorites';
import type { IProduct } from '#shared/types/product';

const { product } = defineProps<{ product: IProduct }>()
const { $basicApi } = useNuxtApp()
const emit = defineEmits(['change'])

const updateFavoriteStatus = async () => {
  const productId = product.value._id

  if (product.value.isFavorite) {
    await deleteProductFromFavorites($basicApi, productId)
    emit('change', { productId, isFavorite: false })
  } else {
    await addProductToFavorites($basicApi, productId)
    emit('change', { productId, isFavorite: true })
  }
}

const strokeColor = computed(() =>
  product.value.isFavorite ? '#B3261E' : 'gray'
)
</script>

<style scoped>
.favorite-button {
  background: transparent;
  border: none;
  padding: 0;
}
.favorite-button:hover {
  background: transparent;
  border: none;
}
</style>
