import { Euler } from '../../src/math/Euler.js';
import { Quat } from '../../src/math/Quat.js';
import { Vec3 } from '../../src/math/Vec3.js';
import { assertEqual, assertAlmostEqual } from '../assert.js';

export const EulerTests = {
  'constructor and order': () => {
    const e = new Euler(Math.PI / 4, 0, 0, 'XYZ');
    assertEqual(e.order, 'XYZ');
    assertAlmostEqual(e.x, Math.PI / 4);
  },
  'setFromQuaternion': () => {
    const q = new Quat().setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2);
    const e = new Euler().setFromQuaternion(q, 'XYZ');
    assertAlmostEqual(e.x, Math.PI / 2);
  }
};
