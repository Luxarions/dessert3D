/**
 * LXRN Object3D
 * Primary Scene Graph Node with matrix transforms and child hierarchy
 * @module core/Object3D
 */

import { EventDispatcher } from './EventDispatcher';
import { Vec3 } from '../math/Vec3';
import { Quat } from '../math/Quat';
import { Euler } from '../math/Euler';
import { Mat4 } from '../math/Mat4';

export class Object3D extends EventDispatcher {
  static idCounter = 0;
  id: number = ++Object3D.idCounter;
  uuid: string = Math.random().toString(36).substring(2, 11);
  name: string = '';
  type: string = 'Object3D';

  parent: Object3D | null = null;
  children: Object3D[] = [];

  position: Vec3 = new Vec3(0, 0, 0);
  rotation: Euler = new Euler(0, 0, 0, 'XYZ');
  quaternion: Quat = new Quat();
  scale: Vec3 = new Vec3(1, 1, 1);

  matrix: Mat4 = new Mat4();
  matrixWorld: Mat4 = new Mat4();

  matrixAutoUpdate: boolean = true;
  matrixWorldNeedsUpdate: boolean = true;

  visible: boolean = true;
  castShadow: boolean = false;
  receiveShadow: boolean = false;
  frustumCulled: boolean = true;
  renderOrder: number = 0;
  userData: Record<string, any> = {};

  constructor() {
    super();
    // Sync rotation & quaternion
    this.rotation.onChange(() => {
      this.quaternion.setFromEuler(this.rotation, false);
    });
    this.quaternion.onChange(() => {
      this.rotation.setFromQuaternion(this.quaternion, undefined, false);
    });
  }

  add(...objects: Object3D[]): this {
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      if (object === this) {
        console.error("Object3D.add: An object can't be added as a child of itself.", object);
        continue;
      }
      if (object.parent !== null) {
        object.parent.remove(object);
      }
      object.parent = this;
      this.children.push(object);
      this.dispatchEvent({ type: 'childAdded', child: object });
    }
    return this;
  }

  remove(...objects: Object3D[]): this {
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      const index = this.children.indexOf(object);
      if (index !== -1) {
        object.parent = null;
        this.children.splice(index, 1);
        this.dispatchEvent({ type: 'childRemoved', child: object });
      }
    }
    return this;
  }

  traverse(callback: (object: Object3D) => void): void {
    callback(this);
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].traverse(callback);
    }
  }

  traverseVisible(callback: (object: Object3D) => void): void {
    if (!this.visible) return;
    callback(this);
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].traverseVisible(callback);
    }
  }

  getObjectByName(name: string): Object3D | undefined {
    if (this.name === name) return this;
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      const res = child.getObjectByName(name);
      if (res) return res;
    }
    return undefined;
  }

  updateMatrix(): void {
    this.matrix.compose(this.position, this.quaternion, this.scale);
    this.matrixWorldNeedsUpdate = true;
  }

  updateMatrixWorld(force: boolean = false): void {
    if (this.matrixAutoUpdate) this.updateMatrix();

    if (this.matrixWorldNeedsUpdate || force) {
      if (this.parent === null) {
        this.matrixWorld.copy(this.matrix);
      } else {
        this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
      }
      this.matrixWorldNeedsUpdate = false;
      force = true;
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].updateMatrixWorld(force);
    }
  }

  getWorldPosition(target: Vec3 = new Vec3()): Vec3 {
    this.updateMatrixWorld(true);
    return target.setFromMatrixPosition(this.matrixWorld);
  }

  getWorldQuaternion(target: Quat = new Quat()): Quat {
    this.updateMatrixWorld(true);
    const position = new Vec3();
    const scale = new Vec3();
    this.matrixWorld.decompose(position, target, scale);
    return target;
  }

  getWorldScale(target: Vec3 = new Vec3()): Vec3 {
    this.updateMatrixWorld(true);
    const position = new Vec3();
    const quaternion = new Quat();
    this.matrixWorld.decompose(position, quaternion, target);
    return target;
  }

  lookAt(x: number | Vec3, y?: number, z?: number): void {
    let target = new Vec3();
    if (x instanceof Vec3) {
      target.copy(x);
    } else if (y !== undefined && z !== undefined) {
      target.set(x, y, z);
    }

    const m1 = new Mat4();
    m1.lookAt(this.position, target, new Vec3(0, 1, 0));
    this.quaternion.setFromRotationMatrix(m1);
    this.rotation.setFromQuaternion(this.quaternion);
  }

  raycast(raycaster: any, intersects: any[]): void {}
}
