// ViewportControls.js - Mouse and Touch Controls
class ViewportControls {
  constructor(parent) {
    this.parent = parent;
  }

  setupControls() {
    // Global controls configuration
  }

  zoomIn() {
    this.parent.viewports.forEach(vp => {
      vp.camera.zoom = (vp.camera.zoom || 1) * 1.2;
      vp.render();
    });
  }

  zoomOut() {
    this.parent.viewports.forEach(vp => {
      vp.camera.zoom = (vp.camera.zoom || 1) / 1.2;
      vp.render();
    });
  }

  fitView() {
    this.parent.viewports.forEach(vp => {
      vp.camera.x = 0;
      vp.camera.y = 0;
      vp.camera.zoom = 1;
      vp.render();
    });
  }

  resetView() {
    this.fitView();
  }

  toggleGrid() {
    this.parent.viewports.forEach(vp => {
      vp.options.gridEnabled = vp.options.gridEnabled === false;
      vp.render();
    });
  }

  setupViewportEvents(viewport) {
    if (!viewport || !viewport.canvas) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const canvas = viewport.canvas;

    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX - (viewport.camera.x || 0);
      startY = e.clientY - (viewport.camera.y || 0);
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        viewport.camera.x = e.clientX - startX;
        viewport.camera.y = e.clientY - startY;
        viewport.render();
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      viewport.camera.zoom = (viewport.camera.zoom || 1) * zoomFactor;
      viewport.render();
    }, { passive: false });
  }
}

export default ViewportControls;
