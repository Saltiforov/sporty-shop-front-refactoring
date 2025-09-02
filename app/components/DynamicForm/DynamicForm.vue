<template>
  <Form
    id="dynamicForm"
    :validation-schema="config.schema"
    :initial-values="initialValues"
    @submit="onSubmit"
  >
    <Field
      v-for="f in config.fields"
      :key="f.id"
      v-slot="{ field, errorMessage }"
      :name="f.code"
      class="mb-4"
    >
      <component
        :is="f.fieldComponent"
        v-bind="{ ...f.props, ...field }"
        class="w-full mb-8"
        @update:model-value="field.onChange"
        @blur="field.onBlur"
      />
      <span class="p-error">{{ errorMessage }}</span>
    </Field>
  </Form>
</template>

<script setup lang="ts">
import { Field, Form } from 'vee-validate';
const emit = defineEmits(['submit']);

const props = defineProps<{ config: any; entity?: any }>();
const { config, entity } = toRefs(props);

const initialValues = computed(() => ({
  ...defaultsFromConfig(config.value),
  ...entityValues.value,
}));

const entityValues = computed(() => entity.value ? entity.value : {});

const defaultsFromConfig = (config: any) => {
  return Object.fromEntries(
    config.fields.map((f: any) => [f.code, f.defaultValue ?? '']),
  );
};

const onSubmit = (values: FormData) => {
  emit('submit', values);
};
</script>

<style scoped></style>
