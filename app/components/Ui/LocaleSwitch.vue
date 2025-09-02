<template>
  <div class="flex locale-switch items-center">
    <VSelect
      v-model="selectedLanguage"
      :pt="{
        root: { class: 'locale-select-root' },
        label: { class: 'locale-select-label' },
        dropdown: { class: 'locale-select-dropdown' },
      }"
      class="w-full"
      option-label="name"
      :options="languages"
      @change="switchLocale"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWindowWidthWatcher } from '~/composables/useWindowWidthWatcher.js';

const { locales, locale, setLocale, defaultLocale } = useI18n();

const getWidth = useWindowWidthWatcher();

const windowWidth = computed(() => getWidth());

const storedLocale = computed(
  () => locale.value || localStorage.getItem('locale'),
);

const languages = computed(() =>
  locales.value.map((lang) => ({
    name: lang.name,
    code: lang.code,
  })),
);

const defaultLanguage = computed(() =>
  languages.value.find((l) => l.code === defaultLocale),
);

const selectedLanguage = ref(
  languages.value.find((l) => l.code === storedLocale.value) ||
    defaultLanguage.value,
);

const switchLocale = () => {
  if (!selectedLanguage.value) return;

  localStorage.setItem('locale', selectedLanguage.value.code);
  setLocale(selectedLanguage.value.code);
};
</script>

<style>
.locale-select-root {
  background-color: transparent !important;
  border: none !important;
  width: auto !important;
}

.locale-select-label {
  color: var(--color-gray-pale-lavender) !important;
  text-align: end !important;
  line-height: 22px !important;
  font-weight: 600 !important;
  font-size: 20px !important;
}

@media (max-width: 500px) {
  .locale-select-label {
    font-size: 12px !important;
  }
  .locale-switch {
  }
}

.locale-select-dropdown {
  width: 1.25rem !important;
}
</style>
