/**
 * LXRN Ray
 * @module Ray
 */

import { Vec3 } from './Vec3';
import { Sphere } from './Sphere';
import { Plane } from './Plane';
import { Bound3 } from './Bound3';
import { Mat4 } from './Mat4';

export class Ray {
  public origin: Vec3;
  public direction: Vec3;

  constructor(origin: Vec3 = new Vec3(), direction: Vec3 = new Vec3(0, 0, -1)) {
    this.origin = origin;
    this.direction = direction;
  }

  set(origin: Vec3, direction: Vec3): this {
    this.origin.copy(origin);
    this.direction.copy(direction);
    return this;
  }

  clone(): Ray {
    return new Ray(this.origin.clone(), this.direction.clone());
  }

  copy(ray: Ray): this {
    this.origin.copy(ray.origin);
    this.direction.copy(ray.direction);
    return this;
  }

  at(t: number, target: Vec3 = new Vec3()): Vec3 {
    return target.copy(this.direction).multiplyScalar(t).add(this.origin);
  }

  lookAt(v: Vec3): this {
    this.direction.copy(v).sub(this.origin).normalize();
    return this;
  }

  recast(t: number): this {
    this.origin.addScaledVector(this.direction, t);
    return this;
  }

  closestPointToPoint(point: Vec3, target: Vec3 = new Vec3()): Vec3 {
    target.subVectors(point, this.origin);
    const directionDistance = target.dot(this.direction);

    if (directionDistance < 0) {
      return target.copy(this.origin);
    }

    return target.copy(this.direction).multiplyScalar(directionDistance).add(this.origin);
  }

  distanceToPoint(point: Vec3): number {
    return Math.sqrt(this.distanceSqToPoint(point));
  }

  distanceSqToPoint(point: Vec3): number {
    const v1 = new Vec3().subVectors(point, this.origin);
    const directionDistance = v1.dot(this.direction);

    if (directionDistance < 0) {
      return this.origin.distanceToSquared(point);
    }

    v1.copy(this.direction).multiplyScalar(directionDistance).add(this.origin);
    return v1.distanceToSquared(point);
  }

  distanceSqToSegment(v0: Vec3, v1: Vec3, optionalPointOnRay?: Vec3, optionalPointOnSegment?: Vec3): number {
    const segCenter = new Vec3().addVectors(v0, v1).multiplyScalar(0.5);
    const segDir = new Vec3().subVectors(v1, v0).normalize();
    const segExtent = v0.distanceTo(v1) * 0.5;

    const diff = new Vec3().subVectors(this.origin, segCenter);
    const a01 = -this.direction.dot(segDir);
    const b0 = diff.dot(this.direction);
    const b1 = -diff.dot(segDir);
    const c = diff.lengthSq();
    const det = Math.abs(1 - a01 * a01);

    let s0, s1, sqrDist, extDet;

    if (det > 0) {
      s0 = a01 * b1 - b0;
      s1 = a01 * b0 - b1;
      extDet = segExtent * det;

      if (s1 >= -extDet) {
        if (s1 <= extDet) {
          const invDet = 1 / det;
          s0 *= invDet;
          s1 *= invDet;
          sqrDist = s0 * (s0 + a01 * s1 + 2 * b0) + s1 * (a01 * s0 + s1 + 2 * b1) + c;
        } else {
          s1 = segExtent;
          s0 = Math.max(0, -(a01 * s1 + b0));
          sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
        }
      } else {
        s1 = -segExtent;
        s0 = Math.max(0, -(a01 * s1 + b0));
        sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
      }
    } else {
      s1 = (a01 > 0) ? -segExtent : segExtent;
      s0 = Math.max(0, -(a01 * s1 + b0));
      sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
    }

    if (optionalPointOnRay) {
      optionalPointOnRay.copy(this.direction).multiplyScalar(s0).add(this.origin);
    }

    if (optionalPointOnSegment) {
      optionalPointOnSegment.copy(segDir).multiplyScalar(s1).add(segCenter);
    }

    return Math.max(0, sqrDist);
  }

  intersectSphere(sphere: Sphere, target: Vec3 = new Vec3()): Vec3 | null {
    const v1 = new Vec3().subVectors(sphere.center, this.origin);
    const tca = v1.dot(this.direction);
    const d2 = v1.dot(v1) - tca * tca;
    const radius2 = sphere.radius * sphere.radius;

    if (d2 > radius2) return null;

    const thc = Math.sqrt(radius2 - d2);
    const t0 = tca - thc;
    const t1 = tca + thc;

    if (t0 < 0 && t1 < 0) return null;

    if (t0 < 0) return this.at(t1, target);

    return this.at(t0, target);
  }

  intersectsSphere(sphere: Sphere): boolean {
    return this.distanceSqToPoint(sphere.center) <= (sphere.radius * sphere.radius);
  }

  distanceToPlane(plane: Plane): number | null {
    const denominator = plane.normal.dot(this.direction);

    if (denominator === 0) {
      if (plane.distanceToPoint(this.origin) === 0) {
        return 0;
      }
      return null;
    }

    const t = -(this.origin.dot(plane.normal) + plane.constant) / denominator;
    return t >= 0 ? t : null;
  }

  intersectPlane(plane: Plane, target: Vec3 = new Vec3()): Vec3 | null {
    const t = this.distanceToPlane(plane);

    if (t === null) {
      return null;
    }

    return this.at(t, target);
  }

  intersectsPlane(plane: Plane): boolean {
    const distToPoint = plane.distanceToPoint(this.origin);

    if (distToPoint === 0) {
      return true;
    }

    const denominator = plane.normal.dot(this.direction);

    if (denominator * distToPoint < 0) {
      return true;
    }

    return false;
  }

  intersectBox(box: Bound3, target: Vec3 = new Vec3()): Vec3 | null {
    let tmin, tmax, tymin, tymax, tzmin, tzmax;

    const invdirx = 1 / this.direction.x,
      invdiry = 1 / this.direction.y,
      invdirz = 1 / this.direction.z;

    const origin = this.origin;

    if (invdirx >= 0) {
      tmin = (box.min.x - origin.x) * invdirx;
      tmax = (box.max.x - origin.x) * invdirx;
    } else {
      tmin = (box.max.x - origin.x) * invdirx;
      tmax = (box.min.x - origin.x) * invdirx;
    }

    if (invdiry >= 0) {
      tymin = (box.min.y - origin.y) * invdiry;
      tymax = (box.max.y - origin.y) * invdiry;
    } else {
      tymin = (box.max.y - origin.y) * invdiry;
      tymax = (box.min.y - origin.y) * invdiry;
    }

    if ((tmin > tymax) || (tymin > tmax)) return null;

    if (tymin > tmin || isNaN(tmin)) tmin = tymin;
    if (tymax < tmax || isNaN(tmax)) tmax = tymax;

    if (invdirz >= 0) {
      tzmin = (box.min.z - origin.z) * invdirz;
      tzmax = (box.max.z - origin.z) * invdirz;
    } else {
      tzmin = (box.max.z - origin.z) * invdirz;
      tzmax = (box.min.z - origin.z) * invdirz;
    }

    if ((tmin > tzmax) || (tzmin > tmax)) return null;

    if (tzmin > tmin || tmin !== tmin) tmin = tzmin;
    if (tzmax < tmax || tmax !== tmax) tmax = tzmax;

    if (tmax < 0) return null;

    return this.at(tmin >= 0 ? tmin : tmax, target);
  }

  intersectsBox(box: Bound3): boolean {
    return this.intersectBox(box) !== null;
  }

  intersectTriangle(a: Vec3, b: Vec3, c: Vec3, backfaceCulling: boolean, target: Vec3 = new Vec3()): Vec3 | null {
    const edge1 = new Vec3().subVectors(b, a);
    const edge2 = new Vec3().subVectors(c, a);
    const normal = new Vec3().crossVectors(edge1, edge2);

    let DdN = this.direction.dot(normal);
    let sign;

    if (DdN > 0) {
      if (backfaceCulling) return null;
      sign = 1;
    } else if (DdN < 0) {
      sign = -1;
      DdN = -DdN;
    } else {
      return null;
    }

    const diff = new Vec3().subVectors(this.origin, a);
    const DdQxE2 = sign * this.direction.dot(new Vec3().crossVectors(diff, edge2));

    if (DdQxE2 < 0) return null;

    const DdE1xQ = sign * this.direction.dot(new Vec3().crossVectors(edge1, diff));

    if (DdE1xQ < 0) return null;

    if (DdQxE2 + DdE1xQ > DdN) return null;

    const QdN = -sign * diff.dot(normal);

    if (QdN < 0) return null;

    return this.at(QdN / DdN, target);
  }

  applyMat4(m: Mat4): this {
    this.origin.applyMat4(m);
    this.direction.transformDirection(m);
    return this;
  }

  equals(ray: Ray): boolean {
    return ray.origin.equals(this.origin) && ray.direction.equals(this.direction);
  }
}
