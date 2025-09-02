<template>
  <div class="flex currency-switch items-center">
    <VSelect
        v-model="selectedCurrency"
        :pt="{
        root: { class: 'currency-select-root' },
        label: { class: 'currency-select-label' },
        dropdown: { class: 'currency-select-dropdown' }
      }"
        class="w-full"
        option-label="label"
        :options="currencyOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCurrencyStore } from '~~/stores/useCurrency';

const currencyStore = useCurrencyStore();
const { setCurrency } = currencyStore;
const { currency } = storeToRefs(currencyStore);

const currencyOptions = [
  { label: 'Ukraine', code: 'UAH', value: Currencies.UAH },
  { label: 'Europe', code: 'EUR', value: Currencies.EUR },
];
console.log('currency', currency.value);

const selectedCurrency = ref(currencyOptions.find(currncyOption => currency.value === currncyOption.value));

watch(selectedCurrency, (newVal) => {
  setCurrency(newVal);
});
</script>

<style>
.currency-select-root {
  background-color: transparent !important;
  border: none !important;
}

.currency-select-label {
  color: var(--color-gray-pale-lavender) !important;
  text-align: end !important;
  line-height: 22px !important;
  font-weight: 600 !important;
  font-size: 20px !important;
}

@media (max-width: 500px) {
  .currency-select-label {
    font-size: 16px !important;
  }
}

.currency-select-dropdown {
  width: 1.25rem !important;
}
</style>
