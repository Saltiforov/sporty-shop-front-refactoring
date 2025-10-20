<template>
  <ClientOnly>
    <VTree
      :pt="{
      nodeChildren: {
        style: {
          display: 'none',
        },
      },
      root: {
        class: 'bg-primary-lavender lg:bg-transparent',
      },
      nodeContent: {
        class: [
          'only-mobile:bg-primary-lavender',
          'only-mobile:py-2',
          'only-mobile:px-3',
          'only-mobile:rounded-[var(--default-rounded)]',
          'only-mobile:mt-7',
          'only-mobile:mb-1',
          'only-mobile:max-w-[80px]',
        ],
      },
      nodeToggleButton: {
        style: {
          display: 'none',
        },
      },
    }"
      :value="nodes"
      :expanded-keys="expandedKeys"
      class="w-full p-7 pb-1 filters-component"
      :toggler-icon="null"
      @update:expanded-keys="onExpandedKeysChange"
    >
      <template #togglericon />
      <template #default="slotProps">
        <div
          v-if="isRootNode(slotProps.node)"
          class="flex items-center justify-start gap-2"
          :class="{
          'pb-3': shouldShowDivider(slotProps.node),
          'w-1/2 mx-auto': expandedKeys[slotProps.node.key],
          'w-[278px]': isRootNode(slotProps.node),
        }"
        >
          <img
            :src="slotProps.node.icon || defaultFilterImage"
            alt="icon"
            class="w-5 h-5"
          >
          <b class="cursor-pointer filters-block-text">
            {{ slotProps.node.label }}
          </b>

          <button
            v-if="slotProps.node && slotProps.node.children.length"
            class="ml-auto p-1 rounded transition"
            @click.stop="toggle(slotProps.node)"
          >
            <UiIcon
              name="arrow"
              size="16"
              :class="{
              'rotate-90': expandedKeys[slotProps.node.key],
              'rotate-0': !expandedKeys[slotProps.node.key],
            }"
            />
          </button>
        </div>
        <div
          v-if="slotProps?.node && shouldShowDivider(slotProps.node)"
          class="mb-4 border-b border-[var(--color-muted-gray)]"
          :class="{
          'w-1/2 mx-auto':
            isRootNode(slotProps.node) && expandedKeys[slotProps.node.key],
        }"
        />
        <transition v-if="slotProps.node" name="expand">
          <div
            v-show="slotProps.node.children && expandedKeys[slotProps.node.key]"
            class="mt-2 overflow-hidden"
            :class="{ 'pl-4': !mobileVersion }"
          >
            <div
              v-for="(child, idx) in slotProps.node.children"
              :key="child.key"
              :class="[
              'node-child flex items-center',
              idx === slotProps.node.children.length - 1 ? 'mb-0' : 'mb-3',
            ]"
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
              v-if="isShowSelectAll(slotProps.node)"
              class="pt-3 text-sm cursor-pointer filters-block-text w-1/2 mx-auto flex justify-center"
            >
              <VButton
                class="btn-plain"
                :pt="{
                root: {
                  class:
                    'btn-plain',
                },
              }"
                :style="{
                color: isAllItemsSelected(slotProps.node)
                  ? 'var(--small-title-color)'
                  : 'var(--color-primary-purple)',
              }"
                @click.stop="selectAllInCategory(slotProps.node)"
              >
                {{ selectAllLabel(slotProps.node) }}
              </VButton>
            </div>

            <div
              v-if="slotProps.node.children.length > 1 && !mobileVersion"
              class="mb-4 mt-4 border-b border-[var(--color-muted-gray)]"
              :class="{
              'w-full':
                isRootNode(slotProps.node) && expandedKeys[slotProps.node.key],
            }"
            />
          </div>
        </transition>
      </template>
    </VTree>
    <UiRange class="filters-block-text" :is-mobile-version="mobileVersion" />
    <template #fallback>
      <aside class="filters-component min-h-[456px] bg-primary-lavender p-7">
        <h2 class="text-base font-semibold mb-3">Filters</h2>
          <section>
            <h3>Brand</h3>
            <nav>
              <a href="/en?f-brand=myprotein">MyProtein</a>
              <a href="/en?f-brand=biotechusa">BiotechUSA</a>
              <a href="/en?f-brand=optimum-nutrition">Optimum Nutrition</a>
            </nav>
          </section>

          <section>
            <h3>Category</h3>
            <nav>
              <a href="/en?f-category=proteins">Proteins</a>
              <a href="/en?f-category=amino-acids">Amino acids</a>
            </nav>
          </section>
      </aside>
    </template>
  </ClientOnly>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWindowWidthWatcher } from '~/composables/useWindowWidthWatcher.ts';
import { getAllFilters } from '~/services/api/filters/index.js';
import { useFilterQuery } from '~/composables/useFilterQuery.js';
import defaultFilterImage from '~/assets/icons/injections-icon.svg';

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
});

console.log('props FFFILLLTERS', props.filters);

const getWidth = useWindowWidthWatcher();

const mobileVersion = computed(() => getWidth() <= 1024);

const { t, locale } = useI18n();

const nodes = ref([]);

const expandedKeys = ref({ 0: true });

const { add, remove, selectedFilters, selectedFiltersState } = useFilterQuery();


const isShowSelectAll = (node) => {
  return node?.children && node?.children?.length > 1;
};

const selectAllLabel = (node) => {
  return isAllItemsSelected(node) ? 'Deselect all' : 'Select all';
};

const isAllItemsSelected = (node) => {
  return node.children?.length
    ? node.children.every((child) => selectedFilters.value.has(child.slug))
    : false;
};

const shouldShowDivider = (node) => {
  const isRoot = isRootNode(node);
  const isExpanded = expandedKeys.value[node.key];
  return mobileVersion.value ? isRoot && isExpanded : isRoot;
};

const isRootNode = (node) => !node.key.includes('-') && node.children.length > 0;

const toggle = (node) => {
  expandedKeys.value[node.key] = !expandedKeys.value[node.key];
};

function findParentBySlug(nodes, childSlug) {
  for (const node of nodes) {
    if (node.children && node.children.length) {
      const hasChild = node.children.some((child) => child.slug === childSlug);
      if (hasChild) return node;

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

  if (!facetNode) return;

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
  const childrenSlugs = node.children.map((child) => child.slug);

  if (!node) return;
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

nodes.value = props.filters && mapNodes(props.filters.list);

for (const [key, value] of selectedFiltersState.value) {
  const relatedNode = nodes.value.find((n) => key === n.slug);
  expandParentNodes(relatedNode.key);
}

</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.3s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
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
  min-height: 456px;
}

@media (max-width: 680px) {
  .filters-component {
    border-radius: 0;
  }
}
</style>
