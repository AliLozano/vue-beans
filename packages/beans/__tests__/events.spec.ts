import { useEventBus } from "@vue-beans/beans";
import { watch } from "vue";
import { nextTick } from "process";

describe('useEventBus', () => {
    test('Test that event bus is created', () => {
        const eventbus = useEventBus({saved: null})
        let saved = false;
        watch(() => eventbus.saved, function () {
            saved = true;
        })
        eventbus.saved();

        nextTick(() => {
            expect(saved).toBe(true);
        });
    });

    test('Test that event bus with event value', () => {
        const eventbus = useEventBus({saved: String});

        let saved: string | undefined = "hi";
        watch(() => eventbus.saved, function (e) {
            saved = e.value;
        })
        eventbus.saved("bye");

        nextTick(() => {
            expect(saved).toBe("bye");
        });
    });
})
