/**
 * LXRN Intersection
 * @module Intersection
 */

import { Vec3 } from './Vec3.js';
import { Bound3 } from './Bound3.js';
import { Sphere } from './Sphere.js';
import { Plane } from './Plane.js';
import { Ray } from './Ray.js';
import { Triangle } from './Triangle.js';
import { Line3 } from './Line3.js';

class Intersection {
  static sphereSphere(s1, s2) {
    return s1.intersectsSphere(s2);
  }

  static sphereBox(s, b) {
    return b.intersectsSphere(s);
  }

  static spherePlane(s, p) {
    return s.intersectsPlane(p);
  }

  static boxBox(b1, b2) {
    return b1.intersectsBox(b2);
  }

  static boxPlane(b, p) {
    return b.intersectsPlane(p);
  }

  static raySphere(r, s, target = new Vec3()) {
    return r.intersectSphere(s, target);
  }

  static rayBox(r, b, target = new Vec3()) {
    return r.intersectBox(b, target);
  }

  static rayPlane(r, p, target = new Vec3()) {
    return r.intersectPlane(p, target);
  }

  static rayTriangle(r, a, b, c, backfaceCulling = true, target = new Vec3()) {
    return r.intersectTriangle(a, b, c, backfaceCulling, target);
  }

  static linePlane(l, p, target = new Vec3()) {
    return p.intersectLine(l, target);
  }
}

export { Intersection };
