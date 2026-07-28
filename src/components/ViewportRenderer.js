// ViewportRenderer.js - Enhanced dengan Engine Support
class ViewportRenderer {
  constructor(parent) {
    this.parent = parent;
  }
  
  initialize() {
    // Initialization logic
  }
  
  createViewport(options = {}) {
    const element = document.createElement('div');
    element.style.flex = '1';
    element.style.background = options.background || '#16213e';
    element.style.borderRadius = '8px';
    element.style.overflow = 'hidden';
    element.style.position = 'relative';
    element.style.boxShadow = 'inset 0 0 30px rgba(0,0,0,0.3)';
    element.style.minHeight = this.parent.minSize + 'px';
    element.style.minWidth = this.parent.minSize + 'px';
    element.style.transition = 'all 0.3s ease';
    
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.background = options.background || '#16213e';
    element.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    const label = this.createLabel(options.label || 'Viewport');
    element.appendChild(label);
    
    const info = this.createInfoOverlay();
    element.appendChild(info);
    
    const parentRef = this.parent;
    
    const viewport = {
      element: element,
      canvas: canvas,
      ctx: ctx,
      gl: null,
      is3D: false,
      label: label,
      info: info,
      options: Object.assign({ gridEnabled: true }, options),
      camera: { x: 0, y: 0, zoom: 1 },
      scene: this.parent.scene || null,
      renderMode: this.parent.renderMode || '2d',
      parent: parentRef,
      render: function() {
        if (this.is3D && this.gl) {
          this.render3D();
        } else {
          this.render2D();
        }
      },
      render2D: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.options.background || '#16213e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.options.gridEnabled !== false) {
          this.drawGrid();
        }
        
        this.drawCenterCross();
        this.drawObjects();
        this.drawLabels();
      },
      render3D: function() {
        if (!this.gl) return;
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.gl.viewport(0, 0, w, h);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        if (this.parent && this.parent.engine && this.parent.engine.renderScene) {
          this.parent.engine.renderScene(this.gl, this.scene || this.parent.scene);
        }
      },
      drawGrid: function() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const gridSize = 40;
        const offsetX = (this.camera.x || 0) % gridSize;
        const offsetY = (this.camera.y || 0) % gridSize;
        
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 0.5;
        
        for (let x = -w/2 + offsetX; x < w/2; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, -h/2);
          ctx.lineTo(x, h/2);
          ctx.stroke();
        }
        
        for (let y = -h/2 + offsetY; y < h/2; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(-w/2, y);
          ctx.lineTo(w/2, y);
          ctx.stroke();
        }
      },
      drawCenterCross: function() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 10]);
        ctx.beginPath();
        ctx.moveTo(w/2, 0);
        ctx.lineTo(w/2, h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, h/2);
        ctx.lineTo(w, h/2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath();
        ctx.arc(w/2, h/2, 4, 0, Math.PI * 2);
        ctx.fill();
      },
      drawObjects: function() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cx = w/2 + (this.camera.x || 0);
        const cy = h/2 + (this.camera.y || 0);
        const size = Math.min(w, h) * 0.15;
        
        ctx.fillStyle = this.options.color || '#4a9eff';
        ctx.shadowColor = 'rgba(74,158,255,0.3)';
        ctx.shadowBlur = 30;
        ctx.fillRect(cx - size/2, cy - size/2, size, size);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - size/2, cy - size/2, size, size);
        
        const r = size * 0.6;
        ctx.beginPath();
        ctx.arc(cx + size * 1.2, cy, r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ff6b6b';
        ctx.shadowColor = 'rgba(255,107,107,0.3)';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
      },
      drawLabels: function() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cx = w/2 + (this.camera.x || 0);
        const cy = h/2 + (this.camera.y || 0);
        const size = Math.min(w, h) * 0.15;
        
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '12px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.options.label || 'Viewport', cx, cy + size * 0.8);
      }
    };
    
    this.parent.controls.setupViewportEvents(viewport);
    viewport.render();
    
    return viewport;
  }
  
  createLabel(text) {
    const label = document.createElement('div');
    label.textContent = text;
    label.style.position = 'absolute';
    label.style.top = '12px';
    label.style.left = '16px';
    label.style.color = 'rgba(255,255,255,0.6)';
    label.style.fontSize = '14px';
    label.style.fontWeight = '600';
    label.style.fontFamily = '-apple-system, sans-serif';
    label.style.textShadow = '0 2px 8px rgba(0,0,0,0.5)';
    label.style.background = 'rgba(0,0,0,0.3)';
    label.style.backdropFilter = 'blur(10px)';
    label.style.padding = '4px 12px';
    label.style.borderRadius = '4px';
    label.style.border = '1px solid rgba(255,255,255,0.1)';
    label.style.pointerEvents = 'none';
    return label;
  }
  
  createInfoOverlay() {
    const info = document.createElement('div');
    info.textContent = 'FPS: 60';
    info.style.position = 'absolute';
    info.style.bottom = '12px';
    info.style.right = '16px';
    info.style.color = 'rgba(255,255,255,0.3)';
    info.style.fontSize = '12px';
    info.style.fontFamily = 'monospace';
    info.style.background = 'rgba(0,0,0,0.3)';
    info.style.backdropFilter = 'blur(10px)';
    info.style.padding = '2px 10px';
    info.style.borderRadius = '4px';
    info.style.border = '1px solid rgba(255,255,255,0.05)';
    info.style.pointerEvents = 'none';
    return info;
  }
  
  renderAll() {
    this.parent.viewports.forEach(vp => vp.render());
  }
  
  destroy() {
    this.parent.viewports.forEach(vp => {
      if (vp.element && vp.element.remove) {
        vp.element.remove();
      }
    });
  }
}

export default ViewportRenderer;
