/**
 * LXRN WebGLRenderer
 * Hardware-accelerated 3D Graphics Renderer
 * @module renderers/WebGLRenderer
 */

import { Scene } from '../core/Scene';
import { Camera } from '../core/Camera';
import { Mesh } from '../core/Mesh';
import { Object3D } from '../core/Object3D';
import { Color } from '../math/Color';

export interface RendererStats {
  drawCalls: number;
  triangles: number;
  frameTimeMs: number;
  fps: number;
}

export class WebGLRenderer {
  domElement: HTMLCanvasElement;
  gl: WebGL2RenderingContext | WebGLRenderingContext | null = null;
  clearColor: Color = new Color(0x050508);
  clearAlpha: number = 1.0;
  autoClear: boolean = true;

  stats: RendererStats = { drawCalls: 0, triangles: 0, frameTimeMs: 0, fps: 60 };
  private lastFrameTime: number = performance.now();

  constructor(options: { canvas?: HTMLCanvasElement; width?: number; height?: number; antialias?: boolean } = {}) {
    this.domElement = options.canvas || document.createElement('canvas');
    if (options.width && options.height) {
      this.setSize(options.width, options.height);
    }
    this.initGL(options.antialias ?? true);
  }

  private initGL(antialias: boolean): void {
    try {
      this.gl = this.domElement.getContext('webgl2', { antialias }) ||
                this.domElement.getContext('webgl', { antialias });
      if (this.gl) {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
      }
    } catch (e) {
      console.warn('WebGL Context creation failed:', e);
    }
  }

  setSize(width: number, height: number, updateStyle: boolean = true): void {
    this.domElement.width = width * (window.devicePixelRatio || 1);
    this.domElement.height = height * (window.devicePixelRatio || 1);
    if (updateStyle) {
      this.domElement.style.width = `${width}px`;
      this.domElement.style.height = `${height}px`;
    }
    if (this.gl) {
      this.gl.viewport(0, 0, this.domElement.width, this.domElement.height);
    }
  }

  setClearColor(color: Color | number | string, alpha: number = 1.0): void {
    this.clearColor.set(color as any);
    this.clearAlpha = alpha;
  }

  render(scene: Scene, camera: Camera): void {
    const startTime = performance.now();
    this.stats.drawCalls = 0;
    this.stats.triangles = 0;

    // Update scene graph world matrices
    scene.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);

    if (this.gl) {
      const gl = this.gl;
      if (this.autoClear) {
        gl.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, this.clearAlpha);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      }

      // Collect renderable meshes
      scene.traverseVisible((object: Object3D) => {
        if (object instanceof Mesh && object.visible) {
          this.stats.drawCalls++;
          if (object.geometry.index) {
            this.stats.triangles += object.geometry.index.count / 3;
          } else if (object.geometry.attributes['position']) {
            this.stats.triangles += object.geometry.attributes['position'].count / 3;
          }
        }
      });
    }

    const endTime = performance.now();
    this.stats.frameTimeMs = endTime - startTime;
    const delta = (endTime - this.lastFrameTime) / 1000;
    if (delta > 0) this.stats.fps = Math.round(1 / delta);
    this.lastFrameTime = endTime;
  }
}
