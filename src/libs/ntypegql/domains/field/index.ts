import { fieldsRegistry, FieldInnerConfig } from './registry';

export {
  FieldInnerConfig,
  fieldsRegistry,
  queryFieldsRegistry,
} from './registry';
export { compileAllFields, compileFieldConfig } from './compiler';
export { FieldError } from './error';

export interface FieldOptions {
  description?: string;
  type?: any;
  name?: string;
  isNullable?: boolean;
}

export function Field(options?: FieldOptions): PropertyDecorator {
  return (targetInstance: Object, fieldName: any) => {
    const finalConfig: FieldInnerConfig = {
      property: fieldName,
      name: fieldName,
      isNullable: true,
      ...options,
    };

    fieldsRegistry.set(targetInstance.constructor, fieldName, {
      ...finalConfig,
    });
  };
}
