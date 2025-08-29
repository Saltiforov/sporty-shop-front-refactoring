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
