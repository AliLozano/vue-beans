import { isReactive, ref } from 'vue';
import { reactiveWithRefs, remapFunctionsToClosures } from '../src/builders';

describe('remapFunctionsToClosures', () => {
  test('Test that functions of objects are converted to closures', () => {
    class Foo {
      name = 'Ali';

      greet(): string {
        return `Hello ${this.name}`;
      }
    }

    const { greet, name } = remapFunctionsToClosures(new Foo());
    expect(greet()).toBe(`Hello ${name}`); // method is a closure now.
  });
});

describe('reactiveWithRefs', () => {
  test('Test that ref works after make a class reactive', () => {
    class Foo {
      name = ref('Homer');

      greet(): string {
        return `Hello ${this.name.value}`;
      }
    }

    const obj = reactiveWithRefs(new Foo());

    expect(isReactive(obj)).toBe(true); // method is a closure now.
    expect(obj.greet()).toBe(`Hello ${obj.name.value}`); // method is a closure now.
  });
});
