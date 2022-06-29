import { createBean, Reactive } from '@vue-beans/beans';
import { Watch } from '../src/Watch';
import { nextTick } from 'vue';

describe('Watch Decorator', () => {
  test('Watch decorator add watch to function after setup', () => {
    const mockOnWatch = jest.fn((newValue) => {});
    @Reactive
    class Foo {
      observable: boolean = true;
      @Watch<Foo>((it) => it.observable)
      load = mockOnWatch;
    }
    const foo = createBean(Foo); // create a reactive object
    foo.setup(); // initialize the watch functions

    foo.observable = false; // watch should be called in next tick.
    return nextTick(() => {
      expect(mockOnWatch.mock.calls.length).toBe(1);
      expect(mockOnWatch.mock.calls[0][0]).toBe(false); // new value
    });
  });
});
