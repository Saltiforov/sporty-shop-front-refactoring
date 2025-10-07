<template>
  <div
    :class="[
      'price-range-filter p-[8px_36px] pb-[36px]',
      isMobileVersion ? 'bg-[var(--color-primary-lavender)]' : '',
    ]"
  >
    <div
      :class="[
        isMobileVersion
          ? 'bg-[var(--color-primary-pure-white)] px-[8px] py-[10px] rounded-[var(--default-rounded)]'
          : '',
      ]"
    >
      <div class="range-title mb-[9px]">
        {{ t('price_range_title', { currency }) }}
      </div>
      <div class="range-fields-wrapper flex flex-col gap-[29px]">
        <div class="range-fields w-full flex justify-between items-center">
          <div class="flex items-center gap-2">
            <VInputNumber
              v-model="minPrice"
              :min="0"
              :max="maxLimit"
              :use-grouping="false"
              class="max-w-[80px] w-full input-no-padding"
              :input-style="{
                padding: '0 10px',
                textAlign: 'center',
                maxWidth: '80px',
              }"
            />
            <div class="w-6 h-px bg-[var(--color-gray-dark-charcoal)]" />
            <VInputNumber
              v-model="maxPrice"
              :min="10"
              :max="maxLimit"
              :use-grouping="false"
              class="max-w-[80px] w-full input-no-padding"
              :input-style="{
                padding: '0 10px',
                textAlign: 'center',
                maxWidth: '80px',
              }"
            />
          </div>
          <div>
            <VButton
              :pt="{ root: { class: 'range-button w-[100px] max-w-[68px]' } }"
              :label="t('price_range_ok_button')"
            />
          </div>
        </div>
        <div
          class="range-slider w-full px-4"
          :class="{ 'mb-2': isMobileVersion }"
        >
          <VSlider
            v-model="priceRange"
            :pt="{
              root: {
                class: 'h-[1px]',
                style: sliderStyles,
              },
              range: {
                style: sliderRangeStyles,
              },
            }"
            range
            :min="0"
            :max="maxLimit"
            class="w-full"
            @update:model-value="onPriceRangeInput"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCurrencyStore } from '~~/stores/useCurrency.js';
import { storeToRefs } from 'pinia';
import { useFilterQuery } from '~/composables/useFilterQuery';
import { debounce } from '~/utils';
import { useDebounceFn } from '~/composables/useDebounceFn';

const props = defineProps({
  isMobileVersion: Boolean,
});

const { t } = useI18n();

const { currency, isUahActiveCurrency } = storeToRefs(useCurrencyStore());
const { replace, minPrice, maxPrice } = useFilterQuery();

const maxLimit = computed(() => {
  return isUahActiveCurrency.value ? 10000 : 1000;
});

const priceRange = ref([minPrice.value, maxPrice.value]);

const sliderRangeStyles = computed(() => {
  return {
    backgroundColor: 'var(--color-primary-purple)',
    height: '2px',
  };
});

const sliderStyles = computed(() => {
  const size = props.isMobileVersion ? '20px' : '12px';

  return {
    '--p-slider-handle-width': size,
    '--p-slider-handle-height': size,
    '--p-slider-handle-content-width': size,
    '--p-slider-handle-content-height': size,
    '--p-slider-handle-background': 'var(--color-primary-purple)',
    '--p-slider-handle-content-background': 'var(--color-primary-purple)',
    '--p-slider-handle-content-hover-background': 'var(--color-primary-purple)',
    '--p-slider-range-background': 'var(--color-primary-purple)',
    '--p-slider-handle-focus-ring-shadow': 'none',
    '--p-slider-handle-focus-ring-width': '0',
  };
});

const { debounced: applyPriceDebounced } = useDebounceFn(
  (min: number, max: number) => {
    replace('price', { min, max });
  },
  300,
);

function onPriceRangeInput() {
  const [min, max] = priceRange.value;
  if (Number.isFinite(min) && Number.isFinite(max)) {
    applyPriceDebounced(min, max);
  }
}

watch(
  () => currency.value,
  () => {
      replace('price', null);
  },
);
</script>

<style scoped>
.range-field {
  background: black;
}

.custom-slider-handle::before {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: white;
  border-radius: 9999px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.range-button {
  font-size: 18px;
  line-height: 22px;
  font-weight: 500;
  padding: 0px 22px;
  background-color: var(--color-primary-purple);
  border: none;
}

.range-button:hover {
  padding: 0px 22px;
  background-color: var(--color-primary-purple);
  border: none;
}

@media (max-width: 1024px) {
  .price-range-filter {
    padding: 0 24px;
  }
}
</style>
