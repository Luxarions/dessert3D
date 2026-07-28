/**
 * LXRN Camera Suite
 * @module core/Camera
 */

import { Object3D } from './Object3D';
import { Mat4 } from '../math/Mat4';

export class Camera extends Object3D {
  type: string = 'Camera';
  matrixWorldInverse: Mat4 = new Mat4();
  projectionMatrix: Mat4 = new Mat4();
  projectionMatrixInverse: Mat4 = new Mat4();

  constructor() {
    super();
  }

  updateMatrixWorld(force?: boolean): void {
    super.updateMatrixWorld(force);
    this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }

  updateProjectionMatrix(): void {}
}

export class PerspectiveCamera extends Camera {
  type: string = 'PerspectiveCamera';
  fov: number;
  aspect: number;
  near: number;
  far: number;

  constructor(fov: number = 50, aspect: number = 1, near: number = 0.1, far: number = 2000) {
    super();
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.updateProjectionMatrix();
  }

  updateProjectionMatrix(): void {
    this.projectionMatrix.makePerspective(
      (this.fov * Math.PI) / 180,
      this.aspect,
      this.near,
      this.far
    );
    this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
}

export class OrthographicCamera extends Camera {
  type: string = 'OrthographicCamera';
  left: number;
  right: number;
  top: number;
  bottom: number;
  near: number;
  far: number;

  constructor(
    left: number = -1,
    right: number = 1,
    top: number = 1,
    bottom: number = -1,
    near: number = 0.1,
    far: number = 2000
  ) {
    super();
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
    this.updateProjectionMatrix();
  }

  updateProjectionMatrix(): void {
    this.projectionMatrix.makeOrthographic(
      this.left,
      this.right,
      this.top,
      this.bottom,
      this.near,
      this.far
    );
    this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
}
