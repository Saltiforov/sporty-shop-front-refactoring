import { loginSchema, registerSchema } from '~/validators/fields';
import { toTypedSchema } from '@vee-validate/zod';
import type { FieldType, IFieldBase } from '~/types/form';
import { FormFieldsGroup } from '~/types/form';

export function useFields(t: (k: string) => string = (s) => s) {
  const fieldsMap: Record<FieldType, IFieldBase> = {
    username: {
      id: 1,
      code: 'username',
      fieldComponent: 'VInputText',
      props: { type: 'text', required: true, placeholder: t('auth_username'), label: 'auth_username'},
    },
    password: {
      id: 2,
      code: 'password',
      fieldComponent: 'VPassword',
      props: { toggleMask: true, feedback: false, required: true, placeholder: t('auth_password'), label: 'auth_password' },
      messages: [
        { errorType: 'minimum' },
        { errorType: 'maximum' },
        { errorType: 'uppercase', severity: 'warn' },
        { errorType: 'lowercase', severity: 'warn' },
        { errorType: 'number', severity: 'secondary' },
      ],
    },
    firstName: {
      id: 3,
      code: 'firstName',
      fieldComponent: 'VInputText',
      props: { type: 'text', required: true, placeholder: t('auth_first_name'), label: 'auth_first_name' },
    },
    lastName: {
      id: 4,
      code: 'lastName',
      fieldComponent: 'VInputText',
      props: { type: 'text', required: true, placeholder: t('auth_last_name'), label: 'auth_last_name'},
    },
    phone: {
      id: 5,
      code: 'phone',
      fieldComponent: 'VInputText',
      props: {
        type: 'tel',
        required: true,
        placeholder: t('auth_phone_number'),
        label: 'auth_phone_number',
        onKeydown: (e: KeyboardEvent) => {
          const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', '+', '-', '(', ')', ' '];
          if (!allowed.includes(e.key) && !e.key.match(/[0-9]/)) e.preventDefault();
        },
      },
    },
    email: {
      id: 6,
      code: 'email',
      fieldComponent: 'VInputText',
      props: { type: 'text', required: true, placeholder: t('auth_email'), label: 'auth_email' },
    },
  };

  const formsMap = {
    [FormFieldsGroup.LOGIN]: {
      fields: getFieldsArray(['username', 'password']),
      schema: toTypedSchema(loginSchema),
    },
    [FormFieldsGroup.REGISTER]: {
      fields: getFieldsArray([
        'username',
        'firstName',
        'lastName',
        'phone',
        'email',
        'password',
      ]),
      schema: toTypedSchema(registerSchema),
    },
  };

  function getFormConfig(source: FormFieldsGroup) {
    return formsMap[source];
  }

  function getFieldsArray(keys: string[]) {
    return keys.map((k) => fieldsMap[k]).filter(Boolean);
  }

  function getFields(keys) {
    return keys.reduce((acc, k) => {
      acc[k] = fieldsMap[k];
      return acc;
    }, {});
  }

  return { fieldsMap, getFields, getFieldsArray, getFormConfig };
}
