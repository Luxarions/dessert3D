import { Vec3 } from '../../src/math/Vec3.js';
import { assertEqual, assertAlmostEqual, assertVec3Equal } from '../assert.js';

export const Vec3Tests = {
  'constructor and components': () => {
    const v = new Vec3(1, 2, 3);
    assertEqual(v.x, 1);
    assertEqual(v.y, 2);
    assertEqual(v.z, 3);
  },
  'cross product': () => {
    const x = new Vec3(1, 0, 0);
    const y = new Vec3(0, 1, 0);
    const z = new Vec3();
    z.crossVectors(x, y);
    assertVec3Equal(z, new Vec3(0, 0, 1));
  },
  'distance and distanceToSquared': () => {
    const v1 = new Vec3(0, 0, 0);
    const v2 = new Vec3(0, 3, 4);
    assertEqual(v1.distanceTo(v2), 5);
    assertEqual(v1.distanceToSquared(v2), 25);
  },
  'lerp': () => {
    const a = new Vec3(0, 0, 0);
    const b = new Vec3(10, 20, 30);
    a.lerp(b, 0.5);
    assertVec3Equal(a, new Vec3(5, 10, 15));
  }
};
