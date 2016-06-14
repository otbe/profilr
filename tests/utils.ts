import expect from 'expect';
import { isFunction, isPromise } from '../src/utils';

describe('utils.ts', () => {
  describe('isFunction', () => {
    it('should let me decorate class methods', () => {
      expect(isFunction('foo')).toBeFalsy();
      expect(isFunction(5)).toBeFalsy();
      expect(isFunction({})).toBeFalsy();
      expect(isFunction([])).toBeFalsy();
      expect(isFunction(() => {})).toBeTruthy();
    });
  });

  describe('isPromise', () => {
    it('should let me decorate class methods', () => {
      expect(isPromise({})).toBeFalsy();
      expect(isPromise(() => {})).toBeFalsy();
      expect(isPromise(new Promise((resolve) => resolve()))).toBeTruthy();
    });
  });
});
