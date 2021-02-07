
import { getDescriptors, wrapFields } from "../src/utils";
import { isRef } from "vue";

describe('getDescriptors', () => {
    test('Test descriptors of function are ok ', () => {
        class Foo {
            // valids
            bar: string = ""
            fnBar(): void {}
            get barGetter() { return "" }

            // invalids
            $bar: string = ""
            _bar: string = ""
            get $barGetter() { return "" }
            get _barGetter() { return "" }
        }

        const instance = new Foo()

        const descriptors = getDescriptors(instance)

        expect(descriptors.length).toBe(3)
        expect(descriptors[0][0]).toBe('bar')
        expect(descriptors[1][0]).toBe('fnBar')
        expect(descriptors[2][0]).toBe('barGetter')

        expect(descriptors[0][1].writable).toBe(true)
        expect(descriptors[1][1].writable).toBe(true)
        expect(descriptors[2][1].writable).toBe(undefined)
    })
});

describe('wrapFields', () => {
    test('Map fiels into closure or computeds', () => {
        class Foo {
            bar: string = "bar"
            fnBar(): string { return this.bar}
            get barGetter() { return this.bar }

            // invalids
            $bar: string = ""
            _bar: string = ""
            get $barGetter() { return "" }
            get _barGetter() { return "" }
        }

        const instance: Record<string, any>= new Foo()

        const fields = wrapFields(instance, getDescriptors(instance))

        expect(Object.keys(fields).length).toBe(3)

        const { bar, fnBar, barGetter } = fields

        expect(isRef(bar)).toBe(true)
        expect(isRef(barGetter)).toBe(true)

        expect((fnBar as any)()).toBe("bar") // closure
    })
});

