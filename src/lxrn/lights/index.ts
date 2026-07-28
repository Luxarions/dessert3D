/**
 * LXRN Lighting Suite
 * @module lights
 */

import { Object3D } from '../core/Object3D';
import { Color } from '../math/Color';
import { Vec3 } from '../math/Vec3';

export class Light extends Object3D {
  type: string = 'Light';
  color: Color;
  intensity: number;

  constructor(color: Color | number | string = 0xffffff, intensity: number = 1) {
    super();
    this.color = new Color(color as any);
    this.intensity = intensity;
  }
}

export class AmbientLight extends Light {
  type: string = 'AmbientLight';

  constructor(color: Color | number | string = 0xffffff, intensity: number = 1) {
    super(color, intensity);
  }
}

export class DirectionalLight extends Light {
  type: string = 'DirectionalLight';
  target: Object3D;
  castShadow: boolean = false;

  constructor(color: Color | number | string = 0xffffff, intensity: number = 1) {
    super(color, intensity);
    this.position.set(0, 1, 0);
    this.target = new Object3D();
  }
}

export class PointLight extends Light {
  type: string = 'PointLight';
  distance: number;
  decay: number;

  constructor(color: Color | number | string = 0xffffff, intensity: number = 1, distance: number = 0, decay: number = 2) {
    super(color, intensity);
    this.distance = distance;
    this.decay = decay;
  }
}

export class SpotLight extends Light {
  type: string = 'SpotLight';
  target: Object3D;
  distance: number;
  angle: number;
  penumbra: number;
  decay: number;

  constructor(
    color: Color | number | string = 0xffffff,
    intensity: number = 1,
    distance: number = 0,
    angle: number = Math.PI / 3,
    penumbra: number = 0,
    decay: number = 2
  ) {
    super(color, intensity);
    this.target = new Object3D();
    this.distance = distance;
    this.angle = angle;
    this.penumbra = penumbra;
    this.decay = decay;
  }
}

export class HemisphereLight extends Light {
  type: string = 'HemisphereLight';
  groundColor: Color;

  constructor(skyColor: Color | number | string = 0xffffff, groundColor: Color | number | string = 0x444444, intensity: number = 1) {
    super(skyColor, intensity);
    this.groundColor = new Color(groundColor as any);
  }
}
