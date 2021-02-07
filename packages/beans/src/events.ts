/* eslint-disable @typescript-eslint/no-explicit-any */

import { shallowReactive } from 'vue';
import { EventBus } from './types';

type EventDefinition = Record<string, any>


function addEventType(eventBus: Record<string, unknown>, name: string, newValue: any = null) {
  const event = function (newValue: any) {
    addEventType(eventBus, name, newValue)
  }
  event.type = name
  event.value = newValue
  eventBus[name] = event
}

// eslint-disable-next-line import/prefer-default-export
export function useEventsbus<T extends EventDefinition>(events: T): Readonly<EventBus<T>> {
  const eventBus: Record<string, unknown> = shallowReactive({});
  Object.keys(events).forEach((key) => {
    addEventType(eventBus, key)
  });
  return eventBus as unknown as EventBus<T>
}