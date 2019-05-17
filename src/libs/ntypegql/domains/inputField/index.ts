import { inputFieldsRegistry, FieldInputInnerConfig } from './registry';

export { FieldInputInnerConfig, inputFieldsRegistry } from './registry';
export { compileAllInputFields, compileInputFieldConfig } from './compiler';
export { InputFieldError } from './error';

export interface InputFieldOptions {
  description?: string;
  defaultValue?: any;
  type?: any;
  name?: string;
  isNullable?: boolean;
}

export function InputField(options?: InputFieldOptions): PropertyDecorator {
  return (targetInstance: Object, fieldName) => {
    const finalConfig: FieldInputInnerConfig = {
      property: fieldName as string,
      name: fieldName as string,
      ...options,
    };

    inputFieldsRegistry.set(targetInstance.constructor, fieldName as string, finalConfig);
  };
}
