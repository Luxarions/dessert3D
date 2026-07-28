/**
 * LXRN Raycaster
 * 3D World raycasting for object selection, picking & physics collisions
 * @module core/Raycaster
 */

import { Ray } from '../math/Ray';
import { Vec3 } from '../math/Vec3';
import { Object3D } from './Object3D';
import { Camera } from './Camera';
import { IntersectionResult } from './Mesh';

export class Raycaster {
  ray: Ray;
  near: number;
  far: number;
  camera: Camera | null = null;

  constructor(origin: Vec3 = new Vec3(), direction: Vec3 = new Vec3(0, 0, -1), near: number = 0, far: number = Infinity) {
    this.ray = new Ray(origin, direction);
    this.near = near;
    this.far = far;
  }

  set(origin: Vec3, direction: Vec3): void {
    this.ray.set(origin, direction);
  }

  setFromCamera(coords: { x: number; y: number }, camera: Camera): void {
    this.camera = camera;
    if ((camera as any).isPerspectiveCamera || camera.type === 'PerspectiveCamera') {
      this.ray.origin.setFromMatrixPosition(camera.matrixWorld);
      this.ray.direction
        .set(coords.x, coords.y, 0.5)
        .unproject(camera)
        .sub(this.ray.origin)
        .normalize();
    } else {
      this.ray.origin
        .set(coords.x, coords.y, (camera as any).near)
        .unproject(camera);
      this.ray.direction.set(0, 0, -1).transformDirection(camera.matrixWorld);
    }
  }

  intersectObject(object: Object3D, recursive: boolean = true, intersects: IntersectionResult[] = []): IntersectionResult[] {
    if (object.visible) {
      object.raycast(this, intersects);

      if (recursive) {
        const children = object.children;
        for (let i = 0; i < children.length; i++) {
          this.intersectObject(children[i], true, intersects);
        }
      }
    }

    intersects.sort((a, b) => a.distance - b.distance);
    return intersects;
  }

  intersectObjects(objects: Object3D[], recursive: boolean = true, intersects: IntersectionResult[] = []): IntersectionResult[] {
    for (let i = 0; i < objects.length; i++) {
      this.intersectObject(objects[i], recursive, intersects);
    }
    intersects.sort((a, b) => a.distance - b.distance);
    return intersects;
  }
}
