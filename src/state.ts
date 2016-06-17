import { ProfileOptions } from './api';

export interface State {
  enabled: boolean;
  listeners: Array<EventCallback>;
}

let id: number = 0;

export function getNextId(): number {
  return ++id;
}

export const state: State = {
  enabled: true,
  listeners: []
};

export interface PerformanceEvent {
  id: number,
  fnName: string,
  label: string;
  duration: number;
  result: any;
  options?: ProfileOptions
}

export interface EventCallback {
  (event: PerformanceEvent): void;
}

export function useProfilr(active: boolean) {
  state.enabled = active;
}

export function processEvent(event: PerformanceEvent) {
  /* istanbul ignore else  */
  if(state.listeners.length !== 0) {
    setTimeout(() => {
      for (let listener of state.listeners) {
        listener(event);
      }
    }, 0);
  }
}

export function registerEventCallback(cb: EventCallback): () => void {
  state.listeners.push(cb);

  return () => {
    state.listeners.splice(state.listeners.indexOf(cb), 1);
  };
}
