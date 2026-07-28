// ViewportLayout.js - Layout Management for Viewport
class ViewportLayout {
  constructor(parent) {
    this.parent = parent;
    this.containerEl = null;
  }

  createContainer() {
    if (!this.parent.container || typeof document === 'undefined') return;
    this.containerEl = document.createElement('div');
    this.containerEl.className = 'lxrn-viewport-container';
    this.containerEl.style.display = 'flex';
    this.containerEl.style.width = '100%';
    this.containerEl.style.height = '100%';
    this.containerEl.style.minHeight = '300px';
    this.containerEl.style.gap = '8px';
    this.containerEl.style.position = 'relative';
    this.containerEl.style.overflow = 'hidden';

    this.parent.container.appendChild(this.containerEl);
  }

  setupResizeListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.updateLayout());
    }
  }

  setLayout(mode) {
    this.parent.layoutMode = mode;
    this.updateLayout();
  }

  setSplitRatio(ratio) {
    this.parent.splitRatio = ratio;
    this.updateLayout();
  }

  updateLayout() {
    if (!this.containerEl) return;
    const vps = this.parent.viewports;
    if (vps.length === 0) return;

    if (this.parent.layoutMode === 'horizontal') {
      this.containerEl.style.flexDirection = 'row';
    } else if (this.parent.layoutMode === 'vertical') {
      this.containerEl.style.flexDirection = 'column';
    } else {
      this.containerEl.style.flexDirection = 'row';
      this.containerEl.style.flexWrap = 'wrap';
    }

    vps.forEach((vp) => {
      if (!this.containerEl.contains(vp.element)) {
        this.containerEl.appendChild(vp.element);
      }
      
      const rect = vp.element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        if (vp.canvas.width !== rect.width || vp.canvas.height !== rect.height) {
          vp.canvas.width = rect.width;
          vp.canvas.height = rect.height;
          vp.render();
        }
      }
    });
  }

  destroy() {
    if (this.containerEl && this.containerEl.parentNode) {
      this.containerEl.parentNode.removeChild(this.containerEl);
    }
  }
}

export default ViewportLayout;
