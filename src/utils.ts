export function isFunction (functionToCheck: any) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

export function isPromise (obj: any) {
  return !!obj.then && typeof obj.then === 'function';
}
