import { createComponent } from "@vue-beans/components";

describe('components', () => {
    test('createComponent from class', () => {
        class Foo {}
        const component = createComponent(Foo)
        expect(component.name).toBe('Foo')
    })
})