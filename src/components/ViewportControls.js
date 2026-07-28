// ViewportControls.js - Mouse and Touch Controls
class ViewportControls {
  constructor(parent) {
    this.parent = parent;
  }

  setupControls() {
    // Global controls configuration
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
