import expect, { createSpy } from 'expect';
import { profile, TARGET_MUST_BE_A_FUNCTION, UNSUPPORTED_CALL_SIGNATURE_ERROR } from '../src/api';
import { registerEventCallback, useProfilr } from '../src/state';
import { process } from './profilr';

class Test {
  counter = 5;

  @profile()
  simple () {
    return this.counter;
  }

  @profile('other')
  named () {
    return this.counter;
  }
}

describe('profilr@Babel', () => {
  let listener;

  beforeEach(() => {
    useProfilr(true);

    listener = createSpy();
    registerEventCallback(listener);
  });

  it('should let me decorate class methods', async () => {
    expect(listener).toNotHaveBeenCalled();

    const test = new Test();

    expect(test.simple()).toBe(5);

    await process();

    expect(listener).toHaveBeenCalled();
    expect(listener.calls[ 0 ].arguments[ 0 ]).toInclude({ fnName: 'simple', result: 5 });
  });

  it('should let me decorate and label class methods', async () => {
    expect(listener).toNotHaveBeenCalled();

    const test = new Test();

    expect(test.named()).toBe(5);

    await process();

    expect(listener).toHaveBeenCalled();
    expect(listener.calls[ 0 ].arguments[ 0 ]).toInclude({ fnName: 'named', label: 'other', result: 5 });
  });

  it('should work with context', () => {
    (function() {
      let _this = this;

      profile(() => {
        expect(this).toBe(_this);
      })();

      profile(function () {
        expect(this).toNotBe(_this);
      })();

      let newContext = {};

      profile(function() {
        expect(this).toBe(newContext);
      }).call(newContext);
    }).call({});
  });

  it('should throw if a @profile decorated field is not a method', () => {
    expect(() => {
      class Test {
        @profile()
        name = 'foo'
      }

      new Test();
    }).toThrow(TARGET_MUST_BE_A_FUNCTION);

    expect(() => {
      const test = new Test();
      test.named = 10;
    }).toThrow(TARGET_MUST_BE_A_FUNCTION);
  });

  it('should throw if @profile is called with a unsupported signature', () => {
    expect(() => {
      class Test {
        @profile(5)
        doIt () {
        }
      }
    }).toThrow(UNSUPPORTED_CALL_SIGNATURE_ERROR);

    expect(() => {
      class Test {
        @profile('foo', () => {})
        doIt () {
        }
      }
    }).toThrow(UNSUPPORTED_CALL_SIGNATURE_ERROR);

    expect(() => profile(5)).toThrow(UNSUPPORTED_CALL_SIGNATURE_ERROR);
    expect(() => profile(5, 5)).toThrow(UNSUPPORTED_CALL_SIGNATURE_ERROR);
    expect(() => profile(() => {}, 5)).toThrow(UNSUPPORTED_CALL_SIGNATURE_ERROR);
    expect(() => profile(() => {}, 'foo', () => {})).toThrow(UNSUPPORTED_CALL_SIGNATURE_ERROR);
    expect(() => profile('foo', 'bar', 'baz')).toThrow(UNSUPPORTED_CALL_SIGNATURE_ERROR);
    expect(() => profile('foo', 'bar', 'baz', 'zzz')).toThrow(UNSUPPORTED_CALL_SIGNATURE_ERROR);
  });
});
