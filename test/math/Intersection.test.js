import { Intersection } from '../../src/math/Intersection.js';
import { Sphere } from '../../src/math/Sphere.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertTrue, assertFalse } from '../assert.js';

export const IntersectionTests = {
  'sphereSphere': () => {
    const s1 = new Sphere(new Vec3(0, 0, 0), 2);
    const s2 = new Sphere(new Vec3(3, 0, 0), 2);
    const s3 = new Sphere(new Vec3(10, 0, 0), 2);
    assertTrue(Intersection.sphereSphere(s1, s2));
    assertFalse(Intersection.sphereSphere(s1, s3));
  }
};
