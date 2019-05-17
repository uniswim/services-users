import {
  registerFieldAfterHook,
  registerFieldBeforeHook,
  HookExecutor,
} from './registry';

export {
  fieldAfterHooksRegistry,
  fieldBeforeHooksRegistry,
  HookExecutor,
} from './registry';
export { HookError } from './error';

export function Before(hook: HookExecutor): PropertyDecorator {
  return (targetInstance: Object, fieldName) => {
    registerFieldBeforeHook(targetInstance.constructor, fieldName as string, hook);
  };
}

export function After(hook: HookExecutor): PropertyDecorator {
  return (targetInstance: Object, fieldName) => {
    registerFieldAfterHook(targetInstance.constructor, fieldName as string, hook);
  };
}
