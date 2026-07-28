/**
 * LXRN Mesh
 * Renderable 3D Object combining geometry and materials
 * @module core/Mesh
 */

import { Object3D } from './Object3D';
import { BufferGeometry } from './BufferGeometry';
import { Material } from '../materials/Material';
import { Ray } from '../math/Ray';
import { Triangle } from '../math/Triangle';
import { Vec3 } from '../math/Vec3';

export interface IntersectionResult {
  distance: number;
  point: Vec3;
  face?: { a: number; b: number; c: number; normal: Vec3 };
  faceIndex?: number;
  object: Object3D;
}

export class Mesh extends Object3D {
  type: string = 'Mesh';
  geometry: BufferGeometry;
  material: Material;

  constructor(geometry: BufferGeometry = new BufferGeometry(), material: Material = new Material()) {
    super();
    this.geometry = geometry;
    this.material = material;
  }

  raycast(raycaster: { ray: Ray }, intersects: IntersectionResult[]): void {
    const geometry = this.geometry;
    const worldMatrix = this.matrixWorld;

    if (!geometry.boundingSphere) geometry.computeBoundingSphere();

    // Check bounding sphere in world space first
    const sphere = geometry.boundingSphere!.clone();
    sphere.applyMat4(worldMatrix);

    if (!raycaster.ray.intersectsSphere(sphere)) return;

    // Transform ray to local object space
    const inverseMatrix = worldMatrix.clone().invert();
    const localRay = raycaster.ray.clone().applyMat4(inverseMatrix);

    if (geometry.boundingBox === null) geometry.computeBoundingBox();

    if (geometry.boundingBox && !localRay.intersectsBox(geometry.boundingBox)) return;

    // Raycast triangles
    const position = geometry.getAttribute('position');
    if (!position) return;

    const index = geometry.index;
    const vA = new Vec3(), vB = new Vec3(), vC = new Vec3();
    const intersectionPoint = new Vec3();

    if (index) {
      for (let i = 0, l = index.count; i < l; i += 3) {
        const a = index.getX(i);
        const b = index.getX(i + 1);
        const c = index.getX(i + 2);

        vA.set(position.getX(a), position.getY(a), position.getZ(a));
        vB.set(position.getX(b), position.getY(b), position.getZ(b));
        vC.set(position.getX(c), position.getY(c), position.getZ(c));

        if (localRay.intersectTriangle(vA, vB, vC, false, intersectionPoint)) {
          const worldPoint = intersectionPoint.clone().applyMat4(worldMatrix);
          const distance = raycaster.ray.origin.distanceTo(worldPoint);

          const triangle = new Triangle(vA, vB, vC);
          const normal = new Vec3();
          triangle.getNormal(normal);
          normal.transformDirection(worldMatrix);

          intersects.push({
            distance,
            point: worldPoint,
            face: { a, b, c, normal },
            faceIndex: Math.floor(i / 3),
            object: this
          });
        }
      }
    }
  }

  clone(): Mesh {
    return new Mesh(this.geometry, this.material);
  }
}
