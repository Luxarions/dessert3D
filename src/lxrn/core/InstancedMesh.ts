/**
 * LXRN InstancedMesh
 * High performance hardware-instanced mesh rendering
 * @module core/InstancedMesh
 */

import { Mesh } from './Mesh';
import { BufferGeometry } from './BufferGeometry';
import { Material } from '../materials/Material';
import { Mat4 } from '../math/Mat4';
import { Color } from '../math/Color';
import { BufferAttribute } from './BufferAttribute';

export class InstancedMesh extends Mesh {
  type: string = 'InstancedMesh';
  count: number;
  instanceMatrix: BufferAttribute;
  instanceColor: BufferAttribute | null = null;

  constructor(geometry: BufferGeometry, material: Material, count: number) {
    super(geometry, material);
    this.count = count;
    this.instanceMatrix = new BufferAttribute(new Float32Array(count * 16), 16);
  }

  setMatrixAt(index: number, matrix: Mat4): void {
    const array = this.instanceMatrix.array;
    matrix.toArray(array as Float32Array, index * 16);
    this.instanceMatrix.needsUpdate = true;
  }

  getMatrixAt(index: number, matrix: Mat4): Mat4 {
    const array = this.instanceMatrix.array;
    return matrix.fromArray(array as Float32Array, index * 16);
  }

  setColorAt(index: number, color: Color): void {
    if (this.instanceColor === null) {
      this.instanceColor = new BufferAttribute(new Float32Array(this.count * 3), 3);
    }
    this.instanceColor.setXYZ(index, color.r, color.g, color.b);
    this.instanceColor.needsUpdate = true;
  }
}
