import { Sphere } from '../../src/math/Sphere.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertTrue, assertFalse, assertEqual } from '../assert.js';

export const SphereTests = {
  'containsPoint and distanceToPoint': () => {
    const s = new Sphere(new Vec3(0, 0, 0), 5);
    assertTrue(s.containsPoint(new Vec3(3, 4, 0)));
    assertFalse(s.containsPoint(new Vec3(6, 0, 0)));
    assertEqual(s.distanceToPoint(new Vec3(8, 0, 0)), 3);
  },
  'intersectsSphere': () => {
    const s1 = new Sphere(new Vec3(0, 0, 0), 2);
    const s2 = new Sphere(new Vec3(3, 0, 0), 2);
    const s3 = new Sphere(new Vec3(10, 0, 0), 2);
    assertTrue(s1.intersectsSphere(s2));
    assertFalse(s1.intersectsSphere(s3));
  }
};
