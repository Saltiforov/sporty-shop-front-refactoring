<template>
  <ul :class="parentClasses" class="links">
    <li
        v-for="item in links"
        :key="item.label"
        :class="[linkClass, isActive(item.page) && 'router-link-active']"
        class="link"
    >
      <NuxtLink class="cursor-pointer" @click="navigateTo(item.page)">
        <p :style="labelStyle" :class="labelClass">
          {{ item.label }}
        </p>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  links: {
    type: Array,
    required: true,
    default: () => [],
  },
  parentClasses: {
    type: [Array, String],
    required: false,
  },
  linkClass: {
    type: [Array, String],
    required: false,
  },
  labelClass: {
    type: [Array, String],
    required: false,
  },
  labelStyle: {
    type: [Array, String],
    required: false,
  },
});

const emit = defineEmits(['handle-navigation']);

const { locale } = useI18n();
const router = useRouter();
const route = useRoute();

function navigateTo(targetPath) {
  const pathTo = `/${locale.value}${targetPath}`;
  if (route.path === pathTo) return;
  router.push(targetPath);
}

function isActive(page) {
  const fullPath = `/${locale.value}${page}`;
  return route.path === fullPath;
}

const parentClasses = computed(() => {
  return Array.isArray(props.parentClasses) ? props.parentClasses.join(' ') : props.parentClasses;
});

const linkClass = computed(() => {
  return Array.isArray(props.linkClass) ? props.linkClass.join(' ') : props.linkClass;
});

const labelClass = computed(() => {
  return Array.isArray(props.labelClass) ? props.labelClass.join(' ') : props.labelClass;
});

const labelStyle = computed(() => {
  return Array.isArray(props.labelStyle) ? props.labelStyle.join(' ') : props.labelStyle;
});
</script>

<style scoped>
.router-link-active {
  color: var(--color-muted-light-gray);
}
</style>
