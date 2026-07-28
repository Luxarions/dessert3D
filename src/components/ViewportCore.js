// ViewportCore.js - Base Class for Viewport
class ViewportCore {
  constructor(options = {}) {
    this.options = options;
    this.container = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : (options.container || (typeof document !== 'undefined' ? document.body : null));
    this.viewports = [];
    this.minSize = options.minSize || 100;
    this.splitRatio = options.splitRatio || 0.5;
    this.layoutMode = options.layout || 'grid';
  }
}

export default ViewportCore;
