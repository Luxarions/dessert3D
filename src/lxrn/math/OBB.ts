/**
 * LXRN OBB (Oriented Bounding Box)
 * @module OBB
 */

import { Vec3 } from './Vec3';
import { Mat3 } from './Mat3';
import { Mat4 } from './Mat4';
import { Quat } from './Quat';
import { Bound3 } from './Bound3';
import { clamp } from './MathUtils';

export class OBB {
  public center: Vec3;
  public halfSizes: Vec3;
  public rotation: Mat3;

  constructor(center: Vec3 = new Vec3(), halfSizes: Vec3 = new Vec3(1, 1, 1), rotation: Mat3 = new Mat3()) {
    this.center = center;
    this.halfSizes = halfSizes;
    this.rotation = rotation;
  }

  set(center: Vec3, halfSizes: Vec3, rotation: Mat3): this {
    this.center.copy(center);
    this.halfSizes.copy(halfSizes);
    this.rotation.copy(rotation);
    return this;
  }

  copy(obb: OBB): this {
    this.center.copy(obb.center);
    this.halfSizes.copy(obb.halfSizes);
    this.rotation.copy(obb.rotation);
    return this;
  }

  clone(): OBB {
    return new OBB(this.center.clone(), this.halfSizes.clone(), this.rotation.clone());
  }

  fromBound3(box: Bound3): this {
    box.getCenter(this.center);
    box.getSize(this.halfSizes).multiplyScalar(0.5);
    this.rotation.identity();
    return this;
  }

  clampPoint(point: Vec3, result: Vec3 = new Vec3()): Vec3 {
    const d = point.clone().sub(this.center);
    result.copy(this.center);

    const basis = [new Vec3(), new Vec3(), new Vec3()];
    this.rotation.extractBasis(basis[0], basis[1], basis[2]);

    const half = [this.halfSizes.x, this.halfSizes.y, this.halfSizes.z];

    for (let i = 0; i < 3; i++) {
      let dist = d.dot(basis[i]);
      dist = clamp(dist, -half[i], half[i]);
      result.add(basis[i].multiplyScalar(dist));
    }

    return result;
  }

  containsPoint(point: Vec3): boolean {
    const d = point.clone().sub(this.center);
    const basis = [new Vec3(), new Vec3(), new Vec3()];
    this.rotation.extractBasis(basis[0], basis[1], basis[2]);

    const half = [this.halfSizes.x, this.halfSizes.y, this.halfSizes.z];

    for (let i = 0; i < 3; i++) {
      const dist = Math.abs(d.dot(basis[i]));
      if (dist > half[i]) return false;
    }

    return true;
  }

  intersectsOBB(obb: OBB): boolean {
    // Separating Axis Theorem (SAT) for 3D OBBs
    const R = new Mat3();
    const AbsR = new Mat3();

    const aBasis = [new Vec3(), new Vec3(), new Vec3()];
    const bBasis = [new Vec3(), new Vec3(), new Vec3()];
    this.rotation.extractBasis(aBasis[0], aBasis[1], aBasis[2]);
    obb.rotation.extractBasis(bBasis[0], bBasis[1], bBasis[2]);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const val = aBasis[i].dot(bBasis[j]);
        R.elements[i * 3 + j] = val;
        AbsR.elements[i * 3 + j] = Math.abs(val) + 1e-6;
      }
    }

    const tLocal = obb.center.clone().sub(this.center);
    const t = new Vec3(
      tLocal.dot(aBasis[0]),
      tLocal.dot(aBasis[1]),
      tLocal.dot(aBasis[2])
    );

    const aHalf = [this.halfSizes.x, this.halfSizes.y, this.halfSizes.z];
    const bHalf = [obb.halfSizes.x, obb.halfSizes.y, obb.halfSizes.z];

    // Test axes L = A0, A1, A2
    for (let i = 0; i < 3; i++) {
      const ra = aHalf[i];
      const rb = bHalf[0] * AbsR.elements[i * 3 + 0] + bHalf[1] * AbsR.elements[i * 3 + 1] + bHalf[2] * AbsR.elements[i * 3 + 2];
      if (Math.abs(t.getComponent(i)) > ra + rb) return false;
    }

    // Test axes L = B0, B1, B2
    for (let i = 0; i < 3; i++) {
      const ra = aHalf[0] * AbsR.elements[0 * 3 + i] + aHalf[1] * AbsR.elements[1 * 3 + i] + aHalf[2] * AbsR.elements[2 * 3 + i];
      const rb = bHalf[i];
      const tComp = t.x * R.elements[0 * 3 + i] + t.y * R.elements[1 * 3 + i] + t.z * R.elements[2 * 3 + i];
      if (Math.abs(tComp) > ra + rb) return false;
    }

    return true;
  }

  applyMat4(m: Mat4): this {
    const position = new Vec3();
    const quaternion = new Quat();
    const scale = new Vec3();

    m.decompose(position, quaternion, scale);

    this.center.applyMat4(m);
    this.halfSizes.multiply(scale);

    const rotMat = new Mat3().setFromMatrix4(m);
    this.rotation.premultiply(rotMat);

    return this;
  }
}
