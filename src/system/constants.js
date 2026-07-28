/**
 * LXRN Constants
 * @module constants
 */

export const VERSION = '1.0.0';

// ===== COLOR SPACES =====
export const NO_COLOR_SPACE = '';
export const SRGB_COLOR_SPACE = 'srgb';
export const LINEAR_SRGB_COLOR_SPACE = 'srgb-linear';

// ===== TRANSFER FUNCTIONS =====
export const LINEAR_TRANSFER = 'linear';
export const SRGB_TRANSFER = 'srgb';

// ===== DEPTH MODES =====
export const NEVER_DEPTH = 0;
export const ALWAYS_DEPTH = 1;
export const LESS_DEPTH = 2;
export const LESS_EQUAL_DEPTH = 3;
export const EQUAL_DEPTH = 4;
export const GREATER_EQUAL_DEPTH = 5;
export const GREATER_DEPTH = 6;
export const NOT_EQUAL_DEPTH = 7;

// ===== BLENDING MODES =====
export const NO_BLENDING = 0;
export const NORMAL_BLENDING = 1;
export const ADDITIVE_BLENDING = 2;
export const SUBTRACTIVE_BLENDING = 3;
export const MULTIPLY_BLENDING = 4;
export const CUSTOM_BLENDING = 5;

// ===== SIDES =====
export const FRONT_SIDE = 0;
export const BACK_SIDE = 1;
export const DOUBLE_SIDE = 2;

// ===== TONE MAPPING =====
export const NO_TONE_MAPPING = 0;
export const LINEAR_TONE_MAPPING = 1;
export const REINHARD_TONE_MAPPING = 2;
export const CINEON_TONE_MAPPING = 3;
export const ACES_FILMIC_TONE_MAPPING = 4;
export const CUSTOM_TONE_MAPPING = 5;
export const AGX_TONE_MAPPING = 6;
export const NEUTRAL_TONE_MAPPING = 7;

// ===== COORDINATE SYSTEMS =====
export const WEBGL_COORDINATE_SYSTEM = 2000;
export const WEBGPU_COORDINATE_SYSTEM = 2001;

// ===== TEXTURE FORMATS =====
export const TEXTURE_FORMAT = {
  RGBA8_UNORM: 'rgba8unorm',
  RGBA16_FLOAT: 'rgba16float',
  RGBA32_FLOAT: 'rgba32float',
  RGB8_UNORM: 'rgb8unorm',
  RGB16_FLOAT: 'rgb16float',
  RGB32_FLOAT: 'rgb32float',
  DEPTH24_STENCIL8: 'depth24plus-stencil8',
  DEPTH32_FLOAT: 'depth32float'
};

// ===== TEXTURE FILTERS =====
export const TEXTURE_FILTER = {
  NEAREST: 'nearest',
  LINEAR: 'linear',
  NEAREST_MIPMAP_NEAREST: 'nearest-mipmap-nearest',
  LINEAR_MIPMAP_NEAREST: 'linear-mipmap-nearest',
  NEAREST_MIPMAP_LINEAR: 'nearest-mipmap-linear',
  LINEAR_MIPMAP_LINEAR: 'linear-mipmap-linear'
};

// ===== TEXTURE WRAP =====
export const TEXTURE_WRAP = {
  REPEAT: 'repeat',
  CLAMP_TO_EDGE: 'clamp-to-edge',
  MIRRORED_REPEAT: 'mirrored-repeat'
};

// ===== BUFFER USAGE =====
export const BUFFER_USAGE = {
  VERTEX: 'vertex',
  INDEX: 'index',
  UNIFORM: 'uniform',
  STORAGE: 'storage',
  INDIRECT: 'indirect'
};

// ===== PRIMITIVE TYPES =====
export const PRIMITIVE_TYPE = {
  POINTS: 'points',
  LINES: 'lines',
  LINE_STRIP: 'line-strip',
  TRIANGLES: 'triangles',
  TRIANGLE_STRIP: 'triangle-strip',
  TRIANGLE_FAN: 'triangle-fan'
};

// ===== PIXEL FORMATS =====
export const PIXEL_FORMAT = {
  RGBA: 'rgba',
  RGB: 'rgb',
  DEPTH: 'depth',
  DEPTH_STENCIL: 'depth-stencil'
};

// ===== SHADER TYPES =====
export const SHADER_TYPE = {
  VERTEX: 'vertex',
  FRAGMENT: 'fragment',
  COMPUTE: 'compute',
  GEOMETRY: 'geometry',
  TESSELATION_CONTROL: 'tesselation-control',
  TESSELATION_EVALUATION: 'tesselation-evaluation'
};

// ===== EVENT TYPES =====
export const EVENT_TYPE = {
  INIT: 'init',
  UPDATE: 'update',
  RENDER: 'render',
  RESIZE: 'resize',
  DESTROY: 'destroy',
  ERROR: 'error',
  WARNING: 'warning',
  COMPLETE: 'complete',
  PROGRESS: 'progress',
  CHANGE: 'change'
};

// ===== LOG LEVELS =====
export const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
  NONE: 4
};

// ===== PERFORMANCE METRICS =====
export const PERFORMANCE_METRIC = {
  FPS: 'fps',
  FRAME_TIME: 'frame-time',
  GPU_TIME: 'gpu-time',
  MEMORY_USAGE: 'memory-usage',
  DRAW_CALLS: 'draw-calls',
  TRIANGLES: 'triangles',
  VERTICES: 'vertices'
};

// ===== RENDER PASS OPERATIONS =====
export const RENDER_PASS_OPERATION = {
  CLEAR: 'clear',
  LOAD: 'load',
  STORE: 'store',
  DISCARD: 'discard'
};
