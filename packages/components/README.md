# Gravity Beans

- Create and initialize any class with empty constructor.
- Initialize lazy properties
- Reactive Beans with @Reactive()
- Ciclo de vida del bean

constructor
before setup
setup


Bean 

```
export type Bean = {
    beforeSetup?: (...args: unknown[]) => void;
    setup?: (...args: unknown[]) => void;
    eventbus?: EventBus<unknown>;
};
```


Next
- Destroy in the cycle (I don't know if it is necesary, justify.)
- async initializers (I don't know if it is necessary, justify.)