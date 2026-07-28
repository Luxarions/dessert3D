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
  fog: { color: Color; near: number; far: number } | null = null;

  constructor() {
    super();
  }

  clone(): Scene {
    const scene = new Scene();
    if (this.background) scene.background = this.background.clone();
    return scene;
  }
}
