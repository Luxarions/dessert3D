/**
 * LXRN Ray
 * @module Ray
 */

import { Vec3 } from './Vec3.js';

class Ray {
  constructor(origin = new Vec3(), direction = new Vec3(0, 0, -1)) {
    this.isRay = true;
    this.origin = origin;
    this.direction = direction;
  }

  set(origin, direction) {
    this.origin.copy(origin);
    this.direction.copy(direction);
    return this;
  }

  clone() {
    return new Ray(this.origin.clone(), this.direction.clone());
  }

  copy(ray) {
    this.origin.copy(ray.origin);
    this.direction.copy(ray.direction);
    return this;
  }

  at(t, target = new Vec3()) {
    return target.copy(this.origin).addScaledVector(this.direction, t);
  }

  lookAt(v) {
    this.direction.copy(v).sub(this.origin).normalize();
    return this;
  }

  recast(t) {
    this.origin.addScaledVector(this.direction, t);
    return this;
  }

  closestPointToPoint(point, target = new Vec3()) {
    target.subVectors(point, this.origin);
    const directionDistance = target.dot(this.direction);

    if (directionDistance < 0) {
      return target.copy(this.origin);
    }

    return target.copy(this.origin).addScaledVector(this.direction, directionDistance);
  }

  distanceToPoint(point) {
    return Math.sqrt(this.distanceSqToPoint(point));
  }

  distanceSqToPoint(point) {
    const _v1 = new Vec3();
    const directionDistance = _v1.subVectors(point, this.origin).dot(this.direction);

    if (directionDistance < 0) {
      return this.origin.distanceToSquared(point);
    }

    _v1.copy(this.origin).addScaledVector(this.direction, directionDistance);
    return _v1.distanceToSquared(point);
  }

  distanceSqToSegment(v0, v1, optionalPointOnRay, optionalPointOnSegment) {
    const _segDir = new Vec3().subVectors(v1, v0);
    const _diff = new Vec3().subVectors(this.origin, v0);

    const segLengthSq = _segDir.lengthSq();
    const rayDirDotSegDir = this.direction.dot(_segDir);
    const _diffDotRayDir = _diff.dot(this.direction);
    const _diffDotSegDir = _diff.dot(_segDir);

    const a = 1.0;
    const b = -rayDirDotSegDir;
    const c = segLengthSq;
    const d = _diffDotRayDir;
    const e = -_diffDotSegDir;

    const det = a * c - b * b;
    let s, t;

    if (det >= 0.000001) {
      s = b * e - c * d;
      t = b * d - a * e;

      if (s >= 0) {
        if (t >= 0) {
          if (t <= det) {
            const invDet = 1.0 / det;
            s *= invDet;
            t *= invDet;
          } else {
            t = 1.0;
            s = Math.max(0.0, -(b + d));
          }
        } else {
          t = 0.0;
          s = Math.max(0.0, -d);
        }
      } else {
        if (t <= 0.0) {
          s = 0.0;
          t = Math.max(0.0, Math.min(1.0, -e / c));
        } else if (t >= det) {
          s = 0.0;
          t = 1.0;
        } else {
          s = 0.0;
          t = Math.max(0.0, Math.min(1.0, -e / c));
        }
      }
    } else {
      s = 0.0;
      t = (b > c) ? 1.0 : 0.0;
    }

    if (optionalPointOnRay) {
      optionalPointOnRay.copy(this.origin).addScaledVector(this.direction, s);
    }

    if (optionalPointOnSegment) {
      optionalPointOnSegment.copy(v0).addScaledVector(_segDir, t);
    }

    const _vRay = optionalPointOnRay || new Vec3().copy(this.origin).addScaledVector(this.direction, s);
    const _vSeg = optionalPointOnSegment || new Vec3().copy(v0).addScaledVector(_segDir, t);

    return _vRay.distanceToSquared(_vSeg);
  }

  intersectSphere(sphere, target = new Vec3()) {
    const _v1 = new Vec3();
    _v1.subVectors(sphere.center, this.origin);
    const tca = _v1.dot(this.direction);
    const d2 = _v1.dot(_v1) - tca * tca;
    const radius2 = sphere.radius * sphere.radius;

    if (d2 > radius2) return null;

    const thc = Math.sqrt(radius2 - d2);

    const t0 = tca - thc;
    const t1 = tca + thc;

    if (t0 < 0 && t1 < 0) return null;

    if (t0 < 0) return this.at(t1, target);

    return this.at(t0, target);
  }

  intersectsSphere(sphere) {
    return this.distanceSqToPoint(sphere.center) <= (sphere.radius * sphere.radius);
  }

  distanceToPlane(plane) {
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

  intersectPlane(plane, target = new Vec3()) {
    const t = this.distanceToPlane(plane);

    if (t === null) {
      return null;
    }

    return this.at(t, target);
  }

  intersectsPlane(plane) {
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

  intersectBox(box, target = new Vec3()) {
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

  intersectsBox(box) {
    return this.intersectBox(box, new Vec3()) !== null;
  }

  intersectTriangle(a, b, c, backfaceCulling, target = new Vec3()) {
    const _edge1 = new Vec3();
    const _edge2 = new Vec3();
    const _normal = new Vec3();

    _edge1.subVectors(b, a);
    _edge2.subVectors(c, a);

    _normal.crossVectors(_edge1, _edge2);

    let DdN = this.direction.dot(_normal);
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

    const _diff = new Vec3().subVectors(this.origin, a);
    const DdQxE2 = sign * this.direction.dot(new Vec3().crossVectors(_diff, _edge2));

    if (DdQxE2 < 0) {
      return null;
    }

    const DdE1xQ = sign * this.direction.dot(new Vec3().crossVectors(_edge1, _diff));

    if (DdE1xQ < 0) {
      return null;
    }

    if (DdQxE2 + DdE1xQ > DdN) {
      return null;
    }

    const QdN = -sign * _diff.dot(_normal);

    if (QdN < 0) {
      return null;
    }

    return this.at(QdN / DdN, target);
  }

  applyMat4(matrix) {
    this.origin.applyMat4(matrix);
    this.direction.transformDirection(matrix);
    return this;
  }

  equals(ray) {
    return ray.origin.equals(this.origin) && ray.direction.equals(this.direction);
  }
}

export { Ray };
