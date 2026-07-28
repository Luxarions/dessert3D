import { Plane } from '../../src/math/Plane.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertEqual, assertAlmostEqual } from '../assert.js';

export const PlaneTests = {
  'distanceToPoint': () => {
    const p = new Plane(new Vec3(0, 1, 0), 0);
    assertEqual(p.distanceToPoint(new Vec3(0, 5, 0)), 5);
    assertEqual(p.distanceToPoint(new Vec3(0, -3, 0)), -3);
  },
  'projectPoint': () => {
    const p = new Plane(new Vec3(0, 1, 0), 0);
    const proj = p.projectPoint(new Vec3(5, 10, 5));
    assertEqual(proj.y, 0);
    assertEqual(proj.x, 5);
    assertEqual(proj.z, 5);
  }
};
