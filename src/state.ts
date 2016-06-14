export interface State {
  enabled: boolean;
  listeners: Array<EventCallback>;
}

export const state: State = {
  enabled: true,
  listeners: []
};

export interface PerformanceEvent {
  label: string;
  duration: number;
  result: any;
  custom?: Object
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
