/**
 * LXRN Scene
 * Root node for 3D graphics rendering tree
 * @module core/Scene
 */

import { Object3D } from './Object3D';
import { Color } from '../math/Color';

export class Scene extends Object3D {
  type: string = 'Scene';
  background: Color | null = null;
  environment: any = null;
  fog: Fog | FogExp2 | { color: Color; near: number; far: number } | null = null;

  constructor() {
    super();
  }

  clone(): Scene {
    const scene = new Scene();
    if (this.background) scene.background = this.background.clone();
    return scene;
  }
}

export class Fog {
  color: Color;
  near: number;
  far: number;
  constructor(color: Color | number | string, near: number = 1, far: number = 1000) {
    this.color = new Color(color as any);
    this.near = near;
    this.far = far;
  }
}

export class FogExp2 {
  color: Color;
  density: number;
  constructor(color: Color | number | string, density: number = 0.0002) {
    this.color = new Color(color as any);
    this.density = density;
  }
}
