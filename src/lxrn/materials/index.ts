/**
 * LXRN Material Suite
 * @module materials
 */

import { Material } from './Material';
import { Color } from '../math/Color';

export class BasicMaterial extends Material {
  constructor(parameters: { color?: Color | number | string; wireframe?: boolean; map?: any; opacity?: number } = {}) {
    super();
    this.type = 'BasicMaterial';
    if (parameters.color !== undefined) this.color.set(parameters.color);
    if (parameters.wireframe !== undefined) this.wireframe = parameters.wireframe;
    if (parameters.map !== undefined) this.map = parameters.map;
    if (parameters.opacity !== undefined) {
      this.opacity = parameters.opacity;
      if (this.opacity < 1) this.transparent = true;
    }
  }
}

export class LambertMaterial extends Material {
  emissive: Color = new Color(0, 0, 0);

  constructor(parameters: { color?: Color | number | string; emissive?: Color | number | string; wireframe?: boolean } = {}) {
    super();
    this.type = 'LambertMaterial';
    if (parameters.color !== undefined) this.color.set(parameters.color);
    if (parameters.emissive !== undefined) this.emissive.set(parameters.emissive);
    if (parameters.wireframe !== undefined) this.wireframe = parameters.wireframe;
  }
}

export class PhongMaterial extends Material {
  specular: Color = new Color(0x111111);
  shininess: number = 30;
  emissive: Color = new Color(0, 0, 0);

  constructor(parameters: {
    color?: Color | number | string;
    specular?: Color | number | string;
    shininess?: number;
    wireframe?: boolean;
  } = {}) {
    super();
    this.type = 'PhongMaterial';
    if (parameters.color !== undefined) this.color.set(parameters.color);
    if (parameters.specular !== undefined) this.specular.set(parameters.specular);
    if (parameters.shininess !== undefined) this.shininess = parameters.shininess;
    if (parameters.wireframe !== undefined) this.wireframe = parameters.wireframe;
  }
}

export class StandardMaterial extends Material {
  roughness: number = 0.5;
  metalness: number = 0.5;
  emissive: Color = new Color(0, 0, 0);
  emissiveIntensity: number = 1.0;
  normalMap: any = null;
  roughnessMap: any = null;
  metalnessMap: any = null;
  envMap: any = null;

  constructor(parameters: {
    color?: Color | number | string;
    roughness?: number;
    metalness?: number;
    wireframe?: boolean;
  } = {}) {
    super();
    this.type = 'StandardMaterial';
    if (parameters.color !== undefined) this.color.set(parameters.color);
    if (parameters.roughness !== undefined) this.roughness = parameters.roughness;
    if (parameters.metalness !== undefined) this.metalness = parameters.metalness;
    if (parameters.wireframe !== undefined) this.wireframe = parameters.wireframe;
  }
}

export class ShaderMaterial extends Material {
  vertexShader: string = '';
  fragmentShader: string = '';
  uniforms: Record<string, { value: any }> = {};

  constructor(parameters: {
    vertexShader?: string;
    fragmentShader?: string;
    uniforms?: Record<string, { value: any }>;
  } = {}) {
    super();
    this.type = 'ShaderMaterial';
    if (parameters.vertexShader) this.vertexShader = parameters.vertexShader;
    if (parameters.fragmentShader) this.fragmentShader = parameters.fragmentShader;
    if (parameters.uniforms) this.uniforms = parameters.uniforms;
  }
}

export class LineBasicMaterial extends Material {
  linewidth: number = 1;

  constructor(parameters: { color?: Color | number | string; linewidth?: number } = {}) {
    super();
    this.type = 'LineBasicMaterial';
    if (parameters.color !== undefined) this.color.set(parameters.color);
    if (parameters.linewidth !== undefined) this.linewidth = parameters.linewidth;
  }
}

export class PointsMaterial extends Material {
  size: number = 1;
  sizeAttenuation: boolean = true;

  constructor(parameters: { color?: Color | number | string; size?: number; sizeAttenuation?: boolean } = {}) {
    super();
    this.type = 'PointsMaterial';
    if (parameters.color !== undefined) this.color.set(parameters.color);
    if (parameters.size !== undefined) this.size = parameters.size;
    if (parameters.sizeAttenuation !== undefined) this.sizeAttenuation = parameters.sizeAttenuation;
  }
}
