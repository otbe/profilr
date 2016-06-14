import expect, { createSpy } from 'expect';
import { profile } from '../src/api';
import { registerEventCallback, useProfilr } from '../src/state';

const options = {
  custom: {
    myData: 'string'
  }
};

export function process(): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 0);
  });
}

class Test {
  counter = 5;



  @profile()
  simple() {
    return this.counter;
  }

  @profile(options)
  customOptions() {
    return this.counter;
  }

  @profile('other')
  named() {
    return this.counter;
  }

  @profile('other', options)
  namedAndCustomized() {
    return this.counter;
  }

  @profile()
  asyncFn() {
    return new Promise((resolve) => resolve(this.counter));
  }
}

describe('profilr@TS', () => {
  let listener: any;
  let dispose: any;

  beforeEach(() => {
    useProfilr(true);

    listener = createSpy();
    dispose = registerEventCallback(listener);
  });

  it('should let me decorate class methods', async () => {
    expect(listener).toNotHaveBeenCalled();

    const test = new Test();

    expect(test.simple()).toBe(5);

    await process();

    expect(listener).toHaveBeenCalled();
    expect(listener.calls[ 0 ].arguments[ 0 ]).toInclude({ label: 'simple', result: 5 });

    listener.reset();

    expect(listener).toNotHaveBeenCalled();
    expect(test.named()).toBe(5);

    await process();

    expect(listener).toHaveBeenCalled();
    expect(listener.calls[0].arguments[0]).toInclude({ label: 'other', result: 5 });

    listener.reset();

    expect(listener).toNotHaveBeenCalled();
    expect(test.namedAndCustomized()).toBe(5);

    await process();

    expect(listener).toHaveBeenCalled();
    expect(listener.calls[0].arguments[0]).toInclude({ label: 'other', result: 5, options });

    listener.reset();

    expect(listener).toNotHaveBeenCalled();
    expect(test.customOptions()).toBe(5);

    await process();

    expect(listener).toHaveBeenCalled();
    expect(listener.calls[0].arguments[0]).toInclude({ label: 'customOptions', result: 5, options });
  });

  it('should let me decorate async class methods', async () => {
    expect(listener).toNotHaveBeenCalled();

    const test = new Test();

    expect(await test.asyncFn()).toBe(5);

    await process();

    expect(listener).toHaveBeenCalled();
    expect(listener.calls[ 0 ].arguments[ 0 ]).toInclude({ label: 'asyncFn', result: 5 });
  });

  it('should let me profile a ordinary function', async () => {
    expect(listener).toNotHaveBeenCalled();

    const fn = profile(() => 5);

    expect(fn()).toBe(5);

    await process();

    expect(listener).toHaveBeenCalled();
    expect(listener.calls[0].arguments[0]).toInclude({ label: 'anonymous function', result: 5 });

    listener.reset();

    const labeledFn = profile(() => 5, 'other');

    expect(listener).toNotHaveBeenCalled();
    expect(labeledFn()).toBe(5);

    await process();

    expect(listener).toHaveBeenCalled();
    expect(listener.calls[0].arguments[0]).toInclude({ label: 'other', result: 5 });

    listener.reset();

    const namedFn = profile(function myFn() { return 5; });

    expect(listener).toNotHaveBeenCalled();
    expect(namedFn()).toBe(5);

    await process();

    expect(listener).toHaveBeenCalled();
    expect(listener.calls[0].arguments[0]).toInclude({ label: 'myFn', result: 5 });

    listener.reset();

    const customizedFn = profile(() => 5, options);

    expect(listener).toNotHaveBeenCalled();
    expect(customizedFn()).toBe(5);

    await process();

    expect(listener).toHaveBeenCalled();
    expect(listener.calls[0].arguments[0]).toInclude({ label: 'anonymous function', result: 5, options });

    listener.reset();

    const customizedNamedFn = profile(() => 5, 'other', options);

    expect(listener).toNotHaveBeenCalled();
    expect(customizedNamedFn()).toBe(5);

    await process();

    expect(listener).toHaveBeenCalled();
    expect(listener.calls[0].arguments[0]).toInclude({ label: 'other', result: 5, options });
  });

  it('should let me disable profile at all', async () => {
    useProfilr(false);

    expect(listener).toNotHaveBeenCalled();

    const test = new Test();

    expect(test.simple()).toBe(5);

    await process();

    expect(listener).toNotHaveBeenCalled();

    listener.reset();
    expect(listener).toNotHaveBeenCalled();

    const fn = profile(() => 5);

    expect(fn()).toBe(5);

    await process();

    expect(listener).toNotHaveBeenCalled();

    listener.reset();
  });

  it('should let me dispose the listener', async () => {
    expect(listener).toNotHaveBeenCalled();

    dispose();
    const fn = profile(() => 5, 'other');

    expect(fn()).toBe(5);

    await process();

    expect(listener).toNotHaveBeenCalled();
  });
});
