import { createBean } from '@vue-beans/beans';
import { CatchException } from '../src/CatchException';

describe('Catch Exception catch exception', () => {
  test('CatchException catch handle error', () => {
    const handlerMock = jest.fn((ex) => undefined);
    class Foo {
      loading: boolean = false;
      @CatchException<Foo>((it) => it.handler)
      dangerFunction(): void {
        throw Error('myerror');
      }
      handler = handlerMock;
    }

    const foo = createBean(Foo);
    foo.setup();

    foo.dangerFunction();

    expect(handlerMock.mock.calls.length).toBe(1);
    expect(handlerMock.mock.calls[0][0].message).toBe('myerror');
  });

  test('CatchException propagate the error when handler return false', () => {
    const handlerMock = jest.fn((ex) => false); // return false when it don't know how to process the exception.
    class Foo {
      loading: boolean = false;
      @CatchException<Foo>((it) => it.handler)
      dangerFunction(): void {
        throw Error('myerror');
      }
      handler = handlerMock;
    }

    const foo = createBean(Foo);
    foo.setup();

    expect(foo.dangerFunction).toThrowError('myerror');
  });
});
