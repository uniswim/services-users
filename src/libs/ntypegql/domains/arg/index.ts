import { argRegistry } from './registry';
export { compileFieldArgs } from './compiler';
import { ArgOptions, defaultArgOptions } from './options';

export function Arg(options: ArgOptions = {}): ParameterDecorator {
  return (target: Object, fieldName: any, argIndex: number) => {
    const compiledOptions = {
      ...defaultArgOptions,
      ...options,
    }
    argRegistry.set(target.constructor, [fieldName, argIndex], compiledOptions);
  };
}
