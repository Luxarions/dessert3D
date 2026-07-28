import { Ray } from '../../src/math/Ray.js';
import { Sphere } from '../../src/math/Sphere.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertEqual, assertTrue, assertFalse } from '../assert.js';

export const RayTests = {
  'at': () => {
    const r = new Ray(new Vec3(0, 0, 0), new Vec3(1, 0, 0));
    const pt = r.at(10);
    assertEqual(pt.x, 10);
    assertEqual(pt.y, 0);
  },
  'intersectSphere': () => {
    const r = new Ray(new Vec3(0, 0, -10), new Vec3(0, 0, 1));
    const s = new Sphere(new Vec3(0, 0, 0), 2);
    const hit = r.intersectSphere(s);
    assertTrue(hit !== null);
    assertEqual(hit.z, -2);
  }
};
