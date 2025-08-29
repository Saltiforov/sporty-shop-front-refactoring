<template>
  <VForm v-slot="$form" :initial-values="initialValues" :resolver="resolver" class="flex flex-col gap-4 w-full sm:w-56" @submit="$emit('submit', $event)">
    <slot v-bind="$form">
      <template v-for="({ groupId, label, messages, ...rest }, name) in fields" :key="name">
        <DynamicFormField :group-id="groupId" :name="name">
          <DynamicFormLabel>{{ label }}</DynamicFormLabel>
          <DynamicFormControl v-bind="rest" />
          <DynamicFormMessage v-for="(message, index) in messages || [{}]" :key="index" v-bind="message" />
        </DynamicFormField>
      </template>
      <DynamicFormSubmit />
    </slot>
  </VForm>
</template>

<script setup>
import { ref, computed, provide } from 'vue';
import { isNotEmpty } from '@primeuix/utils';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

const props = defineProps({
  fields: Object
});

const emit = defineEmits(['submit']);

const defaultValues = ref({});
const schemas = ref({});

const resolver = computed(() => (isNotEmpty(schemas.value) ? zodResolver(z.object(schemas.value)) : undefined));
const initialValues = computed(() => defaultValues.value);

const addField = (name, schema, defaultValue) => {
  schema && (schemas.value[name] = schema);
  defaultValues.value[name] = defaultValue;
};

provide('$fcDynamicForm', {
  addField
});
</script>
