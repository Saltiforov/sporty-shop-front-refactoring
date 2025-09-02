import type { z } from 'zod/index';

export enum FormFieldsGroup {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
}

export enum FieldType {
  USERNAME = 'username',
  PASSWORD = 'password',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  PHONE = 'phone',
  EMAIL = 'email',
}


export interface IFormConfigField {
  component: string;
  code: string;
  type: string;
  placeholder: string;
  value: string;
  resolver: (v) => unknown;
  errors: unknown;
}

export interface IFormConfig {
  fields: [],
  name: string;
}

export interface IFieldBase {
  id?: number
  i18nKey?: string
  code?: string
  defaultValue?: unknown
  fieldComponent?:  string
  props?: Record<string, any>
  schema?: z.ZodTypeAny
  messages?: any
  render?: (ctx: { modelValue: any; 'onUpdate:modelValue': (v: any) => void }) => any
}


