// Viewport.js - Main Viewport dengan Engine Integration
import ViewportCore from './ViewportCore.js';
import ViewportLayout from './ViewportLayout.js';
import ViewportControls from './ViewportControls.js';
import ViewportRenderer from './ViewportRenderer.js';
import ViewportEngine from './ViewportEngine.js';

class Viewport extends ViewportCore {
  constructor(options = {}) {
    super(options);
    this.engine = options.engine || null;
    this.renderMode = options.renderMode || '2d'; // '2d', '3d', 'auto'
    this.scene = options.scene || null;
    this.camera = options.camera || null;
    
    this.layout = new ViewportLayout(this);
    this.controls = new ViewportControls(this);
    this.renderer = new ViewportRenderer(this);
    this.engineHandler = new ViewportEngine(this);
    
    this.init();
  }
  
  init() {
    this.layout.createContainer();
    this.controls.setupControls();
    this.renderer.initialize();
    this.layout.setupResizeListener();
    
    if (this.engine) {
      this.engineHandler.connectEngine(this.engine);
    }
  }
  
  addViewport(options = {}) {
    const viewport = this.renderer.createViewport(options);
    
    if (this.engine) {
      this.engineHandler.assignEngineToViewport(viewport);
    }
    
    this.viewports.push(viewport);
    this.layout.updateLayout();
    return viewport;
  }
  
  setEngine(engine) {
    this.engine = engine;
    this.engineHandler.connectEngine(engine);
    this.viewports.forEach(vp => {
      this.engineHandler.assignEngineToViewport(vp);
    });
    return this;
  }
  
  setScene(scene) {
    this.scene = scene;
    this.viewports.forEach(vp => {
      vp.scene = scene;
      vp.render();
    });
    return this;
  }
  
  setCamera(camera) {
    this.camera = camera;
    this.viewports.forEach(vp => {
      vp.camera = camera;
      vp.render();
    });
    return this;
  }
  
  setRenderMode(mode) {
    this.renderMode = mode;
    this.viewports.forEach(vp => {
      vp.renderMode = mode;
      vp.render();
    });
    return this;
  }
  
  render() {
    if (this.engine) {
      this.engine.render();
    } else {
      this.renderer.renderAll();
    }
    return this;
  }
  
  startRenderLoop() {
    const loop = () => {
      this.render();
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(loop);
      }
    };
    loop();
    return this;
  }
  
  setLayout(layout) {
    this.layout.setLayout(layout);
    return this;
  }
  
  setSplitRatio(ratio) {
    this.layout.setSplitRatio(ratio);
    return this;
  }
  
  destroy() {
    this.layout.destroy();
    this.renderer.destroy();
    this.engineHandler.disconnect();
    this.viewports = [];
    return this;
  }
}

if (typeof window !== 'undefined') {
  const LXRN = window.LXRN || {};
  LXRN.Viewport = Viewport;
  window.LXRN = LXRN;
}

export default Viewport;
export { Viewport };
