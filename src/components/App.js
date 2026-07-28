// App.js - Aplikasi Utama LXRN
import LXRN from '../index.js';

class App {
  constructor(options = {}) {
    this.options = options;
    this.container = options.container || (typeof document !== 'undefined' ? document.getElementById('app') : null);
    this.engine = options.engine || null;
    this.viewport = null;
    this.accordion = null;
    this.scene = null;
    this.camera = null;
    
    if (this.container) {
      this.init();
    }
  }
  
  init() {
    this.createLayout();
    this.setupViewport();
    this.setupUI();
    this.startRenderLoop();
  }
  
  createLayout() {
    this.container.style.width = '100%';
    this.container.style.height = (this.options && this.options.height) || '100%';
    this.container.style.minHeight = '550px';
    this.container.style.margin = '0';
    this.container.style.padding = '0';
    this.container.style.overflow = 'hidden';
    this.container.style.background = '#0a0a1a';
    this.container.style.display = 'flex';
    this.container.style.flexDirection = 'column';
    this.container.style.fontFamily = '-apple-system, sans-serif';
    this.container.style.borderRadius = '12px';
    this.container.style.border = '1px solid #263346';
  }
  
  setupViewport() {
    const viewportContainer = document.createElement('div');
    viewportContainer.id = 'viewport-container';
    viewportContainer.style.flex = '1';
    viewportContainer.style.padding = '16px';
    viewportContainer.style.background = '#0a0a1a';
    viewportContainer.style.overflow = 'hidden';
    this.container.appendChild(viewportContainer);
    
    const ViewportClass = (LXRN && LXRN.Viewport) ? (LXRN.Viewport.Viewport || LXRN.Viewport) : null;
    
    if (ViewportClass) {
      this.viewport = new ViewportClass({
        container: viewportContainer,
        engine: this.engine,
        renderMode: this.engine ? '3d' : '2d',
        layout: 'auto',
        splitRatio: 0.5,
        backgroundColor: '#0a0a1a'
      });
    }
    
    if (this.engine && this.viewport) {
      this.scene = this.engine.scene || (LXRN.Scene ? new LXRN.Scene() : { objects: [] });
      this.camera = this.engine.camera || (LXRN.Camera ? new LXRN.Camera() : {});
      this.viewport.setScene(this.scene);
      this.viewport.setCamera(this.camera);
    }
    
    if (this.viewport) {
      // Add default viewports
      this.viewport.addViewport({ 
        label: 'Scene 1', 
        color: '#4a9eff',
        background: '#16213e'
      });
      
      this.viewport.addViewport({ 
        label: 'Scene 2', 
        color: '#ff6b6b',
        background: '#1a1a2e'
      });
    }
  }
  
  setupUI() {
    // Toolbar
    const toolbar = document.createElement('div');
    toolbar.style.display = 'flex';
    toolbar.style.gap = '8px';
    toolbar.style.padding = '8px 16px';
    toolbar.style.background = 'rgba(0,0,0,0.8)';
    toolbar.style.backdropFilter = 'blur(10px)';
    toolbar.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    toolbar.style.flexWrap = 'wrap';
    toolbar.style.alignItems = 'center';
    toolbar.style.justifyContent = 'space-between';
    
    // Left section
    const leftSection = document.createElement('div');
    leftSection.style.display = 'flex';
    leftSection.style.gap = '8px';
    leftSection.style.alignItems = 'center';
    
    const logo = document.createElement('span');
    logo.textContent = '🚀 LXRN';
    logo.style.color = 'white';
    logo.style.fontSize = '18px';
    logo.style.fontWeight = '700';
    logo.style.background = 'linear-gradient(135deg, #4a9eff, #ff6b6b)';
    logo.style.webkitBackgroundClip = 'text';
    logo.style.webkitTextFillColor = 'transparent';
    logo.style.marginRight = '16px';
    leftSection.appendChild(logo);
    
    const buttons = [
      { icon: '🔍+', label: 'Zoom In', action: () => this.viewport?.controls?.zoomIn() },
      { icon: '🔍−', label: 'Zoom Out', action: () => this.viewport?.controls?.zoomOut() },
      { icon: '📐', label: 'Fit', action: () => this.viewport?.controls?.fitView() },
      { icon: '🔄', label: 'Reset', action: () => this.viewport?.controls?.resetView() },
      { icon: '⬜', label: 'Toggle Grid', action: () => this.viewport?.controls?.toggleGrid() },
      { icon: '📊', label: 'Layout', action: () => this.toggleLayout() }
    ];
    
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.textContent = btn.icon;
      button.title = btn.label;
      button.style.background = 'rgba(255,255,255,0.05)';
      button.style.border = '1px solid rgba(255,255,255,0.1)';
      button.style.color = 'white';
      button.style.padding = '6px 10px';
      button.style.borderRadius = '4px';
      button.style.cursor = 'pointer';
      button.style.fontSize = '14px';
      button.style.transition = 'all 0.2s ease';
      
      button.addEventListener('mouseenter', () => {
        button.style.background = 'rgba(255,255,255,0.15)';
        button.style.transform = 'scale(1.05)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.background = 'rgba(255,255,255,0.05)';
        button.style.transform = 'scale(1)';
      });
      
      button.addEventListener('click', btn.action);
      leftSection.appendChild(button);
    });
    
    toolbar.appendChild(leftSection);
    
    // Right section
    const rightSection = document.createElement('div');
    rightSection.style.display = 'flex';
    rightSection.style.gap = '8px';
    rightSection.style.alignItems = 'center';
    
    const info = document.createElement('span');
    info.id = 'app-info';
    info.textContent = 'FPS: 60 | Objects: 0';
    info.style.color = 'rgba(255,255,255,0.4)';
    info.style.fontSize = '12px';
    info.style.fontFamily = 'monospace';
    info.style.padding = '4px 8px';
    info.style.background = 'rgba(255,255,255,0.05)';
    info.style.borderRadius = '4px';
    rightSection.appendChild(info);
    
    toolbar.appendChild(rightSection);
    this.container.prepend(toolbar);
  }
  
  toggleLayout() {
    if (!this.viewport) return;
    const layouts = ['auto', 'horizontal', 'vertical'];
    const current = this.viewport.layout?.layout || 'auto';
    const index = layouts.indexOf(current);
    const next = layouts[(index + 1) % layouts.length];
    this.viewport.setLayout(next);
  }
  
  startRenderLoop() {
    let frameCount = 0;
    let lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    let fps = 60;
    
    const loop = () => {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      frameCount++;
      
      if (now - lastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = now;
        this.updateInfo(fps);
      }
      
      if (this.viewport) {
        this.viewport.render();
      }
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(loop);
      }
    };
    
    loop();
  }
  
  updateInfo(fps) {
    if (typeof document === 'undefined') return;
    const info = document.getElementById('app-info');
    if (info) {
      const objects = this.scene ? (this.scene.objects?.length || 0) : 0;
      info.textContent = `FPS: ${fps} | Objects: ${objects}`;
    }
  }
  
  addObject(object) {
    if (this.scene && this.scene.add) {
      this.scene.add(object);
    }
    return this;
  }
  
  addObjects(objects) {
    objects.forEach(obj => this.addObject(obj));
    return this;
  }
  
  getViewport() {
    return this.viewport;
  }
  
  getScene() {
    return this.scene;
  }
  
  getCamera() {
    return this.camera;
  }
  
  destroy() {
    if (this.viewport) {
      this.viewport.destroy();
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

if (typeof window !== 'undefined') {
  const LXRNGlobal = window.LXRN || {};
  LXRNGlobal.App = App;
  window.LXRN = LXRNGlobal;
}

export default App;
export { App };
