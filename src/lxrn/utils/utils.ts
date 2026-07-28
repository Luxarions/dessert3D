/**
 * LXRN Utils
 * @module utils
 */

import {
  NEVER_DEPTH, ALWAYS_DEPTH, LESS_DEPTH, LESS_EQUAL_DEPTH,
  EQUAL_DEPTH, GREATER_EQUAL_DEPTH, GREATER_DEPTH, NOT_EQUAL_DEPTH
} from '../system/constants';

// ===== ARRAY =====
export function arrayMin(array: number[]): number {
  if (array.length === 0) return Infinity;
  let min = array[0];
  for (let i = 1, l = array.length; i < l; ++i) {
    if (array[i] < min) min = array[i];
  }
  return min;
}

export function arrayMax(array: number[]): number {
  if (array.length === 0) return -Infinity;
  let max = array[0];
  for (let i = 1, l = array.length; i < l; ++i) {
    if (array[i] > max) max = array[i];
  }
  return max;
}

export function arrayNeedsUint32(array: ArrayLike<number>): boolean {
  for (let i = array.length - 1; i >= 0; --i) {
    if (array[i] >= 65535) return true;
  }
  return false;
}

// ===== TYPED ARRAY =====
const TYPED_ARRAYS: Record<string, any> = {
  Int8Array: Int8Array,
  Uint8Array: Uint8Array,
  Uint8ClampedArray: Uint8ClampedArray,
  Int16Array: Int16Array,
  Uint16Array: Uint16Array,
  Int32Array: Int32Array,
  Uint32Array: Uint32Array,
  Float32Array: Float32Array,
  Float64Array: Float64Array
};

export function getTypedArray(type: string, buffer: ArrayBufferLike) {
  return new TYPED_ARRAYS[type](buffer);
}

export function isTypedArray(array: any): boolean {
  return ArrayBuffer.isView(array) && !(array instanceof DataView);
}

// ===== DOM =====
export function createElementNS(name: string): HTMLElement {
  return document.createElementNS('http://www.w3.org/1999/xhtml', name) as HTMLElement;
}

export function createCanvasElement(): HTMLCanvasElement {
  const canvas = createElementNS('canvas') as HTMLCanvasElement;
  canvas.style.display = 'block';
  return canvas;
}

// ===== CONSOLE =====
const _cache: Record<string, boolean> = {};
let _consoleFunction: ((type: string, ...args: any[]) => void) | null = null;

export function setConsoleFunction(fn: (type: string, ...args: any[]) => void) {
  _consoleFunction = fn;
}

export function getConsoleFunction() {
  return _consoleFunction;
}

function formatMessage(message: string): string {
  return `[LXRN] ${message}`;
}

export function log(...params: any[]) {
  const message = params.shift();
  if (_consoleFunction) {
    _consoleFunction('log', formatMessage(message), ...params);
  } else {
    console.log(formatMessage(message), ...params);
  }
}

export function warn(...params: any[]) {
  const message = params.shift();
  if (_consoleFunction) {
    _consoleFunction('warn', formatMessage(message), ...params);
  } else {
    console.warn(formatMessage(message), ...params);
  }
}

export function error(...params: any[]) {
  const message = params.shift();
  if (_consoleFunction) {
    _consoleFunction('error', formatMessage(message), ...params);
  } else {
    console.error(formatMessage(message), ...params);
  }
}

export function warnOnce(...params: any[]) {
  const message = params.join(' ');
  if (message in _cache) return;
  _cache[message] = true;
  warn(...params);
}

// ===== ASYNC =====
export function yieldToMain(): Promise<void> {
  if (typeof self !== 'undefined' &&
      typeof (self as any).scheduler !== 'undefined' &&
      typeof (self as any).scheduler.yield !== 'undefined') {
    return (self as any).scheduler.yield();
  }
  return new Promise(resolve => {
    requestAnimationFrame(() => resolve());
  });
}

export function probeAsync(gl: WebGL2RenderingContext | WebGLRenderingContext, sync: WebGLSync, interval: number): Promise<void> {
  const gl2 = gl as WebGL2RenderingContext;
  return new Promise(function(resolve, reject) {
    function probe() {
      switch (gl2.clientWaitSync(sync, gl2.SYNC_FLUSH_COMMANDS_BIT, 0)) {
        case gl2.WAIT_FAILED:
          reject();
          break;
        case gl2.TIMEOUT_EXPIRED:
          setTimeout(probe, interval);
          break;
        default:
          resolve();
      }
    }
    setTimeout(probe, interval);
  });
}

// ===== MATRIX =====
export function toNormalizedProjectionMatrix(projectionMatrix: { elements: Float32Array | number[] }) {
  const m = projectionMatrix.elements;
  m[2] = 0.5 * m[2] + 0.5 * m[3];
  m[6] = 0.5 * m[6] + 0.5 * m[7];
  m[10] = 0.5 * m[10] + 0.5 * m[11];
  m[14] = 0.5 * m[14] + 0.5 * m[15];
}

export function toReversedProjectionMatrix(projectionMatrix: { elements: Float32Array | number[] }) {
  const m = projectionMatrix.elements;
  const isPerspectiveMatrix = m[11] === -1;
  if (isPerspectiveMatrix) {
    m[10] = -m[10] - 1;
    m[14] = -m[14];
  } else {
    m[10] = -m[10];
    m[14] = -m[14] + 1;
  }
}

export const ReversedDepthFuncs: Record<number, number> = {
  [NEVER_DEPTH]: ALWAYS_DEPTH,
  [LESS_DEPTH]: GREATER_DEPTH,
  [EQUAL_DEPTH]: NOT_EQUAL_DEPTH,
  [LESS_EQUAL_DEPTH]: GREATER_EQUAL_DEPTH,
  [ALWAYS_DEPTH]: NEVER_DEPTH,
  [GREATER_DEPTH]: LESS_DEPTH,
  [NOT_EQUAL_DEPTH]: EQUAL_DEPTH,
  [GREATER_EQUAL_DEPTH]: LESS_EQUAL_DEPTH
};
