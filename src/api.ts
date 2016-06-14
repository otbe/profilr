import { state, processEvent } from './state';
import { isFunction, isPromise } from './utils';

export const UNSUPPORTED_CALL_SIGNATURE_ERROR = 'Unsupported call signature. Please check API docs.';
export const TARGET_MUST_BE_A_FUNCTION = 'Only class methods can be decorated.';

export interface ProfileOptions {
  custom: any;
}

// function wrapper
export function profile<T extends Function> (fn: T, label: string, options: ProfileOptions): T;
export function profile<T extends Function> (fn: T, options: ProfileOptions): T;
export function profile<T extends Function> (fn: T, label: string): T;
export function profile<T extends Function> (fn: T): T;

// class method decorator
export function profile (label: string, options: ProfileOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export function profile (options: ProfileOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export function profile (label: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export function profile (): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;

export function profile (arg1?: any, arg2?: any, arg3?: any): any {
  switch (arguments.length) {
    case 0:
      return makeDecorator(null);
    case 1:
      if (typeof arg1 === 'function') {
        return executeWrapped(arg1, null);
      } else if (typeof arg1 === 'string') {
        return makeDecorator(arg1);
      } else if (typeof arg1 === 'object') {
        return makeDecorator(null, arg1);
      }

      throw new Error(UNSUPPORTED_CALL_SIGNATURE_ERROR);
    case 2:
      if (typeof arg1 === 'string') {
        if (typeof arg2 === 'object') {
          return makeDecorator(arg1, arg2);
        }
      } else if (typeof arg1 === 'function') {
        if (typeof arg2 === 'string') {
          return executeWrapped(arg1, arg2, null);
        } else if (typeof arg2 === 'object') {
          return executeWrapped(arg1, null, arg2);
        }
      }

      throw new Error(UNSUPPORTED_CALL_SIGNATURE_ERROR);
    case 3:
      if (typeof arg1 === 'function' && typeof arg2 === 'string' && typeof arg3 === 'object') {
        return executeWrapped(arg1, arg2, arg3);
      }

      throw new Error(UNSUPPORTED_CALL_SIGNATURE_ERROR);
    default:
      throw new Error(UNSUPPORTED_CALL_SIGNATURE_ERROR);
  }
}

function makeDecorator (label: string, options?: ProfileOptions) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    let fn = target[ propertyKey ];

    if (!isFunction(fn)) {
      throw new Error(TARGET_MUST_BE_A_FUNCTION);
    }

    return {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      get: function getter () {
        if (!state.enabled) {
          return fn;
        }

        return function() {
          return measure(label || propertyKey, fn, this, arguments, options);
        }
      }
    };
  }
}

function executeWrapped<T extends Function> (fn: T, label: string, options?: ProfileOptions) {
  return function() {
    if (!state.enabled) {
      return fn.apply(this, arguments);
    }

    return measure(label || fn.name || 'anonymous function', fn, this, arguments, options);
  }
}

function measure (key: string, fn: Function, context: Object, args: IArguments, options: ProfileOptions): any {
  const start = new Date().getTime();
  const result = fn.apply(context, args);

  if (result != null && isPromise(result)) {
    result.then((res: any) => {
      processEvent({
        label: key,
        duration: new Date().getTime() - start,
        result: res,
        options
      });
      return res;
    });
  } else {
    processEvent({
      label: key,
      duration: new Date().getTime() - start,
      result: result,
      options
    });
  }

  return result;
}

