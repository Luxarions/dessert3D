import { Quat } from '../../src/math/Quat.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertEqual, assertAlmostEqual } from '../assert.js';

export const QuatTests = {
  'identity': () => {
    const q = new Quat();
    assertEqual(q.x, 0);
    assertEqual(q.y, 0);
    assertEqual(q.z, 0);
    assertEqual(q.w, 1);
  },
  'setFromAxisAngle': () => {
    const q = new Quat().setFromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2);
    assertAlmostEqual(q.y, Math.sin(Math.PI / 4));
    assertAlmostEqual(q.w, Math.cos(Math.PI / 4));
  },
  'slerp': () => {
    const q1 = new Quat();
    const q2 = new Quat().setFromAxisAngle(new Vec3(0, 1, 0), Math.PI);
    q1.slerp(q2, 0.5);
    assertAlmostEqual(q1.y, Math.sin(Math.PI / 4));
  }
};
