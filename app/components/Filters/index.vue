<template>
  <VTree
    v-if="isLoaded"
    :pt="{
      nodeChildren: {
        style: {
          display: 'none',
        },
      },
      root: {
        style: mobileRootStyles,
      },
      nodeContent: {
        style: mobileNodeContentStyles,
      },
      nodeToggleButton: {
        style: {
          display: 'none',
        },
      },
    }"
    :value="nodes"
    :expanded-keys="expandedKeys"
    class="w-full p-7 pb-[2px] filters-component"
    :toggler-icon="null"
    @update:expanded-keys="onExpandedKeysChange"
  >
    <template #togglericon />
    <template #default="slotProps">
      <div
        v-if="isRootNode(slotProps.node)"
        :class="[
          'flex items-center justify-start gap-2 ',
          shouldShowDivider(slotProps.node) ? 'pb-3' : '',
          isRootNode(slotProps.node) && expandedKeys[slotProps.node.key]
            ? 'w-[50%] mx-auto'
            : '',
        ]"
        :style="[isRootNode(slotProps.node) ? 'width: 278px;' : '']"
      >
        <img :src="slotProps.node.icon || defaultFilterImage" alt="icon" class="w-5 h-5" >

        <b
          class="cursor-pointer filters-block-text"
          @click.stop="onNodeCheckboxChange(slotProps.node)"
        >
          {{ slotProps.node.label }}
        </b>

        <button
          v-if="slotProps.node && slotProps.node.children.length"
          class="ml-auto p-1 rounded transition"
          @click.stop="toggle(slotProps.node)"
        >
          <svg
            :class="{
              'rotate-90': expandedKeys[slotProps.node.key],
              'rotate-0': !expandedKeys[slotProps.node.key],
            }"
            class="w-4 h-4 transform transition-transform"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M8 5L15 12L8 19" stroke="currentColor" stroke-width="2" />
          </svg>
        </button>
      </div>
      <div
        v-if="slotProps && slotProps?.node && shouldShowDivider(slotProps.node)"
        class="mb-[9px]"
        :class="[
          'border-b border-[var(--color-muted-gray)]',
          isRootNode(slotProps.node) && expandedKeys[slotProps.node.key]
            ? 'w-[50%] mx-auto'
            : '',
        ]"
      />
      <transition
        v-if="slotProps.node"
        name="expand"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        @before-leave="beforeLeave"
        @leave="leave"
        @after-leave="afterLeave"
      >
        <div
          v-show="slotProps.node.children && expandedKeys[slotProps.node.key]"
          :class="['mt-2 overflow-hidden', !mobileVersion ? 'pl-4' : '']"
        >
          <div
            v-for="(child, idx) in slotProps.node.children"
            :key="child.key"
            class="node-child flex items-center"
            :style="{
              marginBottom:
                slotProps.node.children.length > 1 &&
                idx === slotProps.node.children.length - 1
                  ? '0px'
                  : '12px',
            }"
          >
            <UiCustomCheckbox
              :model-value="selectedFilters.has(child.slug)"
              :unchecked-border-color="'var(--small-title-color)'"
              :border-radius="'2px'"
              @update:model-value="(val) => updateFilterSelection(child, val)"
              @click.stop
            />
            <span class="filters-block-text-child text-sm">{{
              child.label
            }}</span>
          </div>

          <div
            v-if="
              slotProps.node?.children &&
              slotProps.node?.children?.length > 1 &&
              expandedKeys[slotProps.node.key]
            "
            class="pt-3 mb-3 text-sm cursor-pointer filters-block-text w-[50%] mx-auto flex justify-center"
            :style="mobileSelectAllStyles"
          >
            <span
              class="text-[12px]"
              :style="{
                color: isAllItemsSelected(slotProps.node)
                  ? 'var(--small-title-color)'
                  : 'var(--color-primary-purple)',
              }"
              @click.stop="selectAllInCategory(slotProps.node)"
            >
              {{ selectAllLabel(slotProps.node) }}
            </span>
          </div>

          <div
            v-if="slotProps.node.children.length > 1 && !mobileVersion"
            class="mb-[8px]"
            :class="[
              'border-b border-[var(--color-muted-gray)]',
              isRootNode(slotProps.node) && expandedKeys[slotProps.node.key]
                ? 'w-full'
                : '',
            ]"
          />
        </div>
      </transition>
    </template>
  </VTree>

  <UiRange class="filters-block-text" :is-mobile-version="mobileVersion" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWindowWidthWatcher } from '~/composables/useWindowWidthWatcher.ts';
import { getAllFilters } from '~/services/api/filters/index.js';
import defaultFilterImage from '~/assets/icons/injections-icon.svg';
import { useFilterQuery } from '~/composables/useFilterQuery.js';

const getWidth = useWindowWidthWatcher();

const mobileVersion = computed(() => getWidth() <= 1024);
const mobileNodeContentStyles = computed(() => {
  return mobileVersion.value
    ? {
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: '8px',
        marginBottom: '24px',
      }
    : {};
});
const mobileRootStyles = computed(() => {
  return mobileVersion.value
    ? {
        backgroundColor: 'var(--color-primary-lavender)',
      }
    : {};
});
const mobileSelectAllStyles = computed(() => {
  return mobileVersion.value
    ? {
        backgroundColor: 'var(--color-primary-lavender)',
        padding: '5px 6.5px',
        borderRadius: 'var(--default-rounded)',
        marginTop: '14px',
        marginBottom: '2px',
        maxWidth: '80px',
      }
    : {};
});
const beforeEnter = (el) => {
  el.style.height = '0';
};
const enter = (el) => {
  el.style.height = el.scrollHeight + 'px';
};
const afterEnter = (el) => {
  el.style.height = 'auto';
};
const beforeLeave = (el) => {
  el.style.height = el.scrollHeight + 'px';
};
const leave = (el) => {
  el.style.height = '0';
};
const afterLeave = (el) => {
  el.style.height = 'auto';
};
const { t, locale } = useI18n();

const { add, remove, selectedFilters } = useFilterQuery();

const selectAllLabel = (node) => {
  return isAllItemsSelected(node) ? 'Deselect all' : 'Select all';
};

const isAllItemsSelected = (node) => {
  return node.children?.length ? node.children.every(child => selectedFilters.value.has(child.slug)) : false;
};

const shouldShowDivider = (node) => {
  const isRoot = isRootNode(node);
  const isExpanded = expandedKeys.value[node.key];
  return mobileVersion.value ? isRoot && isExpanded : isRoot;
};


const nodes = ref([]);
const expandedKeys = ref({ 0: true });
const isLoaded = computed(() => nodes.value.length > 0);
const isRootNode = (node) => !node.key.includes('-') && node.children.length > 0;

const toggle = (node) => {
  expandedKeys.value[node.key] = !expandedKeys.value[node.key];
};

const collectAllSlugs = (node) => {
  const slugs = [node.slug];
  if (Array.isArray(node.children) && node.children.length) {
    node.children.forEach((child) => {
      slugs.push(...collectAllSlugs(child));
    });
  }
  return slugs;
};

const findNodeBySlug = (nodes, targetSlug) => {
  for (const node of nodes) {
    if (node.slug === targetSlug) return node;
    if (Array.isArray(node.children) && node.children.length) {
      const found = findNodeBySlug(node.children, targetSlug);
      if (found) return found;
    }
  }
  return null;
};

function findParentBySlug(nodes, childSlug) {
  for (const node of nodes) {
    // Проверяем, есть ли у этого узла дети
    if (node.children && node.children.length) {
      // Если среди детей есть нужный slug — возвращаем родителя
      const hasChild = node.children.some(child => child.slug === childSlug);
      if (hasChild) return node;

      // Иначе ищем глубже (рекурсивно)
      const found = findParentBySlug(node.children, childSlug);
      if (found) return found;
    }
  }
  return null;
}


const expandParentNodes = (nodeKey) => {
  const keys = nodeKey.split('-');
  keys.forEach((_, index) => {
    const partialKey = keys.slice(0, index + 1).join('-');
    if (partialKey) {
      expandedKeys.value[partialKey] = true;
    }
  });
};

const updateFilterSelection = (node, isChecked) => {
  const facetNode = findParentBySlug(nodes.value, node.slug);
  const payload = {
    facetNode: facetNode,
    value: node.slug,
  };

  if (isChecked) {
    add('filters', payload);
  } else {
    remove('filters', payload);
  }
};

const selectAllInCategory = (node) => {
  const childrenSlugs = node.children.map(child => child.slug);
  const payload = {
    facetNode: node,
    value: childrenSlugs,
  };

  if (node.children.length && !isAllItemsSelected(node)) {
    add('filters', payload);
  } else {
    remove('filters', payload);
  }
};

const mapNodes = (inputArray) => {
  const mapNode = (item, idx, parentKey = '') => {
    const key = parentKey ? `${parentKey}-${idx}` : `${idx}`;
    return {
      key,
      id: item._id,
      modelValue: false,
      label: t(item.name[locale.value]),
      slug: item.slug[locale.value],
      icon: item.icon || '',
      children:
        item.children && item.children.length
          ? item.children.map((child, childIdx) =>
              mapNode(child, childIdx, key),
            )
          : [],
    };
  };
  return inputArray.map((item, idx) => mapNode(item, idx));
};

const onExpandedKeysChange = (newExpandedKeys) => {
  expandedKeys.value = newExpandedKeys;
};

onMounted(async () => {
  const { $basicApi } = useNuxtApp();
  const response = await getAllFilters($basicApi);
  console.log('response', response.list);
  nodes.value = mapNodes(response.list);
});

</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  height: 0;
  overflow: hidden;
}

.filters-block-text-child {
  font-weight: 300;
  font-size: 18px;
}
.filters-component {
  border-radius: var(--default-rounded);
}

@media (max-width: 680px) {
  .filters-component {
    border-radius: 0;
  }
}
</style>
