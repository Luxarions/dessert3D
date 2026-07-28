/**
 * LXRN Material
 * Base material class for shaders & rendering
 * @module materials/Material
 */

import { Color } from '../math/Color';

export class Material {
  static idCounter = 0;
  id: number = ++Material.idCounter;
  uuid: string = Math.random().toString(36).substring(2, 11);
  name: string = '';
  type: string = 'Material';

  opacity: number = 1.0;
  transparent: boolean = false;
  wireframe: boolean = false;
  wireframeLinewidth: number = 1;
  visible: boolean = true;

  side: number = 0; // 0 = FRONT, 1 = BACK, 2 = DOUBLE
  depthTest: boolean = true;
  depthWrite: boolean = true;
  blending: number = 1; // 1 = NORMAL_BLENDING

  color: Color = new Color(1, 1, 1);
  map: any = null;
  needsUpdate: boolean = true;

  constructor() {}

  dispose(): void {
    // Release shader resources if any
  }
}
