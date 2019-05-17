import { Field, FieldOptions, compileFieldConfig } from '../../domains/field';
import {
  queryFieldsRegistry,
  mutationFieldsRegistry,
  schemaRootsRegistry,
} from './registry';
import { SchemaFieldError } from './error';

function validateRootSchemaField(targetInstance: Object, fieldName: string) {
  if (
    !(targetInstance as any)[fieldName] &&
    !targetInstance.constructor.prototype[fieldName]
  ) {
    throw new SchemaFieldError(
      targetInstance.constructor,
      fieldName,
      `Every root schema field must regular class function`,
    );
  }
}

function requireSchemaRoot(target: Function, fieldName: string) {
  if (schemaRootsRegistry.has(target)) {
    return;
  }
  throw new SchemaFieldError(
    target,
    fieldName,
    `Root field must be registered on class decorated with @Schema`,
  );
}

function getFieldCompiler(target: Function, fieldName: string) {
  const fieldCompiler = () => {
    requireSchemaRoot(target, fieldName);
    const compiledField = compileFieldConfig(
      target,
      fieldName,
    );
    return compiledField;
  };

  return fieldCompiler;
}

// special fields
export function Query(options?: FieldOptions): PropertyDecorator {
  return (targetInstance: Object, fieldName) => {
    validateRootSchemaField(targetInstance, fieldName as string);
    Field(options)(targetInstance, fieldName);
    const fieldCompiler = getFieldCompiler(targetInstance.constructor, fieldName as string);
    queryFieldsRegistry.set(
      targetInstance.constructor,
      fieldName as string,
      fieldCompiler,
    );
  };
}

export function Mutation(options?: FieldOptions): PropertyDecorator {
  return (targetInstance: Object, fieldName) => {
    validateRootSchemaField(targetInstance, fieldName as string);
    Field(options)(targetInstance, fieldName);
    const fieldCompiler = getFieldCompiler(targetInstance.constructor, fieldName as string);
    mutationFieldsRegistry.set(
      targetInstance.constructor,
      fieldName as string,
      fieldCompiler,
    );
  };
}
