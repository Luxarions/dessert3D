/**
 * LXRN BufferGeometry
 * Geometry data container with attributes, bounding volumes, and normal calculations
 * @module core/BufferGeometry
 */

import { BufferAttribute } from './BufferAttribute';
import { Bound3 } from '../math/Bound3';
import { Sphere } from '../math/Sphere';
import { Vec3 } from '../math/Vec3';

export class BufferGeometry {
  static idCounter = 0;
  id: number = ++BufferGeometry.idCounter;
  name: string = '';
  attributes: Record<string, BufferAttribute> = {};
  index: BufferAttribute | null = null;
  boundingBox: Bound3 | null = null;
  boundingSphere: Sphere | null = null;
  drawRange = { start: 0, count: Infinity };

  setAttribute(name: string, attribute: BufferAttribute): this {
    this.attributes[name] = attribute;
    return this;
  }

  getAttribute(name: string): BufferAttribute | undefined {
    return this.attributes[name];
  }

  removeAttribute(name: string): this {
    delete this.attributes[name];
    return this;
  }

  setIndex(index: BufferAttribute | number[]): this {
    if (Array.isArray(index)) {
      this.index = new BufferAttribute(new Uint32Array(index), 1);
    } else {
      this.index = index;
    }
    return this;
  }

  computeBoundingBox(): void {
    if (!this.boundingBox) this.boundingBox = new Bound3();

    const position = this.attributes['position'];
    if (position) {
      this.boundingBox.setFromBufferAttribute(position);
    } else {
      this.boundingBox.makeEmpty();
    }
  }

  computeBoundingSphere(): void {
    if (!this.boundingSphere) this.boundingSphere = new Sphere();

    const position = this.attributes['position'];
    if (position) {
      const center = new Vec3();
      this.computeBoundingBox();
      if (this.boundingBox) {
        this.boundingBox.getCenter(center);
      }

      let maxRadiusSq = 0;
      const v = new Vec3();
      for (let i = 0, l = position.count; i < l; i++) {
        v.set(position.getX(i), position.getY(i), position.getZ(i));
        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(v));
      }

      this.boundingSphere.set(center, Math.sqrt(maxRadiusSq));
    }
  }

  computeVertexNormals(): void {
    const position = this.attributes['position'];
    if (!position) return;

    let normal = this.attributes['normal'];
    if (!normal || normal.count !== position.count) {
      normal = new BufferAttribute(new Float32Array(position.count * 3), 3);
      this.setAttribute('normal', normal);
    } else {
      normal.array.fill(0);
    }

    const pA = new Vec3(), pB = new Vec3(), pC = new Vec3();
    const cb = new Vec3(), ab = new Vec3();

    if (this.index) {
      const index = this.index;
      for (let i = 0, l = index.count; i < l; i += 3) {
        const a = index.getX(i);
        const b = index.getX(i + 1);
        const c = index.getX(i + 2);

        pA.set(position.getX(a), position.getY(a), position.getZ(a));
        pB.set(position.getX(b), position.getY(b), position.getZ(b));
        pC.set(position.getX(c), position.getY(c), position.getZ(c));

        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab);

        normal.setXYZ(a, normal.getX(a) + cb.x, normal.getY(a) + cb.y, normal.getZ(a) + cb.z);
        normal.setXYZ(b, normal.getX(b) + cb.x, normal.getY(b) + cb.y, normal.getZ(b) + cb.z);
        normal.setXYZ(c, normal.getX(c) + cb.x, normal.getY(c) + cb.y, normal.getZ(c) + cb.z);
      }
    } else {
      for (let i = 0, l = position.count; i < l; i += 3) {
        pA.set(position.getX(i), position.getY(i), position.getZ(i));
        pB.set(position.getX(i + 1), position.getY(i + 1), position.getZ(i + 1));
        pC.set(position.getX(i + 2), position.getY(i + 2), position.getZ(i + 2));

        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab);

        normal.setXYZ(i, cb.x, cb.y, cb.z);
        normal.setXYZ(i + 1, cb.x, cb.y, cb.z);
        normal.setXYZ(i + 2, cb.x, cb.y, cb.z);
      }
    }

    // Normalize all normals
    const normVec = new Vec3();
    for (let i = 0, l = normal.count; i < l; i++) {
      normVec.set(normal.getX(i), normal.getY(i), normal.getZ(i)).normalize();
      normal.setXYZ(i, normVec.x, normVec.y, normVec.z);
    }

    normal.needsUpdate = true;
  }
}
