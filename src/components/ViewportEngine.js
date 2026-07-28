// ViewportEngine.js - Engine Integration Layer
class ViewportEngine {
  constructor(parent) {
    this.parent = parent;
    this.engine = null;
    this.renderCallbacks = [];
    this.viewportMap = new Map();
  }
  
  connectEngine(engine) {
    this.engine = engine;
    
    if (engine && engine.on) {
      engine.on('render', () => this.onEngineRender());
      engine.on('update', () => this.onEngineUpdate());
    }
    
    this.setupEngineCompatibility();
    return this;
  }
  
  setupEngineCompatibility() {
    if (!this.engine) return;
    
    if (this.engine.getRenderer) {
      this.engineRenderer = this.engine.getRenderer();
    }
    
    if (this.engine.getScene) {
      this.engineScene = this.engine.getScene();
    }
    
    if (this.engine.getCamera) {
      this.engineCamera = this.engine.getCamera();
    }
  }
  
  assignEngineToViewport(viewport) {
    if (!this.engine) return;
    
    const engineViewport = {
      viewport: viewport,
      renderer: this.engineRenderer,
      scene: this.engineScene || this.parent.scene,
      camera: this.engineCamera || this.parent.camera,
      renderMode: viewport.renderMode || this.parent.renderMode
    };
    
    this.viewportMap.set(viewport, engineViewport);
    
    viewport.engineViewport = engineViewport;
    viewport.render = () => this.renderViewport(viewport);
    
    if (viewport.renderMode === '3d' || this.parent.renderMode === '3d') {
      this.setup3DRenderer(viewport);
    }
    
    return this;
  }
  
  setup3DRenderer(viewport) {
    const canvas = viewport.canvas;
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (gl) {
      viewport.gl = gl;
      viewport.is3D = true;
      
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.1, 0.1, 0.2, 1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
    } else {
      console.warn('WebGL not supported, falling back to 2D renderer');
      viewport.is3D = false;
    }
  }
  
  renderViewport(viewport) {
    if (!this.engine) return;
    
    if (viewport.is3D && viewport.gl) {
      this.render3D(viewport);
    } else {
      this.render2D(viewport);
    }
  }
  
  render3D(viewport) {
    const gl = viewport.gl;
    const w = viewport.canvas.width;
    const h = viewport.canvas.height;
    
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    if (this.engine && this.engine.renderScene) {
      this.engine.renderScene(gl, viewport.scene || this.parent.scene);
    }
    
    if (this.renderCallbacks.length > 0) {
      this.renderCallbacks.forEach(cb => cb(gl, viewport));
    }
  }
  
  render2D(viewport) {
    const ctx = viewport.ctx;
    const w = viewport.canvas.width;
    const h = viewport.canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = viewport.options.background || '#16213e';
    ctx.fillRect(0, 0, w, h);
    
    if (this.engine && this.engine.render2D) {
      this.engine.render2D(ctx, viewport);
    } else if (viewport.drawContent) {
      viewport.drawContent();
    }
  }
  
  onEngineRender() {
    this.parent.viewports.forEach(vp => {
      if (vp.engineViewport) {
        this.renderViewport(vp);
      }
    });
  }
  
  onEngineUpdate() {
    // Handle engine updates
  }
  
  addRenderCallback(callback) {
    this.renderCallbacks.push(callback);
    return this;
  }
  
  removeRenderCallback(callback) {
    const index = this.renderCallbacks.indexOf(callback);
    if (index > -1) {
      this.renderCallbacks.splice(index, 1);
    }
    return this;
  }
  
  disconnect() {
    this.engine = null;
    this.viewportMap.clear();
    this.renderCallbacks = [];
    return this;
  }
}

export default ViewportEngine;
