/**
 * LXRN Utils
 * @module utils
 */

import {
  NEVER_DEPTH, ALWAYS_DEPTH, LESS_DEPTH, LESS_EQUAL_DEPTH,
  EQUAL_DEPTH, GREATER_EQUAL_DEPTH, GREATER_DEPTH, NOT_EQUAL_DEPTH
} from '../system/constants.js';

// ===== ARRAY =====
export function arrayMin(array) {
  if (array.length === 0) return Infinity;
  let min = array[0];
  for (let i = 1, l = array.length; i < l; ++i) {
    if (array[i] < min) min = array[i];
  }
  return min;
}

export function arrayMax(array) {
  if (array.length === 0) return -Infinity;
  let max = array[0];
  for (let i = 1, l = array.length; i < l; ++i) {
    if (array[i] > max) max = array[i];
  }
  return max;
}

export function arrayNeedsUint32(array) {
  for (let i = array.length - 1; i >= 0; --i) {
    if (array[i] >= 65535) return true;
  }
  return false;
}

// ===== TYPED ARRAY =====
const TYPED_ARRAYS = {
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

export function getTypedArray(type, buffer) {
  return new TYPED_ARRAYS[type](buffer);
}

export function isTypedArray(array) {
  return ArrayBuffer.isView(array) && !(array instanceof DataView);
}

// ===== DOM =====
export function createElementNS(name) {
  return document.createElementNS('http://www.w3.org/1999/xhtml', name);
}

export function createCanvasElement() {
  const canvas = createElementNS('canvas');
  canvas.style.display = 'block';
  return canvas;
}

// ===== CONSOLE =====
const _cache = {};
let _consoleFunction = null;

export function setConsoleFunction(fn) {
  _consoleFunction = fn;
}

export function getConsoleFunction() {
  return _consoleFunction;
}

function formatMessage(message) {
  return `[LXRN] ${message}`;
}

export function log(...params) {
  const message = params.shift();
  if (_consoleFunction) {
    _consoleFunction('log', formatMessage(message), ...params);
  } else {
    console.log(formatMessage(message), ...params);
  }
}

export function warn(...params) {
  const message = params.shift();
  if (_consoleFunction) {
    _consoleFunction('warn', formatMessage(message), ...params);
  } else {
    console.warn(formatMessage(message), ...params);
  }
}

export function error(...params) {
  const message = params.shift();
  if (_consoleFunction) {
    _consoleFunction('error', formatMessage(message), ...params);
  } else {
    console.error(formatMessage(message), ...params);
  }
}

export function warnOnce(...params) {
  const message = params.join(' ');
  if (message in _cache) return;
  _cache[message] = true;
  warn(...params);
}

// ===== ASYNC =====
export function yieldToMain() {
  if (typeof self !== 'undefined' &&
      typeof self.scheduler !== 'undefined' &&
      typeof self.scheduler.yield !== 'undefined') {
    return self.scheduler.yield();
  }
  return new Promise(resolve => {
    requestAnimationFrame(resolve);
  });
}

export function probeAsync(gl, sync, interval) {
  return new Promise(function(resolve, reject) {
    function probe() {
      switch (gl.clientWaitSync(sync, gl.SYNC_FLUSH_COMMANDS_BIT, 0)) {
        case gl.WAIT_FAILED:
          reject();
          break;
        case gl.TIMEOUT_EXPIRED:
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
export function toNormalizedProjectionMatrix(projectionMatrix) {
  const m = projectionMatrix.elements;
  m[2] = 0.5 * m[2] + 0.5 * m[3];
  m[6] = 0.5 * m[6] + 0.5 * m[7];
  m[10] = 0.5 * m[10] + 0.5 * m[11];
  m[14] = 0.5 * m[14] + 0.5 * m[15];
}

export function toReversedProjectionMatrix(projectionMatrix) {
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

export const ReversedDepthFuncs = {
  [NEVER_DEPTH]: ALWAYS_DEPTH,
  [LESS_DEPTH]: GREATER_DEPTH,
  [EQUAL_DEPTH]: NOT_EQUAL_DEPTH,
  [LESS_EQUAL_DEPTH]: GREATER_EQUAL_DEPTH,
  [ALWAYS_DEPTH]: NEVER_DEPTH,
  [GREATER_DEPTH]: LESS_DEPTH,
  [NOT_EQUAL_DEPTH]: EQUAL_DEPTH,
  [GREATER_EQUAL_DEPTH]: LESS_EQUAL_DEPTH
};
