import {
    InjectionManager,
    setCurrentInjectionManager,
    useService
} from "@vue-beans/injections";

describe('useService', () => {
    test('test useService uses useAnonymousService', () => {
        class Foo {}

        const manager = new InjectionManager();

        const bean = new Foo()

        const useAnonymousService = jest.fn((builder: new () => Foo) => bean);

        manager.useAnonymousService = useAnonymousService as any;

        setCurrentInjectionManager(manager);

        const service = useService(Foo)

        expect(useAnonymousService.mock.calls.length).toBe(1);
        expect(useAnonymousService.mock.calls[0][0]).toBe(Foo);
        expect(service).toBe(bean);

        setCurrentInjectionManager(null);
    })

})