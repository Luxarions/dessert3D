/**
 * LXRN Event Dispatcher
 * @module core/EventDispatcher
 */

export interface LXRNEvent {
  type: string;
  target?: any;
  [key: string]: any;
}

export type EventListener = (event: LXRNEvent) => void;

export class EventDispatcher {
  private _listeners: Record<string, EventListener[]> = {};

  addEventListener(type: string, listener: EventListener): void {
    if (!this._listeners[type]) {
      this._listeners[type] = [];
    }
    if (!this._listeners[type].includes(listener)) {
      this._listeners[type].push(listener);
    }
  }

  hasEventListener(type: string, listener: EventListener): boolean {
    return !!(this._listeners[type] && this._listeners[type].includes(listener));
  }

  removeEventListener(type: string, listener: EventListener): void {
    const listenerArray = this._listeners[type];
    if (listenerArray) {
      const index = listenerArray.indexOf(listener);
      if (index !== -1) {
        listenerArray.splice(index, 1);
      }
    }
  }

  dispatchEvent(event: LXRNEvent): void {
    const listenerArray = this._listeners[event.type];
    if (listenerArray) {
      event.target = this;
      // Copy array in case listeners manipulate the array during execution
      const array = listenerArray.slice(0);
      for (let i = 0, l = array.length; i < l; i++) {
        array[i].call(this, event);
      }
    }
  }

  removeAllListeners(type?: string): void {
    if (type) {
      delete this._listeners[type];
    } else {
      this._listeners = {};
    }
  }
}
